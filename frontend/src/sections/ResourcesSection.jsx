import { useState } from 'react';
import { Library, BookOpen, Link2, Star, Play, FileText } from 'lucide-react';

const TYPE_CONFIG = {
  official: { Icon: Link2,    bg: '#E8F7F4', color: '#2ABFA3', label: 'Official' },
  review:   { Icon: Star,     bg: '#FEF3CD', color: '#C88A00', label: 'Review'   },
  video:    { Icon: Play,     bg: '#FDECEA', color: '#E25C5C', label: 'Video'    },
  article:  { Icon: FileText, bg: '#EAF3EC', color: '#3A9E5F', label: 'Article'  },
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
      <cfg.Icon size={14} strokeWidth={2} />
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
        <BookOpen size={16} strokeWidth={1.75} className="resource-card__header-icon" aria-hidden="true" />
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
      <div className="section-heading">
        <Library size={16} strokeWidth={1.75} className="section-heading__icon" aria-hidden="true" />
        <h2>Resources &amp; Reviews</h2>
      </div>

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
