import { useState, useEffect } from 'react';
import ProductSelection  from '@/sections/ProductSelection.jsx';
import SpecsSection      from '@/sections/SpecsSection.jsx';
import PriceComparison      from '@/sections/PriceComparison.jsx';
import ResourcesSection     from '@/sections/ResourcesSection.jsx';
import ComparisonInsights   from '@/sections/ComparisonInsights.jsx';
import ListingsSection      from '@/sections/ListingsSection.jsx';
import ConditionToggle      from '@/components/ConditionToggle.jsx';

export default function App() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [condition,         setCondition]        = useState('new');

  // Price state
  const [priceResults,  setPriceResults]  = useState(null);
  // Resource state
  const [resourceData,  setResourceData]  = useState(null);

  const [isFetching,    setIsFetching]    = useState(false);
  const [fetchError,    setFetchError]    = useState(null);

  // Clear everything when product selection changes
  useEffect(() => {
    setPriceResults(null);
    setResourceData(null);
    setFetchError(null);
  }, [selectedProducts]);

  async function handleCompare() {
    if (!selectedProducts.length) return;
    setIsFetching(true);
    setFetchError(null);
    setPriceResults(null);
    setResourceData(null);

    const ids = selectedProducts.map((p) => p.id).join(',');

    // Fire both requests in parallel
    const [priceRes, resourceRes] = await Promise.allSettled([
      fetch(`/api/prices?productIds=${ids}&condition=${condition}`),
      fetch(`/api/resources?productIds=${ids}`),
    ]);

    // Handle prices
    try {
      if (priceRes.status === 'rejected') throw new Error(priceRes.reason?.message);
      const res = priceRes.value;
      if (res.status === 429) throw new Error('Too many requests — please wait before comparing again.');
      if (!res.ok) throw new Error('Failed to fetch prices.');
      setPriceResults(await res.json());
    } catch (err) {
      setFetchError(err.message);
    }

    // Handle resources (non-blocking — don't block prices if resources fail)
    try {
      if (resourceRes.status === 'fulfilled' && resourceRes.value.ok) {
        setResourceData(await resourceRes.value.json());
      }
    } catch {
      // silently skip
    }

    setIsFetching(false);
  }

  const hasProducts    = selectedProducts.length > 0;
  const hasComparisons = priceResults || resourceData;

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
          <ConditionToggle value={condition} onChange={(c) => { setCondition(c); setPriceResults(null); setResourceData(null); }} />

          <button
            className={`compare-btn${isFetching ? ' compare-btn--loading' : ''}`}
            onClick={handleCompare}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <span className="compare-btn__spinner" />
                Fetching…
              </>
            ) : (
              hasComparisons ? 'Refresh' : 'Compare Prices →'
            )}
          </button>

          {fetchError && <p className="compare-error">{fetchError}</p>}
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

      {hasProducts && <ComparisonInsights products={selectedProducts} />}

      {resourceData && (
        <ResourcesSection
          products={selectedProducts}
          resourceData={resourceData}
        />
      )}

      {priceResults && (
        <ListingsSection
          products={selectedProducts}
          priceResults={priceResults}
        />
      )}
    </main>
  );
}
