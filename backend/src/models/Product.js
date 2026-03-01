/**
 * Product model — represents a single electronics product (not a listing).
 * @typedef {Object} Product
 * @property {string} id           - Unique slug, e.g. "iphone-16-128gb"
 * @property {string} name         - Display name, e.g. "iPhone 16"
 * @property {string} brand        - e.g. "Apple"
 * @property {string} category     - One of: phones | laptops | headphones | soundsystems | tvs | gpus
 * @property {string} year         - Release year
 * @property {Object} specs        - Key/value spec pairs (chip, camera, battery, display, etc.)
 * @property {string} imageUrl     - Product image URL
 */

export function createProduct(data) {
  return {
    id: data.id,
    name: data.name,
    brand: data.brand,
    category: data.category,
    year: data.year,
    specs: data.specs ?? {},
    imageUrl: data.imageUrl ?? null,
    iconUrl: data.iconUrl ?? null,
  };
}
