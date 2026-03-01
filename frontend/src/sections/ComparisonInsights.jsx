import { useState } from 'react';

// ─── Citation chip — thumbnail/icon only, no label text ──────────────────────
function CitationChip({ resource }) {
  return (
    <a
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
    </a>
  );
}

// Parses "[P1-2]" tokens out of a string and replaces them with citation chips.
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
    const resource   = product ? sources?.[product.id]?.[sourceNum] : null;

    if (resource) {
      parts.push(<CitationChip key={match.index} resource={resource} />);
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
    </div>
  );
}

// ─── Tab 1: Overview ─────────────────────────────────────────────────────────

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

function ProsCons({ products, pros, cons, sources }) {
  return (
    <div className="ci-block">
      <p className="ci-block__label">Pros &amp; Cons</p>
      <div className="ci-proscons-grid">
        {products.map((p) => (
          <div key={p.id} className="ci-proscons-col">
            <p className="ci-proscons-col__name">{p.name}</p>

            <ul className="ci-pro-list">
              {(pros[p.id] ?? []).map((s, i) => (
                <li key={i} className="ci-pro-item">
                  <span className="ci-pro-item__dot" aria-hidden="true">+</span>
                  <span>
                    <WithCitations text={s} sources={sources} products={products} />
                  </span>
                </li>
              ))}
            </ul>

            <ul className="ci-con-list">
              {(cons[p.id] ?? []).map((s, i) => (
                <li key={i} className="ci-con-item">
                  <span className="ci-con-item__dot" aria-hidden="true">−</span>
                  <span>
                    <WithCitations text={s} sources={sources} products={products} />
                  </span>
                </li>
              ))}
            </ul>
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
        {items.map((d, i) => (
          <li key={i} className="ci-diff-item">
            <span className="ci-diff-item__num">{i + 1}</span>
            {d}
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

// ─── Tab 2: What People Are Saying ───────────────────────────────────────────

function QuoteCard({ resource, productName }) {
  if (!resource.snippet) return null;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="ci-quote-card"
    >
      <div className="ci-quote-card__header">
        {resource.thumbnail && (
          <img src={resource.thumbnail} alt="" className="ci-quote-card__favicon" />
        )}
        <span className="ci-quote-card__source">{resource.source ?? resource.type}</span>
        <span className="ci-quote-card__product">{productName}</span>
      </div>
      <p className="ci-quote-card__text">"{resource.snippet}"</p>
      <span className="ci-quote-card__link">Read more ↗</span>
    </a>
  );
}

function WhatPeopleSaying({ products, sources }) {
  const allQuotes = products.flatMap((p) =>
    Object.values(sources?.[p.id] ?? {})
      .filter((r) => r.snippet)
      .map((r) => ({ resource: r, productName: p.name }))
  );

  if (!allQuotes.length) {
    return <p className="ci-empty">No source snippets available for these products.</p>;
  }

  return (
    <div className="ci-quotes-grid">
      {allQuotes.map(({ resource, productName }, i) => (
        <QuoteCard key={i} resource={resource} productName={productName} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ComparisonInsights({ products }) {
  const [status,   setStatus]   = useState('idle');
  const [insights, setInsights] = useState(null);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState('overview');

  if (!products.length) return null;

  async function handleGenerate() {
    setStatus('loading');
    setError(null);
    setTab('overview');

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

      setInsights(await res.json());
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <section className="ci-section">
      {/* Header */}
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

      {status === 'loading' && <InsightSkeleton />}
      {status === 'error'   && <p className="ci-error">{error}</p>}

      {status === 'ready' && insights && (
        <>
          {/* Tabs */}
          <div className="ci-tabs">
            <button
              className={`ci-tab${tab === 'overview' ? ' ci-tab--active' : ''}`}
              onClick={() => setTab('overview')}
            >
              Overview
            </button>
            <button
              className={`ci-tab${tab === 'people' ? ' ci-tab--active' : ''}`}
              onClick={() => setTab('people')}
            >
              What People Are Saying
            </button>
          </div>

          {/* Tab 1 — Overview */}
          {tab === 'overview' && (
            <div className="ci-body">
              <VerdictCard
                text={insights.verdict}
                sources={insights.sources}
                products={products}
              />
              <ProsCons
                products={products}
                pros={insights.pros}
                cons={insights.cons}
                sources={insights.sources}
              />
              <DifferencesList items={insights.differences} />
              <BestForRow products={products} bestFor={insights.bestFor} />
            </div>
          )}

          {/* Tab 2 — What People Are Saying */}
          {tab === 'people' && (
            <div className="ci-body">
              <WhatPeopleSaying products={products} sources={insights.sources} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
