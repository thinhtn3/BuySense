import { useState } from 'react';
import { createPortal } from 'react-dom';
import ListingsModal from '@/components/ListingsModal.jsx';

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

function ListingCard({ listing, isCheapest }) {
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

function ProductListingsGrid({ product, listings, condition, totalProducts }) {
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
  if (!products.length || !priceResults?.length) return null;

  const byProduct = Object.fromEntries(
    priceResults.map((r) => [r.productId, { listings: r.listings ?? [], condition: r.condition }])
  );

  if (!priceResults.some((r) => r.listings?.length > 0)) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-heading">Where to Buy</h2>

      <div className="ls-products">
        {products.map((p) => (
          <ProductListingsGrid
            key={p.id}
            product={p}
            listings={byProduct[p.id]?.listings}
            condition={byProduct[p.id]?.condition}
            totalProducts={products.length}
          />
        ))}
      </div>
    </section>
  );
}
