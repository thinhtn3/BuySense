import { useState, useRef, useEffect } from 'react';
import CATEGORY_EMOJI from '@/lib/categoryEmoji.js';

function fuzzyMatch(text, query) {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function filterProducts(products, query) {
  if (!query.trim()) return products;
  const q = query.toLowerCase().trim();
  return products
    .filter((p) => fuzzyMatch(`${p.name} ${p.brand}`, q))
    .sort((a, b) => {
      const aText = `${a.name} ${a.brand}`.toLowerCase();
      const bText = `${b.name} ${b.brand}`.toLowerCase();
      return (bText.includes(q) ? 1 : 0) - (aText.includes(q) ? 1 : 0);
    });
}

function Highlight({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const q = query.toLowerCase();
  const parts = [];
  let i = 0, qi = 0, segStart = 0;
  while (i < text.length && qi < q.length) {
    if (text[i].toLowerCase() === q[qi]) {
      if (i > segStart) parts.push({ str: text.slice(segStart, i), bold: false });
      parts.push({ str: text[i], bold: true });
      segStart = i + 1;
      qi++;
    }
    i++;
  }
  if (segStart < text.length) parts.push({ str: text.slice(segStart), bold: false });
  return (
    <span>
      {parts.map((p, idx) =>
        p.bold
          ? <strong key={idx} style={{ color: '#111', fontWeight: 600 }}>{p.str}</strong>
          : <span key={idx}>{p.str}</span>
      )}
    </span>
  );
}

const CATEGORY_LABELS = {
  phones: 'Phone', laptops: 'Laptop', headphones: 'Headphones',
  tvs: 'TV', gpus: 'GPU', soundsystems: 'Sound',
};

export default function ProductSelector({ label, value, products, onSelect, onClear, onRemove, removable }) {
  const [query,     setQuery]     = useState('');
  const [isOpen,    setIsOpen]    = useState(false);
  const [focused,   setFocused]   = useState(-1);
  const [adding,    setAdding]    = useState(false);
  const [addError,  setAddError]  = useState(null);
  const containerRef = useRef(null);
  const inputRef     = useRef(null);
  const listRef      = useRef(null);

  const filtered = filterProducts(products, query);

  useEffect(() => {
    function onPointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setFocused(-1);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    if (focused >= 0 && listRef.current) {
      listRef.current.children[focused]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focused]);

  function handleInput(e) {
    setQuery(e.target.value);
    setIsOpen(true);
    setFocused(-1);
  }

  function handleKeyDown(e) {
    if (!isOpen) { if (e.key !== 'Tab') setIsOpen(true); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused((f) => Math.min(f + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocused((f) => Math.max(f - 1, -1));
    } else if (e.key === 'Enter' && focused >= 0) {
      e.preventDefault();
      selectProduct(filtered[focused]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocused(-1);
    }
  }

  function selectProduct(product) {
    onSelect(product);
    setQuery('');
    setIsOpen(false);
    setFocused(-1);
    setAddError(null);
    inputRef.current?.blur();
  }

  async function handleAddCustom() {
    if (!query.trim() || adding) return;
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch('/api/products/custom', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: query.trim() }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Failed to add product.');
      selectProduct(body.product);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  }

  function handleChevronClick() {
    if (isOpen) { setIsOpen(false); } else { setIsOpen(true); inputRef.current?.focus(); }
  }

  return (
    <div className="selector-wrapper" ref={containerRef}>
      <div className="selector-label-row">
        <span className="selector-label">{label}</span>
        {removable && (
          <button className="selector-remove-btn" onClick={onRemove} aria-label="Remove slot">
            ✕
          </button>
        )}
      </div>

      <div className={`selector-card ${isOpen ? 'selector-card--open' : ''}`}>
        {value && !isOpen && (
          <span className="selector-icon-emoji">
            {CATEGORY_EMOJI[value.category] ?? '📦'}
          </span>
        )}
        <input
          ref={inputRef}
          className="selector-input"
          type="text"
          placeholder={value ? value.name : 'Search a product…'}
          value={query}
          onChange={handleInput}
          onFocus={() => { setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        {value && !isOpen && (
          <span className="selector-meta">
            {value.brand} · {value.year}
            {value.storage ? ` · ${value.storage}` : ''}
          </span>
        )}
        <button className="selector-chevron" tabIndex={-1} onClick={handleChevronClick}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d={isOpen ? 'M2 9l5-5 5 5' : 'M2 5l5 5 5-5'} stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul className="selector-dropdown" ref={listRef} role="listbox">
          {filtered.length === 0 ? (
            query.trim() ? (
              <>
                <li className="selector-empty">No products found for "{query}"</li>
                <li
                  className={`selector-custom-option${adding ? ' selector-custom-option--loading' : ''}`}
                  onPointerDown={(e) => { e.preventDefault(); handleAddCustom(); }}
                >
                  <span className="selector-custom-option__icon">+</span>
                  <span className="selector-custom-option__text">
                    {adding ? 'Searching…' : <>Add <strong>"{query}"</strong> as custom product</>}
                  </span>
                </li>
                {addError && (
                  <li className="selector-custom-error">{addError}</li>
                )}
              </>
            ) : (
              <li className="selector-empty">Start typing to search…</li>
            )
          ) : (
            <>
              {filtered.slice(0, 40).map((product, idx) => (
                <li
                  key={product.id}
                  className={`selector-option ${idx === focused ? 'selector-option--focused' : ''}`}
                  role="option"
                  aria-selected={value?.id === product.id}
                  onPointerDown={(e) => { e.preventDefault(); selectProduct(product); }}
                >
                  <span className="selector-option-icon-emoji">
                    {CATEGORY_EMOJI[product.category] ?? '📦'}
                  </span>
                  <span className="selector-option-name">
                    <Highlight text={product.name} query={query} />
                  </span>
                  <span className="selector-option-meta">
                    {product.brand} · {CATEGORY_LABELS[product.category] ?? product.category}
                    {product.year ? ` · ${product.year}` : ''}
                  </span>
                </li>
              ))}
              {query.trim() && (
                <li
                  className={`selector-custom-option${adding ? ' selector-custom-option--loading' : ''}`}
                  onPointerDown={(e) => { e.preventDefault(); handleAddCustom(); }}
                >
                  <span className="selector-custom-option__icon">+</span>
                  <span className="selector-custom-option__text">
                    {adding ? 'Searching…' : <>Add <strong>"{query}"</strong> as custom product</>}
                  </span>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
