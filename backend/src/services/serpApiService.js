const SERP_API_URL = 'https://serpapi.com/search.json';

const CONDITION_PREFIX = {
  new:  '',
  used: 'used',
};

/**
 * Calls SerpAPI Google Shopping and returns all listings sorted cheapest first.
 * Each listing maps to a row shape compatible with the Supabase listings table.
 *
 * @returns {Array<{ retailer, price, url, freeShipping }>}
 */
export async function fetchListingsFromSerp(product, condition = 'new') {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) throw new Error('SERP_API_KEY is not configured');

  const cond   = condition === 'used' ? 'used' : 'new';
  const prefix = CONDITION_PREFIX[cond];
  const query  = [prefix, product.brand, product.name].filter(Boolean).join(' ');

  const tbs = cond === 'new' ? 'p_ord:p,pd_cond:1' : 'p_ord:p,pd_cond:2';

  const params = new URLSearchParams({
    engine:  'google_shopping',
    q:       query,
    api_key: apiKey,
    tbs,
    num:     '20',
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

  const data = await res.json();

  const listings = (data.shopping_results ?? [])
    .filter((r) => r.extracted_price != null)
    .map((r) => {
      const price  = r.extracted_price;
      const period = r.installment?.period ?? null;  // nested inside installment object

      return {
        retailer:     r.source       ?? 'Unknown',
        price,
        period,
        finalPrice:   period ? price * period : price,
        url:          r.product_link ?? r.link ?? null,
        title:        r.title        ?? null,
        imageUrl:     r.thumbnail    ?? null,
        freeShipping: (r.extensions ?? []).some((e) => /free\s*shipping/i.test(e)),
      };
    })
    .sort((a, b) => a.finalPrice - b.finalPrice);  // sort by true total cost

  console.log(`[serpApiService] found ${listings.length} listings for "${query}"`);
  return listings;
}
