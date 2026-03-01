import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3-flash-preview';

let ai = null;
function getClient() {
  if (ai) return ai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  ai = new GoogleGenAI({ apiKey });
  return ai;
}

// ─── JSON schema returned to the client ───────────────────────────────────────
//
// {
//   verdict:        string          — one punchy summary sentence
//   winner:         { productId, reason } | null
//   strengths:      { [productId]: string[] }
//   weaknesses:     { [productId]: string[] }
//   differences:    { aspect: string, detail: string }[]
//   bestFor:        { [productId]: string[] }
//   recommendation: string          — 1-2 sentence final take
// }

function buildPrompt(products, priceMap) {
  // ── Product block ──────────────────────────────────────────────────────────
  const productBlock = products.map((p) => {
    const specs = p.specs
      ? Object.entries(p.specs)
          .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n')
      : '  (no spec data)';

    const price = priceMap[p.id];
    const priceStr = price
      ? [
          `  Cheapest (${price.condition}): $${price.finalPrice ?? price.price}`,
          price.period   ? `  Payment: $${price.price}/mo × ${price.period} months` : null,
          price.source   ? `  Retailer: ${price.source}` : null,
          price.label    ? `  Deal quality: ${price.label}` : null,
          `  Total listings found: ${price.listingCount ?? '?'}`,
        ].filter(Boolean).join('\n')
      : '  (no price data)';

    return [
      `### ${p.name} (id: ${p.id})`,
      `Brand: ${p.brand ?? 'Unknown'}   Category: ${p.category ?? 'Unknown'}`,
      'Specs:',
      specs,
      'Pricing:',
      priceStr,
    ].join('\n');
  }).join('\n\n');

  // ── Schema block ──────────────────────────────────────────────────────────
  const ids = products.map((p) => `"${p.id}"`).join(' | ');
  const schemaBlock = `
{
  "verdict": "<one punchy sentence summarising this comparison>",
  "winner": { "productId": <${ids} | null>, "reason": "<brief why>" },
  "strengths": {
    ${products.map((p) => `"${p.id}": ["<strength 1>", "<strength 2>", "<strength 3>"]`).join(',\n    ')}
  },
  "weaknesses": {
    ${products.map((p) => `"${p.id}": ["<weakness 1>", "<weakness 2>"]`).join(',\n    ')}
  },
  "differences": [
    { "aspect": "<category e.g. Display>", "detail": "<specific comparison>" },
    { "aspect": "...", "detail": "..." }
  ],
  "bestFor": {
    ${products.map((p) => `"${p.id}": ["<use case 1>", "<use case 2>", "<use case 3>"]`).join(',\n    ')}
  },
  "recommendation": "<1-2 sentence final buying recommendation>"
}`.trim();

  return `You are a concise, expert consumer electronics analyst helping shoppers decide what to buy.

Analyse the following product(s) and return a JSON insight object that EXACTLY matches the schema below.
Rules:
- Return ONLY the JSON object — no markdown fences, no extra text.
- Be specific and concrete. Avoid vague filler phrases.
- If only one product is provided, omit the "winner" field (set to null) and make insights about that product in isolation.
- Keep each string under 120 characters.
- differences array: 3–5 items, ordered most-important first.
- strengths/weaknesses: exactly 3 strengths and 2 weaknesses per product.
- bestFor: exactly 3 short use-case phrases per product (2–4 words each).

SCHEMA:
${schemaBlock}

PRODUCTS:
${productBlock}`;
}

// ─── Parse Gemini response safely ────────────────────────────────────────────
function parseInsights(raw) {
  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed  = JSON.parse(cleaned);

  // Normalise winner: null if no clear pick
  if (parsed.winner && !parsed.winner.productId) parsed.winner = null;

  return parsed;
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Generate AI insights for the given products.
 *
 * @param {object[]} products  - Full product objects (with specs)
 * @param {object[]} [prices]  - priceResults array from /api/prices (optional)
 * @returns {Promise<object>}  - Parsed insight JSON
 */
export async function generateInsights(products, prices = []) {
  const priceMap = Object.fromEntries(prices.map((p) => [p.productId, p]));
  const prompt   = buildPrompt(products, priceMap);

  console.log(`[insightService] generating insights for: ${products.map((p) => p.name).join(', ')}`);

  const response = await getClient().models.generateContent({
    model:    MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature:      0.4,
      topP:             0.9,
      systemInstruction: 'You are a consumer electronics expert. Return valid JSON only.',
    },
  });

  const raw = response.text;

  return parseInsights(raw);
}
