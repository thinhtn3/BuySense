import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabase.js';

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
