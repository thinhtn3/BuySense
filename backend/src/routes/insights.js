import { Router }    from 'express';
import rateLimit      from 'express-rate-limit';
import { supabase }   from '../lib/supabase.js';
import { getAllProducts } from '../services/productService.js';
import { chat }       from '../services/geminiService.js';

const router = Router();

// 30 insight generations per IP per hour
const limiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             30,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests — please wait before generating again.' },
});

router.use(limiter);

// ─── Fetch stored resources for a product ────────────────────────────────────
async function getResources(productId) {
  const { data, error } = await supabase
    .from('resources')
    .select('id, title, url, source, snippet, type, rating, rating_max, thumbnail')
    .eq('product_id', productId)
    .not('snippet', 'is', null)
    .order('type')
    .limit(6);

  if (error) return [];
  return data ?? [];
}

// ─── Build a context block for one product ───────────────────────────────────
function buildContext(product, resources) {
  const specs = product.specs ?? {};
  const specLines = [
    specs.chip     && `Chip: ${specs.chip}`,
    specs.battery  && `Battery: ${specs.battery}`,
    specs.camera   && `Camera: ${specs.camera}`,
    specs.display  && `Display: ${specs.display}`,
    specs.ram      && `RAM: ${specs.ram}`,
    specs.os       && `OS: ${specs.os}`,
  ].filter(Boolean).join(', ');

  const header = [
    `${product.brand} ${product.name} (${product.year ?? 'unknown year'}, ${product.category})`,
    specLines && `Specs — ${specLines}`,
  ].filter(Boolean).join('\n');

  if (!resources.length) {
    return `${header}\nNo review sources available.`;
  }

  const lines = resources.map((r, i) => {
    const rating = r.rating != null ? ` [${r.rating}/${r.rating_max ?? 10}]` : '';
    return `[${i + 1}] (${r.source ?? r.type}${rating}) ${r.title}\n    "${r.snippet}"`;
  });

  return `${header}\nSources:\n${lines.join('\n')}`;
}

// ─── Build condition-specific used-risk prompt section ───────────────────────
function buildUsedRiskSection(products, condition) {
  if (condition === 'new') return '';

  const condLabel     = condition === 'like_new' ? 'like-new' : 'used';
  const ageWarning    = condition === 'used'
    ? 'Assume average usage of 1–2 years. Battery degradation is a real concern.'
    : 'Like-new means minimal usage. Battery health is usually ≥95%. Still has seller risk.';

  const productLines = products.map((p, i) => {
    const year     = p.year ? parseInt(p.year, 10) : null;
    const age      = year ? (new Date().getFullYear() - year) : null;
    const battery  = p.specs?.battery ?? null;
    const category = p.category ?? 'device';

    return [
      `Product ${i + 1}: ${p.brand} ${p.name}`,
      age  != null && `  Released: ${p.year} (${age} year${age !== 1 ? 's' : ''} old)`,
      battery      && `  Battery capacity: ${battery}`,
      `  Category: ${category}`,
    ].filter(Boolean).join('\n');
  }).join('\n\n');

  return `
USED-MARKET CONTEXT (condition = "${condLabel}"):
${ageWarning}

${productLines}

For EACH product provide a "usedInsight" block that gives buyers real fear-reduction:
- batteryRisk: "low" | "medium" | "high" (based on device age, category, and typical ${condLabel} usage patterns)
- batteryNote: One specific sentence — e.g. "A 2-year-old iPhone typically retains 85–90% battery capacity; anything below 80% should trigger a price renegotiation."
- topRisks: 3 concrete, product-specific risks a buyer should know (NOT generic — reference the actual model, age, and category)
- sellerChecklist: 3–4 actionable things to verify before purchasing this specific model ${condLabel} (e.g. "Request a screenshot of Settings > Battery > Battery Health", "Check if Apple warranty is still active via serial number")
- worthIt: One opinionated sentence — e.g. "At 20%+ savings with like-new condition, this is a strong buy — but only from a seller with 500+ reviews and 98%+ feedback."
`;
}

