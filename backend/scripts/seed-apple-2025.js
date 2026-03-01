/**
 * seed-apple-2025.js
 *
 * Inserts (or updates) Apple products from 2025–2026 into Supabase.
 * Safe to re-run — uses upsert with conflict on `id`.
 *
 * Usage:
 *   node backend/scripts/seed-apple-2025.js
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load env from backend/.env ──────────────────────────────────────────────
function loadEnv() {
  const envPath = join(__dirname, '../.env');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── Product data ─────────────────────────────────────────────────────────────
const APPLE_ICON   = 'https://img.icons8.com/fluency/96/iphone.png';
const LAPTOP_ICON  = 'https://img.icons8.com/fluency/96/laptop.png';
const AUDIO_ICON   = 'https://img.icons8.com/fluency/96/headphones.png';

const products = [

  // ────────────────────────────────────────────────────────────────────────────
  // PHONES — 2025
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 'iphone-16e-128gb',
    name: 'iPhone 16e',
    brand: 'Apple',
    category: 'phones',
    year: '2025',
    storage: '128GB',
    iconUrl: APPLE_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone16e-black-select-202502?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'A16 Bionic',
      ram: '6GB',
      storage: '128GB',
      camera: '48MP Single',
      battery: '3,279 mAh',
      display: '6.1" OLED',
      os: 'iOS 18',
    },
  },

  {
    id: 'iphone-17-128gb',
    name: 'iPhone 17',
    brand: 'Apple',
    category: 'phones',
    year: '2025',
    storage: '128GB',
    iconUrl: APPLE_ICON,
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17.jpg',
    specs: {
      chip: 'A19',
      ram: '8GB',
      storage: '128GB',
      camera: '48MP Dual',
      battery: '3,800 mAh',
      display: '6.1" OLED',
      os: 'iOS 19',
    },
  },

  {
    id: 'iphone-17-air-128gb',
    name: 'iPhone 17 Air',
    brand: 'Apple',
    category: 'phones',
    year: '2025',
    storage: '128GB',
    iconUrl: APPLE_ICON,
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-air.jpg',
    specs: {
      chip: 'A18',
      ram: '8GB',
      storage: '128GB',
      camera: '48MP Single',
      battery: '2,800 mAh',
      display: '6.6" OLED',
      os: 'iOS 19',
    },
  },

  {
    id: 'iphone-17-pro-256gb',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    category: 'phones',
    year: '2025',
    storage: '256GB',
    iconUrl: APPLE_ICON,
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro.jpg',
    specs: {
      chip: 'A19 Pro',
      ram: '12GB',
      storage: '256GB',
      camera: '48MP Triple',
      battery: '3,700 mAh',
      display: '6.3" OLED ProMotion',
      os: 'iOS 19',
    },
  },

  {
    id: 'iphone-17-pro-max-256gb',
    name: 'iPhone 17 Pro Max',
    brand: 'Apple',
    category: 'phones',
    year: '2025',
    storage: '256GB',
    iconUrl: APPLE_ICON,
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg',
    specs: {
      chip: 'A19 Pro',
      ram: '12GB',
      storage: '256GB',
      camera: '48MP Triple',
      battery: '4,900 mAh',
      display: '6.9" OLED ProMotion',
      os: 'iOS 19',
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // LAPTOPS — 2025
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 'macbook-air-15-m4',
    name: 'MacBook Air 15" M4',
    brand: 'Apple',
    category: 'laptops',
    year: '2025',
    iconUrl: LAPTOP_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-m4-skyblue-select-202503?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'Apple M4',
      ram: '16GB',
      storage: '256GB SSD',
      display: '15.3" Liquid Retina',
      battery: '66.5Wh',
      gpu: '10-core GPU',
      os: 'macOS Sequoia',
    },
  },

  {
    id: 'macbook-air-13-m5',
    name: 'MacBook Air 13" M5',
    brand: 'Apple',
    category: 'laptops',
    year: '2026',
    iconUrl: LAPTOP_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m4-skyblue-select-202503?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'Apple M5',
      ram: '16GB',
      storage: '256GB SSD',
      display: '13.6" Liquid Retina',
      battery: '53.2Wh',
      gpu: '10-core GPU',
      os: 'macOS Tahoe',
    },
  },

  {
    id: 'macbook-air-15-m5',
    name: 'MacBook Air 15" M5',
    brand: 'Apple',
    category: 'laptops',
    year: '2026',
    iconUrl: LAPTOP_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-m4-skyblue-select-202503?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'Apple M5',
      ram: '16GB',
      storage: '256GB SSD',
      display: '15.3" Liquid Retina',
      battery: '66.5Wh',
      gpu: '10-core GPU',
      os: 'macOS Tahoe',
    },
  },

  {
    id: 'macbook-pro-14-m5-pro',
    name: 'MacBook Pro 14" M5 Pro',
    brand: 'Apple',
    category: 'laptops',
    year: '2026',
    iconUrl: LAPTOP_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m4-pro-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'Apple M5 Pro',
      ram: '24GB',
      storage: '512GB SSD',
      display: '14.2" Liquid Retina XDR',
      battery: '72.4Wh',
      gpu: '20-core GPU',
      os: 'macOS Tahoe',
    },
  },

  {
    id: 'macbook-pro-16-m5-pro',
    name: 'MacBook Pro 16" M5 Pro',
    brand: 'Apple',
    category: 'laptops',
    year: '2026',
    iconUrl: LAPTOP_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-m4-max-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'Apple M5 Pro',
      ram: '24GB',
      storage: '512GB SSD',
      display: '16.2" Liquid Retina XDR',
      battery: '99.6Wh',
      gpu: '20-core GPU',
      os: 'macOS Tahoe',
    },
  },

  {
    id: 'macbook-pro-16-m5-max',
    name: 'MacBook Pro 16" M5 Max',
    brand: 'Apple',
    category: 'laptops',
    year: '2026',
    iconUrl: LAPTOP_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-m4-max-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90',
    specs: {
      chip: 'Apple M5 Max',
      ram: '36GB',
      storage: '1TB SSD',
      display: '16.2" Liquid Retina XDR',
      battery: '99.6Wh',
      gpu: '40-core GPU',
      os: 'macOS Tahoe',
    },
  },

  // ────────────────────────────────────────────────────────────────────────────
  // HEADPHONES — 2025
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: 'airpods-pro-3',
    name: 'AirPods Pro (3rd Gen)',
    brand: 'Apple',
    category: 'headphones',
    year: '2025',
    iconUrl: AUDIO_ICON,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MXK73?wid=1144&hei=1144&fmt=jpeg&qlt=90',
    specs: {
      type: 'In-ear TWS',
      driver: 'Custom H3',
      noiseCancelling: true,
      battery: '7h (30h case)',
      connectivity: 'Bluetooth 5.4',
      frequencyResponse: '20Hz–20kHz',
      weight: '5.1g (each)',
    },
  },

];

// ── Insert ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Seeding ${products.length} Apple products (2025–2026)…\n`);

  // Map camelCase image fields to the snake_case columns Supabase expects
  const rows = products.map(({ iconUrl, imageUrl, ...rest }) => ({
    ...rest,
    icon_url:  iconUrl  ?? null,
    image_url: imageUrl ?? null,
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' })
    .select('id, name, year');

  if (error) {
    console.error('❌  Supabase error:', error.message);
    process.exit(1);
  }

  console.log(`✅  Upserted ${data.length} products:\n`);
  for (const p of data) {
    console.log(`   • [${p.year}] ${p.name}  (${p.id})`);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
