import { useState } from 'react';
import { createPortal } from 'react-dom';
import ListingsModal from '@/components/ListingsModal.jsx';
import { useWishlist } from '@/lib/wishlist.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import AuthModal from '@/components/AuthModal.jsx';

const LABEL_CONFIG = {
  great_deal: { text: 'Great Deal', cls: 'ls-badge--great' },
  fair_price: { text: 'Fair Price', cls: 'ls-badge--fair'  },
  overpriced: { text: 'Overpriced', cls: 'ls-badge--over'  },
};

const CONDITION_LABEL = { new: 'New', used: 'Used' };
const COLLAPSED_COUNT      = 4;
const COLLAPSED_COUNT_MANY = 2; // show ~1.5 when 3 products

function fmt(n) {
  if (n == null) return '—';
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function WishlistBtn({ listing, isSaved, onToggle }) {
  const active = isSaved(listing.url);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onToggle(listing);
  }

  return (
    <button
      className={`wl-btn${active ? ' wl-btn--saved' : ''}`}
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      title={active ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

function ListingCard({ listing, isCheapest, isSaved, onWishlist }) {
  const lbl = LABEL_CONFIG[listing.label];

  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`ls-card${isCheapest ? ' ls-card--best' : ''}`}
    >
      <div className="ls-card__top">
        {listing.imageUrl
          ? <img src={listing.imageUrl} alt={listing.title ?? ''} className="ls-card__img" />
          : <span className="ls-card__img-placeholder" aria-hidden="true">🛍</span>
        }
        <div className="ls-card__badges">
          {isCheapest && <span className="ls-card__best-pill">Cheapest</span>}
          {lbl && <span className={`ls-badge ${lbl.cls}`}>{lbl.text}</span>}
        </div>
        {listing.url && (
          <WishlistBtn listing={listing} isSaved={isSaved} onToggle={onWishlist} />
        )}
      </div>

      <p className="ls-card__title">
        {listing.title ?? listing.retailer ?? 'View listing'}
      </p>

      {listing.retailer && (
        <p className="ls-card__retailer">{listing.retailer}</p>
      )}

      <div className="ls-card__footer">
        <div className="ls-card__price-wrap">
          <span className="ls-card__price">
            {fmt(listing.finalPrice ?? listing.price)}
          </span>
          {listing.period && (
            <span className="ls-card__instalment">
              {fmt(listing.price)}/mo × {listing.period}
            </span>
          )}
          {listing.labelReason && (
            <span className="ls-card__reason">{listing.labelReason}</span>
          )}
        </div>
        {listing.freeShipping && (
          <span className="ls-card__ship">Free shipping</span>
        )}
      </div>
    </a>
  );
}

function ProductListingsGrid({ product, listings, condition, totalProducts, isSaved, onWishlist }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!listings?.length) return null;

  const limit      = totalProducts >= 3 ? COLLAPSED_COUNT_MANY : COLLAPSED_COUNT;
  const sorted     = [...listings].sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price));
  const cheapestId = sorted[0]?.id;
  const preview    = sorted.slice(0, limit);
  const hasMore    = sorted.length > limit;

  return (
    <>
      <div className="ls-product-block">
        <div className="ls-product-header">
          <span className="ls-product-name">{product.name}</span>
          <span className="ls-product-meta">
            {CONDITION_LABEL[condition] ?? condition} · {listings.length} listing{listings.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="ls-grid-outer">
          <div className="ls-grid-wrap">
            <div className={`ls-grid${totalProducts >= 3 ? ' ls-grid--col' : ''}`}>
              {preview.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  isCheapest={l.id === cheapestId}
                  isSaved={isSaved}
                  onWishlist={onWishlist}
                />
              ))}
            </div>

            {hasMore && <div className="ls-fade" aria-hidden="true" />}
          </div>

          {hasMore && (
            <button
              className="ls-toggle-btn"
              onClick={() => setModalOpen(true)}
            >
              View all {sorted.length} listings →
            </button>
          )}
        </div>
      </div>

      {modalOpen && createPortal(
        <ListingsModal
          product={product}
          listings={listings}
          condition={condition}
          onClose={() => setModalOpen(false)}
        />,
        document.body
      )}
    </>
  );
}

export default function ListingsSection({ products, priceResults }) {
  const { isSaved, toggle, isLoggedIn } = useWishlist();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!products.length || !priceResults?.length) return null;

  const byProduct = Object.fromEntries(
    priceResults.map((r) => [r.productId, { listings: r.listings ?? [], condition: r.condition }])
  );

  if (!priceResults.some((r) => r.listings?.length > 0)) return null;

  function handleWishlist(listing) {
    if (!isLoggedIn) { setAuthModalOpen(true); return; }
    toggle(listing);
  }

  return (
    <section className="ls-section">
      <div className="section-heading">
        <span className="section-heading__icon" aria-hidden="true">✦</span>
        <h2>Where to Buy</h2>
      </div>

      <div className="ls-products">
        {products.map((p) => (
          <ProductListingsGrid
            key={p.id}
            product={p}
            listings={byProduct[p.id]?.listings}
            condition={byProduct[p.id]?.condition}
            totalProducts={products.length}
            isSaved={isSaved}
            onWishlist={handleWishlist}
          />
        ))}
      </div>

      {authModalOpen && createPortal(
        <AuthModal onClose={() => setAuthModalOpen(false)} />,
        document.body
      )}
    </section>
  );
}
