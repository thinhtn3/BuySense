/**
 * Wishlist model — a saved listing by a user.
 * @typedef {Object} WishlistItem
 * @property {string} id           - UUID from Supabase
 * @property {string} userId       - References auth.users.id
 * @property {string} productId    - References Product.id (or slug)
 * @property {string} listingUrl   - The unique URL of the listing
 * @property {string} listingTitle - Title of the listing
 * @property {number} price        - Price at the time of saving
 * @property {string} retailer     - e.g. "Amazon", "Best Buy"
 * @property {string} createdAt    - ISO timestamp
 */

export function createWishlistItem(data) {
  return {
    id:           data.id,
    userId:       data.user_id    ?? data.userId,
    productId:    data.product_id ?? data.productId,
    listingUrl:   data.listing_url ?? data.listingUrl,
    listingTitle: data.listing_title ?? data.listingTitle ?? 'Listing',
    price:        parseFloat(data.price ?? 0),
    retailer:     data.retailer   ?? null,
    createdAt:    data.created_at ?? data.createdAt,
  };
}
