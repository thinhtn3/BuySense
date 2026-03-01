import { useState } from 'react';

// ─── Citation chip ────────────────────────────────────────────────────────────
// Parses "[P1-2]" tokens out of a string and replaces them with linked chips.
function WithCitations({ text, sources, products }) {
  if (!text || !sources || !products) return <>{text}</>;

  const parts = [];
  const regex = /\[P(\d+)-(\d+)\]/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    const productIdx = parseInt(match[1], 10) - 1;
    const sourceNum  = parseInt(match[2], 10);
    const product    = products[productIdx];
    const sourceMap  = product ? sources[product.id] : null;
    const resource   = sourceMap?.[sourceNum];

    if (resource) {
      parts.push(
        <a
          key={match.index}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ci-citation"
          title={resource.title}
        >
          {resource.thumbnail ? (
            <img src={resource.thumbnail} alt={resource.source ?? ''} className="ci-citation__img" />
          ) : (
            <span className="ci-citation__icon">
              {resource.type === 'official' ? '🔗' : resource.type === 'review' ? '⭐' : resource.type === 'video' ? '▶' : '📄'}
            </span>
          )}
          <span className="ci-citation__label">{resource.source ?? resource.type}</span>
        </a>
      );
    }

    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonBlock({ width = '100%', height = 14 }) {
  return (
    <span
      className="ci-skeleton"
      style={{ width, height: `${height}px`, display: 'block', borderRadius: 6 }}
    />
  );
}

function InsightSkeleton() {
  return (
    <div className="ci-skeleton-wrap">
      <SkeletonBlock width="75%" height={16} />
      <SkeletonBlock width="55%" height={14} />
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonBlock width="50%" height={13} />
          <SkeletonBlock width="90%" />
          <SkeletonBlock width="80%" />
          <SkeletonBlock width="85%" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonBlock width="50%" height={13} />
          <SkeletonBlock width="88%" />
          <SkeletonBlock width="75%" />
          <SkeletonBlock width="82%" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
        <SkeletonBlock width="30%" height={13} />
        <SkeletonBlock width="92%" />
        <SkeletonBlock width="78%" />
        <SkeletonBlock width="85%" />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function VerdictCard({ text, sources, products }) {
  return (
    <div className="ci-verdict">
      <span className="ci-verdict__bar" aria-hidden="true" />
      <p className="ci-verdict__text">
        <WithCitations text={text} sources={sources} products={products} />
      </p>
    </div>
  );
}

function StrengthsGrid({ products, strengths, sources }) {
  return (
    <div className="ci-block">
      <p className="ci-block__label">Strengths</p>
      <div className="ci-strengths-grid">
        {products.map((p) => (
          <div key={p.id} className="ci-strength-col">
            <p className="ci-strength-col__name">{p.name}</p>
            <ul className="ci-strength-list">
              {(strengths[p.id] ?? []).map((s, i) => (
                <li key={i} className="ci-strength-item">
                  <span className="ci-strength-item__dot" aria-hidden="true" />
                  <WithCitations text={s} sources={sources} products={products} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function DifferencesList({ items, sources, products }) {
  return (
    <div className="ci-block">
      <p className="ci-block__label">Key Differences</p>
      <ul className="ci-diff-list">
        {items.map((d, i) => (
          <li key={i} className="ci-diff-item">
            <span className="ci-diff-item__num">{i + 1}</span>
            <WithCitations text={d} sources={sources} products={products} />
          </li>
        ))}
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
              {(bestFor[p.id] ?? []).map((tag, i) => (
                <span key={i} className="ci-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ComparisonInsights({ products }) {
  const [status,   setStatus]   = useState('idle');   // idle | loading | ready | error
  const [insights, setInsights] = useState(null);
  const [error,    setError]    = useState(null);

  if (!products.length) return null;

  async function handleGenerate() {
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/insights', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productIds: products.map((p) => p.id) }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to generate insights.');
      }

      const data = await res.json();
      setInsights(data);
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <section className="ci-section">
      {/* Header row */}
      <div className="ci-header">
        <div className="ci-header__left">
          <span className="ci-header__icon" aria-hidden="true">✦</span>
          <h2 className="ci-header__title">AI Insights</h2>
          {status === 'idle' && (
            <span className="ci-header__hint">Click to generate a breakdown</span>
          )}
        </div>
        <button
          className={`ci-generate-btn${status === 'loading' ? ' ci-generate-btn--loading' : ''}`}
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <><span className="ci-btn-spinner" />Generating…</>
          ) : status === 'ready' ? (
            'Regenerate ↺'
          ) : (
            'Generate Insights →'
          )}
        </button>
      </div>

      {/* Body */}
      {status === 'loading' && <InsightSkeleton />}

      {status === 'error' && (
        <p className="ci-error">{error}</p>
      )}

      {status === 'ready' && insights && (
        <div className="ci-body">
          <VerdictCard
            text={insights.verdict}
            sources={insights.sources}
            products={products}
          />
          <StrengthsGrid
            products={products}
            strengths={insights.strengths}
            sources={insights.sources}
          />
          <DifferencesList
            items={insights.differences}
            sources={insights.sources}
            products={products}
          />
          <BestForRow products={products} bestFor={insights.bestFor} />
        </div>
      )}
    </section>
  );
}
