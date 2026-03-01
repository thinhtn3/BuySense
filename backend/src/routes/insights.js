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
  if (!resources.length) return `No sources available for ${product.brand} ${product.name}.`;

  const lines = resources.map((r, i) => {
    const rating = r.rating != null ? ` [${r.rating}/${r.rating_max ?? 10}]` : '';
    return `[${i + 1}] (${r.source ?? r.type}${rating}) ${r.title}\n    "${r.snippet}"`;
  });

  return `${product.brand} ${product.name} — sources:\n${lines.join('\n')}`;
}

// ─── POST /api/insights ───────────────────────────────────────────────────────
// Body: { productIds: string[] }
router.post('/', async (req, res, next) => {
  const { productIds } = req.body;

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
    ).join('\n\n');

    const productNames = products.map((p) => `${p.brand} ${p.name}`).join(' vs ');

    const prompt = `You are a concise electronics buying advisor. Use ONLY the provided source snippets as evidence.
When a pro or con is directly supported by a source, cite it by appending [P<product_index>-<source_number>] — e.g. [P1-2] means product 1, source 2.
Differences and bestFor must have NO citations — plain text only.
If no sources exist for a product, use general knowledge but do NOT add citations anywhere.

SOURCES:
${contextBlocks}

TASK: Compare ${productNames} and respond with ONLY valid JSON (no markdown, no code block) in this exact shape:
{
  "verdict": "2–3 sentence overall summary with citations where applicable",
  "pros": {
${products.map((p, i) => `    "${p.id}": ["pro sentence with optional [P${i + 1}-N] citation", ...]`).join(',\n')}
  },
  "cons": {
${products.map((p, i) => `    "${p.id}": ["con sentence with optional [P${i + 1}-N] citation", ...]`).join(',\n')}
  },
  "differences": ["plain difference — no citations", ...],
  "bestFor": {
${products.map((p, i) => `    "${p.id}": ["use case tag", ...]`).join(',\n')}
  }
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

    // Attach full source objects so the frontend can render citation chips
    res.json({
      ...parsed,
      sources: Object.fromEntries(
        products.map((p, i) => [p.id, sourceMaps[i]])
      ),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
