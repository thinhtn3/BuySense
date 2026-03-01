# BuySense

**Decision-first electronics shopping.** BuySense collapses dozens of research tabs into a single page — compare products, see live pricing, read AI-generated insights, and get a clear purchase recommendation before you buy.

---

## What It Does

Most electronics research is fragmented: review sites, retailer pages, reseller listings, Reddit threads. BuySense centralises all of that into one decision view.

1. **Pick your products** — Search and select up to 3 models from the catalogue (phones, laptops, headphones, TVs, GPUs, sound systems). Add custom products if yours isn't listed.
2. **Set your condition** — New, Like New, or Used. The entire page adapts.
3. **Compare** — Live prices are fetched from SerpAPI and cached in Supabase. A price comparison card shows the best available price per product with deal labels (Great Deal / Fair Price / Overpriced).
4. **Read the specs** — A clean side-by-side specs table with tooltips.
5. **Get Our Take** — Hit "Generate Insights" and Gemini produces an opinionated verdict, pros/cons with hover citation chips, key differences, best-for tags, and (for used condition) a battery risk and seller checklist. A winner badge surfaces in the header when there's a clear winner.
6. **Browse listings** — All fetched listings ranked by effective price. Each card links directly to the retailer. Save to wishlist (requires sign-in via Supabase Auth).
7. **Read sources** — A resources panel shows review articles, videos, and official pages pulled from the database for each product.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Framer Motion, Lucide React, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini (`@google/generative-ai`) |
| Listings data | SerpAPI (Google Shopping) |
| Auth | Supabase Auth |

---

## Project Structure

```
BuySense/
├── frontend/               # React app (Vite)
│   └── src/
│       ├── sections/       # Page sections (ProductSelection, PriceComparison, etc.)
│       ├── components/     # Shared components (ProductSelector, WishlistPopup, etc.)
│       ├── lib/            # Utilities (wishlist store, category config)
│       └── index.css       # Global styles
│
└── backend/                # Express API
    ├── src/
    │   ├── routes/         # API routes (products, prices, insights, listings, etc.)
    │   ├── services/       # Business logic (listingService, geminiService, serpApiService)
    │   ├── models/         # Data models (Listing, Wishlist)
    │   └── lib/            # Supabase client
    ├── data/               # Local product JSON (fallback when Supabase is unavailable)
    └── scripts/            # Database seed scripts
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A [SerpAPI](https://serpapi.com) API key

---

### 1. Clone & install

```bash
git clone <repo-url>
cd BuySense

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Backend environment

Create `backend/.env`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# SerpAPI
SERP_API_KEY=your-serpapi-key

# Server
PORT=3001
```

---

### 3. Frontend environment

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### 4. Supabase schema

Run the following tables in your Supabase SQL editor:

```sql
-- Products
create table products (
  id          text primary key,
  name        text not null,
  brand       text,
  category    text,
  year        text,
  storage     text,
  icon_url    text,
  image_url   text,
  specs       jsonb default '{}'
);

-- Listings (cached from SerpAPI, TTL 24h)
create table listings (
  id            uuid primary key default gen_random_uuid(),
  product_id    text references products(id),
  retailer      text,
  condition     text,
  price         numeric,
  period        integer,
  final_price   numeric,
  url           text,
  title         text,
  image_url     text,
  free_shipping boolean default false,
  label         text,
  created_at    timestamptz default now()
);

-- Resources (review sources, used for citation chips)
create table resources (
  id          uuid primary key default gen_random_uuid(),
  product_id  text references products(id),
  title       text,
  url         text,
  source      text,
  snippet     text,
  type        text,   -- 'official' | 'review' | 'video' | 'article'
  rating      numeric,
  rating_max  numeric,
  thumbnail   text
);

-- Wishlist
create table wishlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id),
  listing_url text,
  listing     jsonb,
  created_at  timestamptz default now()
);
```

---

### 5. Run the app

In two terminals:

```bash
# Terminal 1 — backend (http://localhost:3001)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/products` | List all products (optional `?category=`) |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/products/custom` | Add a custom product by name |
| `GET` | `/api/prices` | Fetch best prices (`?productIds=a,b&condition=new`) |
| `GET` | `/api/resources` | Fetch review resources (`?productIds=a,b`) |
| `POST` | `/api/insights` | Generate AI insights (`{ productIds, condition }`) |
| `GET` | `/api/listings` | Get cached listings for a product |
| `GET` | `/health` | Health check |

Rate limits apply to `/api/prices` (10 req/hr) and `/api/insights` (30 req/hr) per IP. Requests are skipped when data is already cached.

---

## Key Design Decisions

- **Decision-first, not data-first.** The UI leads with an opinionated verdict, not a raw listing feed.
- **Listings are cached.** SerpAPI results are stored in Supabase for 24 hours to avoid hammering rate limits and to keep compare clicks fast.
- **Citation chips.** AI-generated pros/cons cite their sources inline. Hover a dotted-underline sentence to reveal coloured source chips that link to the original review.
- **Used market analysis.** When condition is Used or Like New, Gemini produces a battery risk rating, concrete watch-outs, and a seller checklist per product.
- **Graceful fallback.** If Supabase is unreachable, products fall back to a local JSON file.

---

## Author

Made with ♡ by Tony Nguyen
