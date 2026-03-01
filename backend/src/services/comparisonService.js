import { supabase } from '../lib/supabase.js';
import { createComparison } from '../models/Comparison.js';
import { getProductById } from './productService.js';
import { evaluateUsedWorthIt, evaluateUpgradeJustification, calcRegretRisk } from './heuristicsService.js';

// Stub market prices — replace with live retailer API aggregation
const MARKET_PRICES = {
  'iphone-16-128gb':       { new: 829, like_new: 720, used: 620 },
  'iphone-16-pro-256gb':   { new: 999, like_new: 870, used: 790 },
};

function computeComparison(productA, productB, condition) {
  const pricesA = MARKET_PRICES[productA.id] ?? {};
  const pricesB = MARKET_PRICES[productB.id] ?? {};
  const priceA  = pricesA[condition] ?? 0;
  const priceB  = pricesB[condition] ?? 0;

  const insights = [];
  const delta    = Math.abs(priceB - priceA);
  const cheaper  = priceA <= priceB ? productA.name : productB.name;

  if (delta > 0) insights.push(`You save ~$${delta} choosing the ${cheaper}.`);

  if (condition === 'new') {
    const usedPriceB = pricesB['used'];
    if (usedPriceB) {
      const { worthIt, reason } = evaluateUsedWorthIt(priceB, usedPriceB, 'low');
      if (worthIt !== false)
        insights.push(`Going used on the ${productB.name} saves you ~$${priceB - usedPriceB}. ${reason}`);
    }
  }

  const { justified, reason: upgradeReason } = evaluateUpgradeJustification(delta, 'incremental');
  if (!justified) insights.push(upgradeReason);

  const regretRisk = calcRegretRisk({
    priceDelta: delta,
    conditionRisk: condition === 'new' ? 'low' : 'medium',
    hasReturnPolicy: true,
    reviewVolatility: 'low',
  });

  return createComparison({ productAId: productA.id, productBId: productB.id, condition, priceA, priceB, insights, regretRisk });
}

export async function buildComparison(productAId, productBId, condition = 'new') {
  const [productA, productB] = await Promise.all([
    getProductById(productAId),
    getProductById(productBId),
  ]);

  if (!productA || !productB) {
    throw Object.assign(new Error('One or both products not found'), { status: 404 });
  }

  // Return cached result if available
  const { data: cached } = await supabase
    .from('comparisons')
    .select('*')
    .eq('product_a_id', productAId)
    .eq('product_b_id', productBId)
    .eq('condition', condition)
    .maybeSingle();

  if (cached) {
    return createComparison({
      productAId:   cached.product_a_id,
      productBId:   cached.product_b_id,
      condition:    cached.condition,
      priceA:       cached.price_a,
      priceB:       cached.price_b,
      insights:     cached.insights,
      regretRisk:   cached.regret_risk,
    });
  }

  const result = computeComparison(productA, productB, condition);

  // Cache result — ignore conflicts (another request may have already inserted)
  await supabase.from('comparisons').upsert({
    product_a_id:    result.productAId,
    product_b_id:    result.productBId,
    condition:       result.condition,
    price_a:         result.priceA,
    price_b:         result.priceB,
    price_delta:     result.priceDelta,
    price_delta_pct: result.priceDeltaPct,
    insights:        result.insights,
    regret_risk:     result.regretRisk,
  }, { onConflict: 'product_a_id,product_b_id,condition', ignoreDuplicates: true });

  return result;
}
