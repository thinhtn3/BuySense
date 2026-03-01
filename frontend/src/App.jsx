import { useState, useEffect } from 'react';
import ProductSelection from '@/sections/ProductSelection.jsx';
import SpecsSection     from '@/sections/SpecsSection.jsx';
import PriceComparison  from '@/sections/PriceComparison.jsx';
import ConditionToggle  from '@/components/ConditionToggle.jsx';

export default function App() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [condition,         setCondition]        = useState('new');
  const [priceResults,      setPriceResults]     = useState(null);
  const [isFetching,        setIsFetching]       = useState(false);
  const [priceError,        setPriceError]       = useState(null);

  // Clear price results whenever the selected products change
  useEffect(() => {
    setPriceResults(null);
    setPriceError(null);
  }, [selectedProducts]);

  async function handleCompare() {
    if (!selectedProducts.length) return;
    setIsFetching(true);
    setPriceError(null);
    setPriceResults(null);

    try {
      const ids = selectedProducts.map((p) => p.id).join(',');
      const res = await fetch(`/api/prices?productIds=${ids}&condition=${condition}`);

      if (res.status === 429) {
        throw new Error('Too many requests — please wait before comparing again.');
      }
      if (!res.ok) throw new Error('Failed to fetch prices. Try again shortly.');

      const data = await res.json();
      setPriceResults(data);
    } catch (err) {
      setPriceError(err.message);
    } finally {
      setIsFetching(false);
    }
  }

  const hasProducts = selectedProducts.length > 0;

  return (
    <main className="page">
      <header className="hero">
        <h1 className="hero-title">Compare, then shop.</h1>
        <p className="hero-subtitle">
          Choose what you're deciding between. We'll show you what matters.
        </p>
      </header>

      <ProductSelection onSelectionsChange={setSelectedProducts} />

      {hasProducts && (
        <div className="compare-trigger">
          <ConditionToggle value={condition} onChange={(c) => { setCondition(c); setPriceResults(null); }} />

          <button
            className={`compare-btn${isFetching ? ' compare-btn--loading' : ''}`}
            onClick={handleCompare}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <span className="compare-btn__spinner" />
                Fetching prices…
              </>
            ) : (
              priceResults ? 'Refresh Prices' : 'Compare Prices →'
            )}
          </button>

          {priceError && (
            <p className="compare-error">{priceError}</p>
          )}
        </div>
      )}

      <SpecsSection products={selectedProducts} />

      {priceResults && (
        <PriceComparison
          products={selectedProducts}
          priceResults={priceResults}
          condition={condition}
        />
      )}
    </main>
  );
}
