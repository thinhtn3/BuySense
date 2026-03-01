import { useState, useEffect, useRef } from 'react';

// Color per source type — matches the screenshot style
const TYPE_CHIP = {
  official: { bg: '#2ABFA3', color: '#fff' },
  review:   { bg: '#F5A623', color: '#fff' },
  video:    { bg: '#E25C5C', color: '#fff' },
  article:  { bg: '#3A9E5F', color: '#fff' },
};

function abbrev(source) {
  if (!source) return '?';
  return source.slice(0, 2).toUpperCase();
}

// ─── Citation chip — only rendered when a URL exists ─────────────────────────
function CitationChip({ resource }) {
  if (!resource?.url) return null;
  const chip = TYPE_CHIP[resource.type] ?? TYPE_CHIP.article;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="ci-citation"
      title={resource.title ?? resource.source}
      style={{ background: chip.bg }}
    >
      {resource.thumbnail ? (
        <img src={resource.thumbnail} alt={resource.source ?? ''} className="ci-citation__img" />
      ) : (
        <span className="ci-citation__abbrev" style={{ color: chip.color }}>
          {abbrev(resource.source)}
        </span>
      )}
    </a>
  );
}

// Resolves a single "P1-2" token string to a resource
function resolveRef(ref, sources, products) {
  const m = ref.trim().match(/^P(\d+)-(\d+)$/i);
  if (!m) return null;
  const product  = products[parseInt(m[1], 10) - 1];
  const resource = product ? sources?.[product.id]?.[parseInt(m[2], 10)] : null;
  return resource?.url ? resource : null;
}

// Parses "[P1-2]" or "[P1-2, P1-6]" tokens — renders chips, drops silently if no URL.
function WithCitations({ text, sources, products }) {
  if (!text || !sources || !products) return <>{text}</>;

  const parts = [];
  // Matches [P1-2] or [P1-2, P1-6] or [P1-2, P2-3] etc.
  const regex = /\[(P\d+-\d+(?:,\s*P\d+-\d+)*)\]/gi;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));

    const refs      = match[1].split(',');
    const resources = refs.map((r) => resolveRef(r, sources, products)).filter(Boolean);

    resources.forEach((resource, i) => {
      parts.push(<CitationChip key={`${match.index}-${i}`} resource={resource} />);
    });

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

// ─── Used Risk Section ────────────────────────────────────────────────────────
const RISK_CONFIG = {
  low:    { label: 'Low Risk',    color: '#2ABFA3', bg: '#E8F7F4' },
  medium: { label: 'Medium Risk', color: '#F5A623', bg: '#FEF3CD' },
  high:   { label: 'High Risk',   color: '#E25C5C', bg: '#FDECEA' },
};

function UsedRiskCard({ product, insight, sources, products }) {
  if (!insight) return null;
  const risk = RISK_CONFIG[insight.batteryRisk] ?? RISK_CONFIG.medium;

  return (
    <div className="ci-risk-card">
      <div className="ci-risk-card__header">
        <span className="ci-risk-card__name">{product.name}</span>
        <span
          className="ci-risk-card__badge"
          style={{ background: risk.bg, color: risk.color }}
        >
          {risk.label}
        </span>
      </div>

      {insight.batteryNote && (
        <div className="ci-risk-row">
          <span className="ci-risk-row__icon">🔋</span>
          <p className="ci-risk-row__text">
            <WithCitations text={insight.batteryNote} sources={sources} products={products} />
          </p>
        </div>
      )}

      {insight.topRisks?.length > 0 && (
        <div className="ci-risk-group">
          <p className="ci-risk-group__label">Watch Out For</p>
          <ul className="ci-risk-list">
            {insight.topRisks.map((r, i) => (
              <li key={i} className="ci-risk-item ci-risk-item--warn">
                <span aria-hidden="true">⚠</span>
                <span><WithCitations text={r} sources={sources} products={products} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insight.sellerChecklist?.length > 0 && (
        <div className="ci-risk-group">
          <p className="ci-risk-group__label">Before You Buy</p>
          <ul className="ci-risk-list">
            {insight.sellerChecklist.map((c, i) => (
              <li key={i} className="ci-risk-item ci-risk-item--check">
                <span aria-hidden="true">✓</span>
                <span><WithCitations text={c} sources={sources} products={products} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insight.worthIt && (
        <div className="ci-risk-verdict">
          <span className="ci-risk-verdict__icon">💡</span>
          <p className="ci-risk-verdict__text">
            <WithCitations text={insight.worthIt} sources={sources} products={products} />
          </p>
        </div>
      )}
    </div>
  );
}

function UsedRiskSection({ products, usedInsight, condition, sources }) {
  if (!usedInsight || condition === 'new') return null;

  const condLabel = condition === 'like_new' ? 'Like New' : 'Used';

  return (
    <div className="ci-block">
      <p className="ci-block__label">{condLabel} Market Risk Analysis</p>
      <div className="ci-risk-grid">
        {products.map((p) => (
          <UsedRiskCard
            key={p.id}
            product={p}
            insight={usedInsight[p.id]}
            sources={sources}
            products={products}
          />
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
export default function ComparisonInsights({ products, condition = 'new', compareKey = 0 }) {
  const [status,   setStatus]   = useState('idle');
  const [insights, setInsights] = useState(null);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState('overview');
  const prevKeyRef = useRef(0);

  // Auto-trigger whenever Compare is clicked (compareKey increments)
  useEffect(() => {
    if (compareKey > 0 && compareKey !== prevKeyRef.current && products.length > 0) {
      prevKeyRef.current = compareKey;
      handleGenerate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareKey]);

  if (!products.length) return null;

  async function handleGenerate() {
    setStatus('loading');
    setError(null);
    setTab('overview');

    try {
      const res = await fetch('/api/insights', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ productIds: products.map((p) => p.id), condition }),
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
        </div>
        <button
          className={`ci-generate-btn${status === 'loading' ? ' ci-generate-btn--loading' : ''}`}
          onClick={handleGenerate}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <><span className="ci-btn-spinner" />Generating…</>
          ) : (
            'Regenerate ↺'
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
              <UsedRiskSection
                products={products}
                usedInsight={insights.usedInsight}
                condition={condition}
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
