-- ============================================================
-- BuySense — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────
create type product_category as enum (
  'phones', 'laptops', 'headphones', 'tvs', 'gpus', 'soundsystems'
);

create type listing_condition as enum ('new', 'like_new', 'used');

create type listing_label as enum ('great_deal', 'fair_price', 'overpriced');

-- ── products ─────────────────────────────────────────────────
create table if not exists products (
  id          text              primary key,        -- slug e.g. "iphone-16-128gb"
  name        text              not null,
  brand       text              not null,
  category    product_category  not null,
  year        text              not null,
  storage     text,                                 -- phones/laptops only
  icon_url    text,
  image_url   text,
  specs       jsonb             not null default '{}',
  created_at  timestamptz       not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_brand_idx    on products (brand);

-- ── listings ─────────────────────────────────────────────────
create table if not exists listings (
  id            text              primary key,
  product_id    text              not null references products (id) on delete cascade,
  retailer      text              not null,
  condition     listing_condition not null default 'new',
  price         numeric(10, 2)    not null,
  url           text,                                   -- product_link from SerpAPI
  title         text,                                   -- full listing title from SerpAPI
  image_url     text,                                   -- thumbnail from SerpAPI
  free_shipping boolean           not null default false,
  label         listing_label,
  created_at    timestamptz       not null default now(),
  updated_at    timestamptz       not null default now()
);

create index if not exists listings_product_id_idx  on listings (product_id);
create index if not exists listings_condition_idx   on listings (condition);
create index if not exists listings_price_idx       on listings (price);

-- auto-update updated_at on listings
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger listings_updated_at
  before update on listings
  for each row execute procedure update_updated_at();

-- ── comparisons (cache) ──────────────────────────────────────
-- Stores computed comparisons so the same pair isn't recalculated on every request.
create table if not exists comparisons (
  id             uuid              primary key default uuid_generate_v4(),
  product_a_id   text              not null references products (id) on delete cascade,
  product_b_id   text              not null references products (id) on delete cascade,
  condition      listing_condition not null default 'new',
  price_a        numeric(10, 2)    not null,
  price_b        numeric(10, 2)    not null,
  price_delta    numeric(10, 2)    not null,
  price_delta_pct integer          not null,
  insights       jsonb             not null default '[]',
  regret_risk    text              not null default 'low',
  created_at     timestamptz       not null default now(),
  -- one cached result per pair + condition
  unique (product_a_id, product_b_id, condition)
);

create index if not exists comparisons_pair_idx on comparisons (product_a_id, product_b_id);

-- ── Row Level Security ───────────────────────────────────────
-- Products and listings are read-only for anonymous users.
-- Writes require a service-role key (backend only).

alter table products    enable row level security;
alter table listings    enable row level security;
alter table comparisons enable row level security;

-- Allow anonymous reads
create policy "Public read products"
  on products for select using (true);

create policy "Public read listings"
  on listings for select using (true);

create policy "Public read comparisons"
  on comparisons for select using (true);
