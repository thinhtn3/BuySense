import { useState } from 'react';

// ─── Placeholder data (swap with Gemini response later) ───────────────────────
function buildPlaceholder(products) {
  const names = products.map((p) => p.name);
  const [a, b] = names;

  return {
    verdict: b
      ? `${a} and ${b} are closely matched, but each excels in different areas depending on your priorities.`
      : `${a} is a strong all-rounder — here's what you should know before buying.`,

    strengths: Object.fromEntries(
      products.map((p) => [
        p.id,
        [
          'Placeholder strength — e.g. best-in-class display',
          'Placeholder strength — e.g. longer battery life',
          'Placeholder strength — e.g. wider software support',
        ],
      ])
    ),

    differences: b
      ? [
          `${a} prioritises one aspect while ${b} leans the other way.`,
          'Build quality and materials differ noticeably between these two.',
          'Software ecosystem and long-term update support diverge here.',
          'After-sales service and warranty terms are worth comparing.',
        ]
      : [
          'Consider how this fits your existing ecosystem.',
          'Check resale value if upgrading in 12–18 months.',
          'Accessories and third-party support vary widely in this category.',
        ],

    bestFor: Object.fromEntries(
      products.map((p, i) => [
        p.id,
        i === 0
          ? ['Power users', 'Content creators', 'Longevity seekers']
          : ['Everyday use', 'Budget-conscious buyers', 'First-time buyers'],
      ])
    ),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function VerdictCard({ text }) {
  return (
    <div className="ci-verdict">
      <span className="ci-verdict__bar" aria-hidden="true" />
      <p className="ci-verdict__text">{text}</p>
    </div>
  );
}

function StrengthsGrid({ products, strengths }) {
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
                  {s}
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function ComparisonInsights({ products }) {
  const [status,   setStatus]   = useState('idle');   // idle | loading | ready
  const [insights, setInsights] = useState(null);

  if (!products.length) return null;

  async function handleGenerate() {
    setStatus('loading');
    // Simulate async generation delay; replace with real Gemini call later
    await new Promise((r) => setTimeout(r, 1400));
    setInsights(buildPlaceholder(products));
    setStatus('ready');
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

      {status === 'ready' && insights && (
        <div className="ci-body">
          <VerdictCard text={insights.verdict} />
          <StrengthsGrid products={products} strengths={insights.strengths} />
          <DifferencesList items={insights.differences} />
          <BestForRow products={products} bestFor={insights.bestFor} />
        </div>
      )}
    </section>
  );
}
