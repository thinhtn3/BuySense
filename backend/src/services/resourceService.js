import { supabase } from '../lib/supabase.js';

const SERP_API_URL  = 'https://serpapi.com/search.json';
const RESOURCE_TTL  = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Domain → resource type detection ────────────────────────────────────────
const VIDEO_DOMAINS = [
  'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
];

const REVIEW_DOMAINS = [
  'pcmag.com', 'theverge.com', 'rtings.com', 'gsmarena.com',
  'notebookcheck.net', 'anandtech.com', 'techradar.com', 'cnet.com',
  'tomsguide.com', 'digitaltrends.com', 'engadget.com', 'tomshardware.com',
  '9to5mac.com', 'macrumors.com', 'androidauthority.com', 'dxomark.com',
  'soundguys.com', 'headphonezone.in', 'audiosciencereview.com',
  'wired.com', 'laptopmag.com', 'techspot.com',
];

const BRAND_OFFICIAL_DOMAINS = {
  apple:      'apple.com',
  samsung:    'samsung.com',
  google:     'store.google.com',
  sony:       'sony.com',
  lg:         'lg.com',
  bose:       'bose.com',
  nvidia:     'nvidia.com',
  amd:        'amd.com',
  microsoft:  'microsoft.com',
  asus:       'asus.com',
  lenovo:     'lenovo.com',
  dell:       'dell.com',
  hp:         'hp.com',
  oneplus:    'oneplus.com',
  jabra:      'jabra.com',
  sennheiser: 'sennheiser.com',
  jbl:        'jbl.com',
};

function classifyUrl(url, brandLower) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const officialDomain = BRAND_OFFICIAL_DOMAINS[brandLower];
    if (officialDomain && hostname.includes(officialDomain)) return 'official';
    if (VIDEO_DOMAINS.some((d) => hostname.includes(d)))     return 'video';
    if (REVIEW_DOMAINS.some((d) => hostname.includes(d)))    return 'review';
    return 'article';
  } catch {
    return 'article';
  }
}

function extractRating(result) {
  // SerpAPI sometimes surfaces ratings in rich_snippet
  const ext = result.rich_snippet?.top?.detected_extensions
           ?? result.rich_snippet?.bottom?.detected_extensions;
  if (!ext) return { rating: null, ratingMax: null };

  const rating    = ext.rating    ?? null;
  const ratingMax = ext.rating_max ?? (rating != null ? 10 : null);
  return { rating, ratingMax };
}

// ─── Fetch from SerpAPI Google Search ────────────────────────────────────────
async function fetchFromSerp(product) {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) throw new Error('SERP_API_KEY is not configured');

  const query = `${product.brand} ${product.name} review`;
  console.log(`[resourceService] fetching — "${query}"`);

  const params = new URLSearchParams({
    engine:  'google',
    q:       query,
    api_key: apiKey,
    num:     '10',
    gl:      'us',
    hl:      'en',
  });

  const res = await fetch(`${SERP_API_URL}?${params}`, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SerpAPI error ${res.status}: ${body}`);
  }

  const data    = await res.json();
  const organic = data.organic_results ?? [];
  const brandLower = product.brand.toLowerCase();

  return organic
    .filter((r) => r.link && r.title)
    .map((r) => {
      const { rating, ratingMax } = extractRating(r);
      return {
        product_id:   product.id,
        type:         classifyUrl(r.link, brandLower),
        title:        r.title,
        url:          r.link,
        source:       r.source ?? extractSource(r.link),
        snippet:      r.snippet ?? null,
        rating:       rating,
        rating_max:   ratingMax,
        published_at: r.date ?? null,
        thumbnail:    r.thumbnail ?? r.favicon ?? null,
      };
    });
}

function extractSource(url) {
  try {
    return new URL(url).hostname.replace('www.', '').split('.')[0];
  } catch {
    return null;
  }
}

// ─── Supabase read ────────────────────────────────────────────────────────────
async function readFromSupabase(productId) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('product_id', productId)
    .order('type')          // official first
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Supabase write ───────────────────────────────────────────────────────────
async function saveToSupabase(rows) {
  if (!rows.length) return;
  const { error } = await supabase.from('resources').insert(rows);
  if (error) console.warn('[resourceService] insert error:', error.message);
  else console.log(`[resourceService] saved ${rows.length} resources`);
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function getOrFetchResources(product) {
  const existing = await readFromSupabase(product.id);

  if (existing.length > 0) {
    const age = Date.now() - new Date(existing[0].created_at).getTime();
    if (age < RESOURCE_TTL) {
      console.log(`[resourceService] cache hit — ${product.id}, ${existing.length} resources`);
      return existing;
    }
    // Stale — delete and re-fetch
    await supabase.from('resources').delete().eq('product_id', product.id);
  }

  const rows = await fetchFromSerp(product);
  await saveToSupabase(rows);

  return await readFromSupabase(product.id);
}
