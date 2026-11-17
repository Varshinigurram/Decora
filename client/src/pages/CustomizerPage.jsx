import React, { useState, useMemo } from 'react';
import { Sliders, Sparkles, ShieldCheck, Ruler, Clock } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CustomizerCatalogCard from '../components/customizer/CustomizerCatalogCard';
import EmptyState from '../components/common/EmptyState';
import { getCustomizableProducts } from '../data/products';

export default function CustomizerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const customizableProducts = useMemo(() => {
    return getCustomizableProducts();
  }, []);

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

        {/* Customizable Pieces Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <CustomizerCatalogCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
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
