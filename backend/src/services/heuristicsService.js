/**
 * Deterministic heuristics that produce decision signals for listings and comparisons.
 * These rules come directly from the BuySense product spec.
 */

/**
 * Labels a listing as "great_deal" | "fair_price" | "overpriced"
 * based on how its price compares to the market median.
 */
export function labelListing(price, marketMedian) {
  const ratio = price / marketMedian;
  if (ratio <= 0.9) return 'great_deal';
  if (ratio <= 1.1) return 'fair_price';
  return 'overpriced';
}

/**
 * Evaluates whether a used purchase is worth it compared to buying new.
 * @param {number} newPrice
 * @param {number} usedPrice
 * @param {'low'|'medium'|'high'} conditionRisk
 * @returns {{ worthIt: boolean, reason: string }}
 */
export function evaluateUsedWorthIt(newPrice, usedPrice, conditionRisk = 'low') {
  const savingsPct = ((newPrice - usedPrice) / newPrice) * 100;

  if (savingsPct < 10) {
    return { worthIt: false, reason: `Only ${savingsPct.toFixed(0)}% savings — not worth the used risk.` };
  }
  if (savingsPct >= 15 && conditionRisk === 'low') {
    return { worthIt: true, reason: `${savingsPct.toFixed(0)}% savings with low condition risk — worth it.` };
  }
  return { worthIt: null, reason: `${savingsPct.toFixed(0)}% savings but condition risk is ${conditionRisk} — borderline.` };
}

/**
 * Determines whether upgrading from product A to the pricier product B is justified.
 * @param {number} priceDelta
 * @param {'incremental'|'significant'|'major'} reviewerConsensus
 * @returns {{ justified: boolean, reason: string }}
 */
export function evaluateUpgradeJustification(priceDelta, reviewerConsensus) {
  if (priceDelta > 150 && reviewerConsensus === 'incremental') {
    return { justified: false, reason: `$${priceDelta} more for an incremental upgrade — recommend skipping.` };
  }
  return { justified: true, reason: `Upgrade appears worthwhile at $${priceDelta} price difference.` };
}

/**
 * Calculates a regret risk level.
 * @param {{ priceDelta: number, conditionRisk: string, hasReturnPolicy: boolean, reviewVolatility: string }} params
 * @returns {'low'|'medium'|'high'}
 */
export function calcRegretRisk({ priceDelta, conditionRisk, hasReturnPolicy, reviewVolatility }) {
  let score = 0;
  if (priceDelta > 150) score += 1;
  if (conditionRisk === 'high') score += 2;
  else if (conditionRisk === 'medium') score += 1;
  if (!hasReturnPolicy) score += 1;
  if (reviewVolatility === 'high') score += 1;

  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}
