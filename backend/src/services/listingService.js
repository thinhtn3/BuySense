import { supabase } from '../lib/supabase.js';
import { createListing } from '../models/Listing.js';
import { labelListing } from './heuristicsService.js';

// Market medians used for labelling — replace with live aggregation later
const MARKET_MEDIANS = {
  'iphone-16-128gb':       829,
  'iphone-16-pro-256gb':   999,
};

export async function getListingsForProduct(productId, condition = 'new') {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('product_id', productId)
    .eq('condition', condition)
    .order('price', { ascending: true });

  if (error) throw Object.assign(new Error(error.message), { status: 500 });

  const median = MARKET_MEDIANS[productId] ?? 0;

  return data.map((row) =>
    createListing({
      id:           row.id,
      productId:    row.product_id,
      retailer:     row.retailer,
      condition:    row.condition,
      price:        row.price,
      url:          row.url,
      freeShipping: row.free_shipping,
      label:        median > 0 ? labelListing(row.price, median) : row.label,
    })
  );
}
