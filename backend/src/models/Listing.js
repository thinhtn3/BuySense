/**
 * Listing model — a specific offer for a product from a retailer.
 * @typedef {Object} Listing
 * @property {string} id           - Unique listing ID
 * @property {string} productId    - References Product.id
 * @property {string} retailer     - e.g. "Amazon", "Best Buy", "eBay"
 * @property {string} condition    - "new" | "like_new" | "used"
 * @property {number} price        - Listed price in USD
 * @property {string} url          - Deep link to the listing
 * @property {boolean} freeShipping
 * @property {string} label        - "great_deal" | "fair_price" | "overpriced" (set by heuristics)
 */

export function createListing(data) {
  return {
    id: data.id,
    productId: data.productId,
    retailer: data.retailer,
    condition: data.condition,
    price: data.price,
    url: data.url,
    freeShipping: data.freeShipping ?? false,
    label: data.label ?? null,
  };
}
