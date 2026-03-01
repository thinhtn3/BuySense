import CATEGORY_EMOJI from '@/lib/categoryEmoji.js';

const CONDITION_LABELS = { new: 'New', used: 'Used' };

function fmt(price) {
  return new Intl.NumberFormat('en-US', {
    style:               'currency',
    currency:            'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function PriceCard({ product, priceData }) {
  const emoji = CATEGORY_EMOJI[product?.category] ?? '📦';

  return (
    <div className="price-card">
      <span className="price-card__icon">{emoji}</span>
      <p className="price-card__name">{product.brand} {product.name}</p>

      {priceData?.price != null ? (
        <>
          <p className="price-card__price">{fmt(priceData.finalPrice ?? priceData.price)}</p>
          {priceData.period ? (
            <p className="price-card__instalment">
              {fmt(priceData.price)} × {priceData.period} mo
            </p>
          ) : null}
          <p className="price-card__label">{CONDITION_LABELS[priceData.condition] ?? priceData.condition} avg.</p>
          {priceData.label && (
            <span className={`price-card__badge price-card__badge--${priceData.label}`}>
              {priceData.label === 'great_deal' ? 'Great Deal' : priceData.label === 'fair_price' ? 'Fair Price' : 'Overpriced'}
            </span>
          )}
          {priceData.source && (
            <p className="price-card__source">
              via {priceData.source}
              {priceData.freeShipping && <span className="price-card__shipping"> · Free shipping</span>}
            </p>
          )}
          {priceData.listingCount > 1 && (
            <p className="price-card__count">from {priceData.listingCount} listings</p>
          )}
          {priceData.url && (
            <a
              className="price-card__link"
              href={priceData.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View listing ↗
            </a>
          )}
        </>
      ) : (
        <p className="price-card__unavailable">
          {priceData?.error ?? 'No listings found'}
        </p>
      )}
    </div>
  );
}

function getFinalPrice(entry) {
  return entry?.finalPrice ?? entry?.price ?? 0;
}

function InsightBar({ products, priceMap }) {
  const withPrices = products.filter((p) => priceMap[p.id]?.price != null);
  if (withPrices.length < 2) return null;

  const sorted   = [...withPrices].sort((a, b) => getFinalPrice(priceMap[a.id]) - getFinalPrice(priceMap[b.id]));
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  const cheapFinal  = getFinalPrice(priceMap[cheapest.id]);
  const priciestFinal = getFinalPrice(priceMap[priciest.id]);
  const diff     = priciestFinal - cheapFinal;
  const pct      = priciestFinal > 0 ? Math.round((diff / priciestFinal) * 100) : 0;

  if (diff <= 0) return null;

  return (
    <div className="price-insight">
      <span className="price-insight__text">
        <strong>{cheapest.brand} {cheapest.name}</strong>
        {' is '}
        <span className="price-insight__saving">{fmt(diff)} cheaper</span>
        {' than '}
        <strong>{priciest.brand} {priciest.name}</strong>
        {` (${pct}% less)`}
      </span>
    </div>
  );
}

export default function PriceComparison({ products, priceResults, condition }) {
  // Build a quick lookup map: productId → price entry
  const priceMap = Object.fromEntries(
    (priceResults ?? []).map((r) => [r.productId, r])
  );

  const condLabel = CONDITION_LABELS[condition] ?? condition;

  return (
    <section className="price-comparison">
      <div className="price-comparison__card">
        <h2 className="price-comparison__title">
          <span className="price-comparison__title-icon">↘</span>
          Price Comparison · {condLabel}
        </h2>

        <div className="price-cards-row">
          {products.map((p, i) => (
            <div key={p.id} className="price-card-wrapper">
              {i > 0 && <span className="price-vs">vs</span>}
              <PriceCard product={p} priceData={priceMap[p.id]} />
            </div>
          ))}
        </div>

        <InsightBar products={products} priceMap={priceMap} />
      </div>
    </section>
  );
}
