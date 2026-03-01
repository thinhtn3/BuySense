import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

/**
 * Loads the signed-in user's saved listing URLs from Supabase and
 * exposes toggle / isSaved helpers.
 */
export function useWishlist() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(new Set());

  // Load all saved URLs once user is known
  useEffect(() => {
    if (!user) { setSaved(new Set()); return; }

    supabase
      .from('wishlists')
      .select('listing_url')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setSaved(new Set((data ?? []).map((r) => r.listing_url)));
      });
  }, [user]);

  const isSaved = useCallback((url) => saved.has(url), [saved]);

  const toggle = useCallback(async (listing) => {
    if (!user) return false; // caller should open auth modal

    const url = listing.url;
    if (!url) return;

    if (saved.has(url)) {
      // Optimistic remove
      setSaved((prev) => { const s = new Set(prev); s.delete(url); return s; });
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_url', url);
    } else {
      // Optimistic add
      setSaved((prev) => new Set([...prev, url]));
      await supabase.from('wishlists').insert({
        user_id:       user.id,
        product_id:    listing.productId ?? '',
        listing_url:   url,
        listing_title: listing.title    ?? null,
        price:         listing.finalPrice ?? listing.price ?? null,
        retailer:      listing.retailer  ?? null,
      });
    }

    return true;
  }, [user, saved]);

  return { isSaved, toggle, isLoggedIn: !!user };
}
