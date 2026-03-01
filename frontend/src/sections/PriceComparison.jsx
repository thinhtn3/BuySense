import CATEGORY_EMOJI from '@/lib/categoryEmoji.js';

const CONDITION_LABELS = { new: 'New', like_new: 'Like New', used: 'Used' };

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
          <p className="price-card__price">{fmt(priceData.price)}</p>
          <p className="price-card__label">{CONDITION_LABELS[priceData.condition] ?? priceData.condition} avg.</p>
          {priceData.source && (
            <p className="price-card__source">via {priceData.source}</p>
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

function InsightBar({ products, priceMap }) {
  const withPrices = products.filter((p) => priceMap[p.id]?.price != null);
  if (withPrices.length < 2) return null;

  const sorted   = [...withPrices].sort((a, b) => priceMap[a.id].price - priceMap[b.id].price);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  const diff     = priceMap[priciest.id].price - priceMap[cheapest.id].price;
  const pct      = Math.round((diff / priceMap[priciest.id].price) * 100);

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