// ─── POST /api/insights ───────────────────────────────────────────────────────
// Body: { productIds: string[], condition?: string }
router.post('/', async (req, res, next) => {
  const { productIds, condition = 'new' } = req.body;

  if (!Array.isArray(productIds) || !productIds.length || productIds.length > 5) {
    return next(Object.assign(new Error('productIds must be an array of 1–5 IDs'), { status: 400 }));
  }

  try {
    const allProducts = await getAllProducts();
    const products    = productIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

    if (!products.length) {
      return next(Object.assign(new Error('No matching products found'), { status: 404 }));
    }

    // Fetch resources for all products in parallel
    const resourcesByProduct = await Promise.all(
      products.map((p) => getResources(p.id))
    );

    // Build source lookup: citation index → resource row (keyed per product)
    const sourceMaps = resourcesByProduct.map((resources) =>
      Object.fromEntries(resources.map((r, i) => [i + 1, r]))
    );

    // Build context blocks
    const contextBlocks = products.map((p, i) =>
      buildContext(p, resourcesByProduct[i])
    ).join('\n\n---\n\n');

    const usedRiskSection = buildUsedRiskSection(products, condition);
    const productNames    = products.map((p) => `${p.brand} ${p.name}`).join(' vs ');
    const isUsed          = condition !== 'new';

    const usedInsightShape = isUsed
      ? `,\n  "usedInsight": {\n${products.map((p) => `    "${p.id}": { "batteryRisk": "low|medium|high", "batteryNote": "...", "topRisks": ["..."], "sellerChecklist": ["..."], "worthIt": "..." }`).join(',\n')}\n  }`
      : '';

    const prompt = `You are a sharp, opinionated electronics buying advisor. Your job is to give buyers real confidence — or real warnings — not vague summaries.

CITATION RULES (follow exactly, no exceptions):
- Every pro and con MUST be backed by a real source — a published review, spec sheet, or forum post.
- Append [P<product_index>-<source_number>] at the END of any string that has a source.
  • product_index = which product (1 = first product listed, 2 = second, etc.)
  • source_number = integer starting at 1, matching the index in that product's "citedSources" array below
  Example: "Excellent battery life [P1-2]" means product 1, 2nd cited source
- NEVER write bare tokens like [P4] or [4] or (P4). The format is ALWAYS [P<digit>-<digit>].
- Differences and bestFor must have ZERO citation markers — plain text only.
- For EACH product, also output a "citedSources" array listing every publication/video/site you drew from.
  Each entry: { "source": "Site Name", "url": "https://...", "title": "Article or video title", "type": "review|official|video|article", "snippet": "One quote or key finding from the source (≤25 words)" }
  • source_number in [P<x>-N] must match the 1-based index in that product's citedSources array.
  • Only include sources you genuinely know exist. Do NOT fabricate URLs — use the real canonical URL for the review (e.g. https://www.pcmag.com/reviews/apple-iphone-15). If unsure of the exact URL, omit the source entirely rather than guessing.

PRODUCT CONTEXT:
${contextBlocks}
${usedRiskSection}
TASK: Compare ${productNames} (condition: ${condition}) and respond with ONLY valid JSON (no markdown, no code block):
{
  "winner": "one of [${products.map((p) => `\\"${p.id}\\"`).join(', ')}] — the exact product ID of the clear winner, or null if it is genuinely a tie",
  "verdict": "2–3 sharp sentences. Be opinionated. Reference the winner by name. Include citations where applicable.",
  "pros": {
${products.map((p, i) => `    "${p.id}": ["specific pro with [P${i + 1}-N] citation — required, not optional"]`).join(',\n')}
  },
  "cons": {
${products.map((p, i) => `    "${p.id}": ["specific con with [P${i + 1}-N] citation — required, not optional"]`).join(',\n')}
  },
  "differences": ["Numbered plain-text difference — be specific, not vague. Max 4 items."],
  "bestFor": {
${products.map((p, i) => `    "${p.id}": ["specific buyer persona tag, max 3"]`).join(',\n')}
  },
  "citedSources": {
${products.map((p, i) => `    "${p.id}": [{ "source": "...", "url": "https://...", "title": "...", "type": "review|official|video|article", "snippet": "..." }]`).join(',\n')}
  }${usedInsightShape}
}`;

    const raw = await chat(prompt);

    // Strip markdown code fences if Gemini wraps the JSON anyway
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return next(Object.assign(new Error('Failed to parse Gemini response as JSON'), { status: 502 }));
    }

    // Merge: prefer DB sources (real, pre-vetted); fall back to Gemini self-reported sources
    const mergedSources = Object.fromEntries(
      products.map((p, i) => {
        const dbMap = sourceMaps[i]; // { 1: resource, 2: resource, … }
        if (Object.keys(dbMap).length > 0) return [p.id, dbMap];

        // Convert Gemini's citedSources array → same 1-indexed map format
        const geminiList = parsed.citedSources?.[p.id] ?? [];
        const geminiMap  = Object.fromEntries(
          geminiList
            .filter((s) => s?.url && s.url.startsWith('http'))
            .map((s, idx) => [idx + 1, s])
        );
        return [p.id, geminiMap];
      })
    );

    // Strip citedSources from the client payload — it's been folded into sources
    const { citedSources: _dropped, ...rest } = parsed;

    res.json({
      ...rest,
      condition,
      sources: mergedSources,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
