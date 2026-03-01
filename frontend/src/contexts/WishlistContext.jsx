import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [savedUrls, setSavedUrls] = useState(new Set());
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(false);

  // Load all saved items once user is known
  const refresh = useCallback(async () => {
    if (!user) {
      setSavedUrls(new Set());
      setItems([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const rows = data ?? [];
    setItems(rows);
    setSavedUrls(new Set(rows.map((r) => r.listing_url)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isSaved = useCallback((url) => savedUrls.has(url), [savedUrls]);

  const toggle = useCallback(async (listing) => {
    if (!user) return false;

    const url = listing.url;
    if (!url) return;

    if (savedUrls.has(url)) {
      // Optimistic remove
      setSavedUrls((prev) => { const s = new Set(prev); s.delete(url); return s; });
      setItems((prev) => prev.filter((item) => item.listing_url !== url));

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_url', url);

      if (error) {
        console.error('[WishlistContext] Error removing from wishlist:', error);
        // Rollback optimistic update (refresh is safer here)
        refresh();
      }
    } else {
      // Optimistic add
      const newItem = {
        user_id:       user.id,
        product_id:    listing.productId ?? '',
        listing_url:   url,
        listing_title: listing.title    ?? listing.retailer ?? 'Listing',
        price:         listing.finalPrice ?? listing.price ?? null,
        retailer:      listing.retailer  ?? null,
        image_url:     listing.imageUrl  ?? null,
        created_at:    new Date().toISOString(),
      };

      setSavedUrls((prev) => new Set([...prev, url]));
      setItems((prev) => [newItem, ...prev]);

      const { error } = await supabase.from('wishlists').insert({
        user_id:       newItem.user_id,
        product_id:    newItem.product_id,
        listing_url:   newItem.listing_url,
        listing_title: newItem.listing_title,
        price:         newItem.price,
        retailer:      newItem.retailer,
        image_url:     newItem.image_url,
      });

      if (error) {
        console.error('[WishlistContext] Error adding to wishlist:', error);
        // Rollback optimistic update
        setSavedUrls((prev) => { const s = new Set(prev); s.delete(url); return s; });
        setItems((prev) => prev.filter((item) => item.listing_url !== url));
      }
    }

    return true;
  }, [user, savedUrls]);

  return (
    <WishlistContext.Provider value={{ items, isSaved, toggle, isLoggedIn: !!user, loading, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
