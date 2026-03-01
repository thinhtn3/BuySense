const SERP_API_URL = 'https://serpapi.com/search.json';

// Prepend a condition keyword so Google Shopping surfaces relevant results
const CONDITION_PREFIX = {
  new:      '',
  like_new: 'refurbished',
  used:     'used',
};

// ─── In-memory cache (6-hour TTL) ────────────────────────────────────────────
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

// ─── Single product lookup ────────────────────────────────────────────────────
export async function getCheapestPrice(product, condition = 'new') {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) throw new Error('SERP_API_KEY is not configured');

  const cond       = CONDITION_PREFIX[condition] !== undefined ? condition : 'new';
  const cacheKey   = `${product.id}::${cond}`;
  const cached     = getCached(cacheKey);
  if (cached) {
    console.log(`[serpApiService] cache hit — ${cacheKey}`);
    return { ...cached, fromCache: true };
  }

  const prefix  = CONDITION_PREFIX[cond];
  const query   = [prefix, product.brand, product.name].filter(Boolean).join(' ');

  const params = new URLSearchParams({
    engine:  'google_shopping',
    q:       query,
    api_key: apiKey,
    tbs:     'p_ord:p',   // sort by price low → high
    num:     '10',
    gl:      'us',
    hl:      'en',
  });

  console.log(`[serpApiService] fetching — "${query}" (${cond})`);

  const res = await fetch(`${SERP_API_URL}?${params}`, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SerpAPI error ${res.status}: ${body}`);
  }

  const data    = await res.json();
  const results = (data.shopping_results ?? [])
    .filter((r) => r.extracted_price != null)
    .sort((a, b) => a.extracted_price - b.extracted_price);

  if (!results.length) {
    console.warn(`[serpApiService] no results for "${query}"`);
    return null;
  }

  const top = results[0];
  const result = {
    productId:  product.id,
    condition:  cond,
    price:      top.extracted_price,
    currency:   'USD',
    title:      top.title,
    source:     top.source  ?? null,
    url:        top.link    ?? null,
    thumbnail:  top.thumbnail ?? null,
    fetchedAt:  Date.now(),
  };

  setCache(cacheKey, result);
  return result;
}

// ─── Batch lookup (one SerpAPI call per product) ──────────────────────────────
export async function getPricesForProducts(products, condition = 'new') {
  const results = await Promise.allSettled(
    products.map((p) => getCheapestPrice(p, condition))
  );

  return results.map((r, i) => ({
    productId: products[i].id,
    ...(r.status === 'fulfilled' ? r.value : { error: r.reason?.message ?? 'Failed' }),
  }));
}
