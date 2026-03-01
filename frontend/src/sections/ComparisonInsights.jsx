function VerdictCard({ text }) {
  return (
    <div className="ci-verdict">
      <span className="ci-verdict__bar" aria-hidden="true" />
      <p className="ci-verdict__text">{text}</p>
    </div>
  );
}

function WinnerBanner({ winner, products }) {
  if (!winner?.productId) return null;
  const product = products.find((p) => p.id === winner.productId);
  if (!product) return null;
  return (
    <div className="ci-winner">
      <span className="ci-winner__icon" aria-hidden="true">🏆</span>
      <div>
        <span className="ci-winner__label">Top Pick</span>
        <span className="ci-winner__name">{product.name}</span>
        <span className="ci-winner__reason">{winner.reason}</span>
      </div>
    </div>
  );
}

function StrengthsWeaknessesGrid({ products, strengths, weaknesses }) {
  return (
    <div className="ci-block">
      <p className="ci-block__label">Strengths &amp; Weaknesses</p>
      <div className="ci-strengths-grid">
        {products.map((p) => (
          <div key={p.id} className="ci-strength-col">
            <p className="ci-strength-col__name">{p.name}</p>
            <ul className="ci-strength-list">
              {(strengths?.[p.id] ?? []).map((s, i) => (
                <li key={i} className="ci-strength-item">
                  <span className="ci-strength-item__dot ci-strength-item__dot--pro" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            {weaknesses?.[p.id]?.length > 0 && (
              <ul className="ci-strength-list" style={{ marginTop: 8 }}>
                {weaknesses[p.id].map((w, i) => (
                  <li key={i} className="ci-strength-item ci-strength-item--weak">
                    <span className="ci-strength-item__dot ci-strength-item__dot--con" aria-hidden="true" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DifferencesList({ items }) {
  return (
    <div className="ci-block">
      <p className="ci-block__label">Key Differences</p>
      <ul className="ci-diff-list">
        {items.map((d, i) => {
          const aspect = typeof d === 'object' ? d.aspect : null;
          const detail = typeof d === 'object' ? d.detail : d;
          return (
            <li key={i} className="ci-diff-item">
              <span className="ci-diff-item__num">{i + 1}</span>
              <span>
                {aspect && <strong className="ci-diff-item__aspect">{aspect}: </strong>}
                {detail}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BestForRow({ products, bestFor }) {
  return (
    <div className="ci-block">
      <p className="ci-block__label">Best For</p>
      <div className="ci-bestfor-grid">
        {products.map((p) => (
          <div key={p.id} className="ci-bestfor-col">
            <span className="ci-bestfor-col__name">{p.name}</span>
            <div className="ci-bestfor-tags">
              {(bestFor?.[p.id] ?? []).map((tag, i) => (
                <span key={i} className="ci-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ text }) {
  if (!text) return null;
  return (
    <div className="ci-block ci-recommendation">
      <p className="ci-block__label">Recommendation</p>
      <p className="ci-recommendation__text">{text}</p>
    </div>
  );
}

export default function ComparisonInsights({ products, insights }) {
  if (!products.length || !insights) return null;

  return (
    <section className="ci-section">
      <div className="ci-header">
        <div className="ci-header__left">
          <span className="ci-header__icon" aria-hidden="true">✦</span>
          <h2 className="ci-header__title">AI Insights</h2>
        </div>
      </div>

      <div className="ci-body">
        <VerdictCard text={insights.verdict} />
        <WinnerBanner winner={insights.winner} products={products} />
        <StrengthsWeaknessesGrid
          products={products}
          strengths={insights.strengths}
          weaknesses={insights.weaknesses}
        />
        {insights.differences?.length > 0 && (
          <DifferencesList items={insights.differences} />
        )}
        <BestForRow products={products} bestFor={insights.bestFor} />
        <RecommendationCard text={insights.recommendation} />
      </div>
    </section>
  );
}
