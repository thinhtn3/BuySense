/**
 * Comparison model — the result of comparing two products.
 * @typedef {Object} Comparison
 * @property {string} productAId
 * @property {string} productBId
 * @property {string} condition       - "new" | "like_new" | "used"
 * @property {number} priceA          - Market avg price for product A
 * @property {number} priceB          - Market avg price for product B
 * @property {number} priceDelta      - priceB - priceA
 * @property {number} priceDeltaPct   - percentage difference
 * @property {string[]} insights      - Plain-language decision signals
 * @property {string}  regretRisk     - "low" | "medium" | "high"
 */

export function createComparison(data) {
  const delta = data.priceB - data.priceA;
  const deltaPct = data.priceA > 0 ? Math.round((delta / data.priceA) * 100) : 0;

  return {
    productAId: data.productAId,
    productBId: data.productBId,
    condition: data.condition ?? 'new',
    priceA: data.priceA,
    priceB: data.priceB,
    priceDelta: delta,
    priceDeltaPct: deltaPct,
    insights: data.insights ?? [],
    regretRisk: data.regretRisk ?? 'low',
  };
}
