/**
 * Listing model — a specific offer for a product from a retailer.
 * @typedef {Object} Listing
 * @property {string}  id           - Unique listing ID
 * @property {string}  productId    - References Product.id
 * @property {string}  retailer     - e.g. "Amazon", "Best Buy"
 * @property {string}  condition    - "new" | "used"
 * @property {number}  price        - Listed price in USD
 * @property {string}  url          - product_link from SerpAPI (Google Shopping page)
 * @property {string}  title        - Full listing title from SerpAPI
 * @property {string}  imageUrl     - Thumbnail URL from SerpAPI
 * @property {boolean} freeShipping
 * @property {number|null} period   - Instalment months (e.g. 24). null = one-time purchase
 * @property {number}  finalPrice   - price * period if period exists, otherwise price
 * @property {string}  label        - "great_deal" | "fair_price" | "overpriced"
 * @property {string|null} labelReason - Human-readable rationale, e.g. "18% below market median"
 */

export function createListing(data) {
  const price = data.price;
  const period = data.period ?? null;
  const finalPrice = period ? price * period : price;

  return {
    id: data.id,
    productId: data.productId,
    retailer: data.retailer,
    condition: data.condition,
    price,
    period,
    finalPrice,
    url: data.url ?? null,
    title: data.title ?? null,
    imageUrl: data.imageUrl ?? null,
    freeShipping: data.freeShipping ?? false,
    label: data.label ?? null,
    labelReason: data.labelReason ?? null,
  };
}
