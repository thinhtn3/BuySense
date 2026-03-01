import { randomUUID }            from 'crypto';
import { supabase }              from '../lib/supabase.js';
import { createListing }         from '../models/Listing.js';
import { labelListingWithReason } from './heuristicsService.js';
import { fetchListingsFromSerp } from './serpApiService.js';

// Re-fetch listings older than 24 hours
const LISTING_TTL_MS = 24 * 60 * 60 * 1000;

// ─── Read existing listings from Supabase ────────────────────────────────────
async function readFromSupabase(productId, condition) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('product_id', productId)
    .eq('condition', condition);

  if (error) throw new Error(error.message);

  // Sort by effective price (final_price takes priority over base price)
  // so that discounted listings rank correctly instead of by their pre-discount price
  return (data ?? []).sort((a, b) => {
    const ea = parseFloat(a.final_price ?? a.price);
    const eb = parseFloat(b.final_price ?? b.price);
    return ea - eb;
  });
}

// ─── Persist SerpAPI results into Supabase ────────────────────────────────────
const MIN_LISTING_PRICE = 150;

async function saveListings(productId, condition, serpListings) {
  const eligible = serpListings.filter((l) => (l.finalPrice ?? l.price) >= MIN_LISTING_PRICE);
  if (!eligible.length) return;

  const rows = eligible.map((l) => ({
    id:            randomUUID(),
    product_id:    productId,
    retailer:      l.retailer,
    condition,
    price:         l.price,
    period:        l.period      ?? null,
    final_price:   l.finalPrice,
    url:           l.url,
    title:         l.title       ?? null,
    image_url:     l.imageUrl    ?? null,
    free_shipping: l.freeShipping,
    label:         null,
  }));

  const { error } = await supabase.from('listings').insert(rows);
  if (error) console.warn('[listingService] Supabase insert error:', error.message);
  else console.log(`[listingService] saved ${rows.length} listings for ${productId} (${condition})`);
}

// ─── Shape a Supabase row into a Listing model, computing label on the fly ───
function toListingModel(row, medianPrice) {
  return createListing({
    id:           row.id,
    productId:    row.product_id,
    retailer:     row.retailer,
    condition:    row.condition,
    price:        parseFloat(row.price),
    period:       row.period      ?? null,
    url:          row.url,
    title:        row.title       ?? null,
    imageUrl:     row.image_url   ?? null,
    freeShipping: row.free_shipping,
    // label + reason based on finalPrice so comparisons reflect true total cost
    ...(() => {
      if (medianPrice <= 0) return { label: null, labelReason: null };
      const { label, reason } = labelListingWithReason(row.final_price ?? parseFloat(row.price), medianPrice);
      return { label, labelReason: reason };
    })(),
  });
}

// ─── Public: check Supabase first, fall back to SerpAPI ──────────────────────
export async function getOrFetchListings(product, condition = 'new') {
  const cond = condition === 'used' ? 'used' : 'new';

  // 1 — Check Supabase for fresh listings
  let rows = await readFromSupabase(product.id, cond);

  if (rows.length > 0) {
    const age = Date.now() - new Date(rows[0].created_at).getTime();
    if (age < LISTING_TTL_MS) {
      console.log(`[listingService] Supabase cache hit — ${product.id} (${cond}), ${rows.length} listings`);
      const median = computeMedian(rows.map((r) => parseFloat(r.final_price ?? r.price)));
      return rows.map((r) => toListingModel(r, median));
    }

    // Stale — delete and re-fetch
    console.log(`[listingService] listings stale for ${product.id} (${cond}), refreshing…`);
    await supabase.from('listings').delete()
      .eq('product_id', product.id)
      .eq('condition', cond);
  }

  // 2 — Fetch from SerpAPI
  const serpListings = await fetchListingsFromSerp(product, cond);
  if (!serpListings.length) return [];

  // 3 — Persist to Supabase
  await saveListings(product.id, cond, serpListings);

  // 4 — Re-read from Supabase (so labels are applied consistently)
  rows = await readFromSupabase(product.id, cond);
  const median = computeMedian(rows.map((r) => parseFloat(r.final_price ?? r.price)));
  return rows.map((r) => toListingModel(r, median));
}

// ─── Cache check used by rate limiter skip ────────────────────────────────────
export async function hasFreshListings(productId, condition = 'new') {
  const cond = condition === 'used' ? 'used' : 'new';
  const rows = await readFromSupabase(productId, cond);
  if (!rows.length) return false;
  const age = Date.now() - new Date(rows[0].created_at).getTime();
  return age < LISTING_TTL_MS;
}

// ─── Legacy helper used by /api/listings route ────────────────────────────────
export async function getListingsForProduct(productId, condition = 'new') {
  const rows = await readFromSupabase(productId, condition);
  const median = computeMedian(rows.map((r) => parseFloat(r.final_price ?? r.price)));
  return rows.map((r) => toListingModel(r, median));
}

function computeMedian(prices) {
  if (!prices.length) return 0;
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
