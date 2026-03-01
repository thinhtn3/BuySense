import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabase.js';
import { randomUUID } from 'crypto';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const LOCAL_DATA = JSON.parse(
  readFileSync(join(__dirname, '../../data/products.json'), 'utf-8')
);

async function fromSupabase(category) {
  let query = supabase.from('products').select('*').order('brand').order('name');
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

function fromLocal(category) {
  const all = LOCAL_DATA;
  return category ? all.filter((p) => p.category === category) : all;
}

export async function getAllProducts(category) {
  try {
    return await fromSupabase(category);
  } catch {
    console.warn('[productService] Supabase unavailable — using local JSON fallback');
    return fromLocal(category);
  }
}

/**
 * Full-text search by name across Supabase products.
 * Returns matching rows (up to 10).
 */
export async function searchProductsByName(query) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

/**
 * Creates a minimal product stub in Supabase from a free-text query.
 * Returns the created row.
 */
export async function createCustomProduct(rawName) {
  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const id = `custom-${slug}-${randomUUID().slice(0, 8)}`;

  const row = {
    id,
    name:     rawName,
    brand:    'Unknown',
    category: 'phones',  // default; user can't set category in this flow
    year:     new Date().getFullYear().toString(),
    specs:    {},
  };

  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  } catch {
    console.warn('[productService] Supabase unavailable — using local JSON fallback');
    return LOCAL_DATA.find((p) => p.id === id) ?? null;
  }
}
