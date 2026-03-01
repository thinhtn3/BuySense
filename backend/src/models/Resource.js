/**
 * Resource model — a review, article, or official page linked to a product.
 * @typedef {Object} Resource
 * @property {string}      id           - UUID from Supabase
 * @property {string}      productId    - References Product.id
 * @property {string}      type         - "official" | "review" | "article"
 * @property {string}      title        - Page title from SerpAPI
 * @property {string}      url          - Full URL to the resource
 * @property {string|null} source       - Hostname shortname (e.g. "theverge")
 * @property {string|null} snippet      - Short description excerpt from SerpAPI
 * @property {number|null} rating       - Numeric rating if surfaced (e.g. 8.5)
 * @property {number|null} ratingMax    - Rating scale ceiling (e.g. 10)
 * @property {string|null} publishedAt  - ISO date string or raw date string from SerpAPI
 * @property {string|null} thumbnail    - Favicon or thumbnail URL
 * @property {string}      createdAt    - ISO timestamp of when the row was inserted
 */

export function createResource(data) {
  return {
    id:          data.id          ?? null,
    productId:   data.product_id  ?? data.productId  ?? null,
    type:        data.type        ?? 'article',
    title:       data.title,
    url:         data.url,
    source:      data.source      ?? null,
    snippet:     data.snippet     ?? null,
    rating:      data.rating      ?? null,
    ratingMax:   data.rating_max  ?? data.ratingMax  ?? null,
    publishedAt: data.published_at ?? data.publishedAt ?? null,
    thumbnail:   data.thumbnail   ?? null,
    createdAt:   data.created_at  ?? data.createdAt  ?? null,
  };
}
