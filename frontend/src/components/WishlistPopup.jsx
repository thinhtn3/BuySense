import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/lib/wishlist.js';

function fmt(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function WishlistPopup() {
  const { items, toggle, isLoggedIn, loading } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) return null;

  return (
    <div className="wp-wrap">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="wp-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="wp-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="wp-header">
                <h3 className="wp-title">My Wishlist</h3>
                <span className="wp-count">{items.length} items</span>
                <button className="wp-close" onClick={() => setIsOpen(false)}>✕</button>
              </div>

              <div className="wp-body">
                {items.length === 0 ? (
                  <div className="wp-empty">
                    <span className="wp-empty-icon">❤️</span>
                    <p>Your wishlist is empty.</p>
                    <p className="wp-empty-sub">Save deals you like to track them here.</p>
                  </div>
                ) : (
                  <div className="wp-list">
                    {items.map((item) => (
                      <a
                        key={item.listing_url}
                        href={item.listing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wp-item"
                      >
                        <div className="wp-item-img-wrap">
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="wp-item-img" />
                          ) : (
                            <span className="wp-item-img-placeholder">🛍</span>
                          )}
                        </div>
                        <div className="wp-item-info">
                          <span className="wp-item-title">{item.listing_title}</span>
                          <div className="wp-item-meta">
                            <span className="wp-item-retailer">{item.retailer}</span>
                          </div>
                        </div>
                        <div className="wp-item-right">
                          <span className="wp-item-price">{fmt(item.price)}</span>
                          <button
                            className="wp-item-remove"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle({ url: item.listing_url }); }}
                            title="Remove from wishlist"
                          >
                            ✕
                          </button>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        className={`wp-trigger${isOpen ? ' wp-trigger--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Wishlist"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {items.length > 0 && <span className="wp-badge">{items.length}</span>}
      </button>
    </div>
  );
}
