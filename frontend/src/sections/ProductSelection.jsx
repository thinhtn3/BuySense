import { useState, useEffect } from 'react';
import CategoryFilter from '@/components/CategoryFilter.jsx';
import ProductSelector from '@/components/ProductSelector.jsx';

const LABELS = ['A', 'B', 'C'];

let nextId = 1;
function makeSelector() { return { id: nextId++, value: null }; }

export default function ProductSelection({ onSelectionsChange }) {
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [selectors,      setSelectors]      = useState([makeSelector()]);
  const [activeCategory, setActiveCategory] = useState('phones');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => { if (!r.ok) throw new Error('Failed to load products'); return r.json(); })
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    onSelectionsChange?.(selectors.map((s) => s.value).filter(Boolean));
  }, [selectors]);

  function handleCategoryChange(category) {
    setActiveCategory(category);
    setSelectors((prev) =>
      prev.map((s) =>
        s.value && s.value.category !== category ? { ...s, value: null } : s
      )
    );
  }

  function handleSelect(selectorId, product) {
    setSelectors((prev) =>
      prev.map((s) => (s.id === selectorId ? { ...s, value: product } : s))
    );
  }

  function handleClear(selectorId) {
    setSelectors((prev) =>
      prev.map((s) => (s.id === selectorId ? { ...s, value: null } : s))
    );
  }

  function addSelector() {
    if (selectors.length >= LABELS.length) return;
    setSelectors((prev) => [...prev, makeSelector()]);
  }

  function removeSelector(selectorId) {
    setSelectors((prev) => prev.filter((s) => s.id !== selectorId));
  }

  const visibleProducts = products.filter((p) => p.category === activeCategory);

  return (
    <>
      {!loading && !error && (
        <CategoryFilter value={activeCategory} onChange={handleCategoryChange} />
      )}

      <section className="selectors-section">
        {loading && <p className="status-text">Loading products…</p>}
        {error   && <p className="status-text status-text--error">{error}</p>}

        {!loading && !error && (
          <div className="selectors-row">
            {selectors.map((s, i) => (
              <ProductSelector
                key={s.id}
                label={`PRODUCT ${LABELS[i]}`}
                value={s.value}
                products={visibleProducts}
                onSelect={(product) => handleSelect(s.id, product)}
                onClear={() => handleClear(s.id)}
                onRemove={() => removeSelector(s.id)}
                removable={i > 0}
              />
            ))}

            {selectors.length < LABELS.length && (
              <button className="add-selector-btn" onClick={addSelector}>
                <span className="add-selector-btn__icon">+</span>
                <span>Add product</span>
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
