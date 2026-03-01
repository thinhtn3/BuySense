/**
 * Uploads all products from data/products.json into Supabase.
 * Run after running seedProducts.js and after applying schema.sql.
 *
 * Usage: node backend/scripts/seedSupabase.js
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const products  = JSON.parse(readFileSync(join(__dirname, '../data/products.json'), 'utf-8'));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Map camelCase product keys → snake_case for Postgres
function toRow(p) {
  return {
    id:        p.id,
    name:      p.name,
    brand:     p.brand,
    category:  p.category,
    year:      p.year,
    storage:   p.storage ?? null,
    icon_url:  p.iconUrl  ?? null,
    image_url: p.imageUrl ?? null,
    specs:     p.specs    ?? {},
  };
}

async function seed() {
  console.log(`Seeding ${products.length} products into Supabase…`);

  const BATCH = 50;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH).map(toRow);

    const { error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Batch ${i}–${i + BATCH} failed:`, error.message);
      process.exit(1);
    }

    console.log(`  ✓ inserted rows ${i + 1}–${Math.min(i + BATCH, products.length)}`);
  }

  console.log('\n✅ Supabase products table seeded successfully.');
}

seed();
