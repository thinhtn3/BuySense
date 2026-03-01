import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LABEL_CONFIG = {
  great_deal: { text: 'Great Deal', cls: 'ls-badge--great' },
  fair_price: { text: 'Fair Price', cls: 'ls-badge--fair'  },
  overpriced: { text: 'Overpriced', cls: 'ls-badge--over'  },
};

function fmt(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ModalListingCard({ listing, isCheapest, index }) {
  const lbl = LABEL_CONFIG[listing.label];

  return (
    <motion.a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`lm-card${isCheapest ? ' lm-card--best' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.12 + index * 0.045,
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Image */}
      <div className="lm-card__img-wrap">
        {listing.imageUrl
          ? <img src={listing.imageUrl} alt={listing.title ?? ''} className="lm-card__img" />
          : <span className="lm-card__img-placeholder" aria-hidden="true">🛍</span>
        }
        {isCheapest && (
          <span className="lm-card__best-pill">Cheapest</span>
        )}
      </div>

      {/* Body */}
      <div className="lm-card__body">
        <p className="lm-card__title">
          {listing.title ?? listing.retailer ?? 'View listing'}
        </p>
        {listing.retailer && (
          <p className="lm-card__retailer">{listing.retailer}</p>
        )}
      </div>

      {/* Footer */}
      <div className="lm-card__footer">
        <div className="lm-card__price-wrap">
          <span className="lm-card__price">
            {fmt(listing.finalPrice ?? listing.price)}
          </span>
          {listing.period && (
            <span className="lm-card__instalment">
              {fmt(listing.price)}/mo × {listing.period}
            </span>
          )}
        </div>
        <div className="lm-card__footer-right">
          {listing.freeShipping && (
            <span className="lm-card__ship">Free shipping</span>
          )}
          {lbl && (
            <span className={`ls-badge ${lbl.cls}`}>{lbl.text}</span>
          )}
        </div>
      </div>
    </motion.a>
  );
}

export default function ListingsModal({ product, listings, condition, onClose }) {
  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const sorted     = [...listings].sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price));
  const cheapestId = sorted[0]?.id;
  const condLabel  = condition === 'used' ? 'Used' : 'New';

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="lm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="lm-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`All listings for ${product.name}`}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{
          duration: 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="lm-header">
          <div className="lm-header__left">
            <span className="lm-header__title">{product.name}</span>
            <span className="lm-header__meta">
              {condLabel} · {sorted.length} listing{sorted.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button className="lm-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Scrollable grid */}
        <div className="lm-body">
          <div className="lm-grid">
            {sorted.map((l, i) => (
              <ModalListingCard
                key={l.id}
                listing={l}
                isCheapest={l.id === cheapestId}
                index={i}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
