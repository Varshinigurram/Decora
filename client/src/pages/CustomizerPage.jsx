import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Sliders, Sparkles, ShieldCheck, Ruler, Clock, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CustomizerCatalogCard from '../components/customizer/CustomizerCatalogCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import productService from '../services/productService';

export default function CustomizerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customizableProducts, setCustomizableProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchCustomizable = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts({
        customizable: true,
        limit: 24,
      });
      setCustomizableProducts(result.products || []);
      setIsFallback(Boolean(result.isFallback));
    } catch (err) {
      console.error('Failed to load customizable products:', err);
      setError(err?.message || 'Unable to connect to the customization studio service.');
      setCustomizableProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomizable();
  }, [fetchCustomizable]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(customizableProducts.map((p) => p.category)));
    return ['All', ...unique];
  }, [customizableProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return customizableProducts;
    return customizableProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, customizableProducts]);

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Customization Studio' },
  ];

  return (
    <div className="bg-ivory min-h-screen pb-20">
      {/* Top Editorial Bar & Breadcrumbs */}
      <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Editorial Hero Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-sand/60 rounded text-[11px] uppercase tracking-widest text-forest font-semibold">
            <Sliders className="w-3.5 h-3.5 text-forest" />
            <span>Interactive Customization Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-charcoal leading-tight">
            Bespoke Furniture Configurator
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Tailor our architectural creations to your sanctuary. Select premium upholstery textiles, hand-finished timber varieties, and proportional scales — with transparent, real-time additive pricing.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="card-architectural p-4 bg-white flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-ivory-subtle border border-sand/50 flex items-center justify-center shrink-0 text-forest">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-charcoal">Real-Time Pricing</h4>
              <p className="text-[11px] text-charcoal-muted leading-normal">
                Pure additive formula with exact material deltas and zero hidden surcharges.
              </p>
            </div>
          </div>

          <div className="card-architectural p-4 bg-white flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-ivory-subtle border border-sand/50 flex items-center justify-center shrink-0 text-forest">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-charcoal">Artisanal Materials</h4>
              <p className="text-[11px] text-charcoal-muted leading-normal">
                Belgian linen, bouclé, full-grain saddle leather, and certified solid timber.
              </p>
            </div>
          </div>

          <div className="card-architectural p-4 bg-white flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-ivory-subtle border border-sand/50 flex items-center justify-center shrink-0 text-forest">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-charcoal">Handcrafted in 3–4 Weeks</h4>
              <p className="text-[11px] text-charcoal-muted leading-normal">
                Bespoke bench-made production with white-glove delivery and assembly.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const count =
                category === 'All'
                  ? customizableProducts.length
                  : customizableProducts.filter((p) => p.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-forest text-white shadow-subtle'
                      : 'bg-white border border-sand/60 text-charcoal hover:border-forest/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-sand/30 text-taupe'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-charcoal-muted font-mono">
            Showing {filteredProducts.length} customizable {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        {/* Offline Fallback Banner */}
        {isFallback && (
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded flex items-center justify-between text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Operating in <strong>offline fallback mode</strong>. Displaying cached customizable pieces.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
              Local Fallback
            </span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="card-architectural bg-white animate-pulse overflow-hidden rounded border border-sand/40"
              >
                <div className="aspect-[4/3] bg-sand/20" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-sand/30 rounded w-1/3" />
                  <div className="h-4 bg-sand/40 rounded w-3/4" />
                  <div className="h-4 bg-sand/30 rounded w-1/2 pt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && customizableProducts.length === 0 && (
          <div className="p-8 bg-white border border-accent-error/30 rounded text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-accent-error/10 text-accent-error">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-charcoal">
              Unable to Load Studio Designs
            </h3>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">
              {error}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchCustomizable}
              className="inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Studio Connection</span>
            </Button>
          </div>
        )}

        {/* Customizable Pieces Grid */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <CustomizerCatalogCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <EmptyState
            title="No Customizable Designs"
            message={`No customizable pieces found in category "${selectedCategory}".`}
            actionLabel="View All Pieces"
            onAction={() => setSelectedCategory('All')}
          />
        )}
      </main>
    </div>
  );
}
