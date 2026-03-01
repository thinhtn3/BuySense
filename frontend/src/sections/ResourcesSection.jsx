import { useState } from 'react';

const TYPE_CONFIG = {
  official: { icon: '🔗', bg: '#E8F7F4', color: '#2ABFA3', label: 'Official'  },
  review:   { icon: '⭐', bg: '#FEF3CD', color: '#C88A00', label: 'Review'    },
  video:    { icon: '▶',  bg: '#FDECEA', color: '#E25C5C', label: 'Video'     },
  article:  { icon: '📄', bg: '#EAF3EC', color: '#3A9E5F', label: 'Article'   },
};

const COLLAPSED_COUNT = 3;

function ResourceIcon({ type, thumbnail }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.article;

  if (thumbnail) {
    return (
      <span className="resource-icon resource-icon--img" aria-hidden="true">
        <img src={thumbnail} alt="" className="resource-icon__img" />
      </span>
    );
  }

  return (
    <span
      className="resource-icon"
      style={{ background: cfg.bg, color: cfg.color }}
      aria-hidden="true"
    >
      {cfg.icon}
    </span>
  );
}

function ResourceCard({ product, resources }) {
  const [expanded, setExpanded] = useState(false);

  if (!resources?.length) return null;

  const ORDER = { official: 0, review: 1, video: 2, article: 3 };
  const sorted    = [...resources].sort((a, b) => (ORDER[a.type] ?? 4) - (ORDER[b.type] ?? 4));
  const collapsible = sorted.length > COLLAPSED_COUNT;
  const visible     = expanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);

  return (
    <div className="resource-card">
      <div className="resource-card__header">
        <span className="resource-card__header-icon">📋</span>
        <span className="resource-card__header-title">
          Resources for {product.name}
        </span>
      </div>

      <div className={`resource-list-wrap${collapsible && !expanded ? ' resource-list-wrap--collapsed' : ''}`}>
        <ul className="resource-list">
          {visible.map((r) => {
            const cfg = TYPE_CONFIG[r.type] ?? TYPE_CONFIG.article;
            return (
              <li key={r.id ?? r.url} className="resource-item">
                <ResourceIcon type={r.type} thumbnail={r.thumbnail} />
                <div className="resource-item__body">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item__title"
                  >
                    {r.title}
                  </a>
                  <p className="resource-item__meta">
                    {r.source && <span>{r.source}</span>}
                    {r.source && <span className="resource-item__dot">·</span>}
                    <span>{cfg.label}</span>
                    {r.rating != null && (
                      <>
                        <span className="resource-item__dot">·</span>
                        <span className="resource-item__rating">
                          {r.rating}/{r.rating_max ?? r.ratingMax ?? 10}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {collapsible && !expanded && (
          <div className="resource-fade" aria-hidden="true" />
        )}
      </div>

      {collapsible && (
        <button
          className="resource-toggle-btn"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? 'Show less ↑'
            : `Show ${sorted.length - COLLAPSED_COUNT} more ↓`}
        </button>
      )}
    </div>
  );
}

export default function ResourcesSection({ products, resourceData }) {
  if (!products.length || !resourceData) return null;

  return (
    <section className="resources-section">
      <h2 className="resources-heading">Resources &amp; Reviews</h2>

      <div className="resources-cards-row">
        {products.map((p) => (
          <ResourceCard
            key={p.id}
            product={p}
            resources={resourceData[p.id]}
          />
        ))}
      </div>
    </section>
  );
}
