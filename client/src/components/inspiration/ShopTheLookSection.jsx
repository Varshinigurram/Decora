import React, { useState } from 'react';
import { Layers, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../catalog/ProductCard';
import Button from '../common/Button';

export default function ShopTheLookSection({ products = [], lookbookTitle = 'Interior Lookbook' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-8 pt-10 border-t border-sand/40" id="shop-the-look">
      {/* Section Header with Quick Modal Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-taupe font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            <span>Curated Furniture Ensemble</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-charcoal">
            Shop the Look
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl">
            Every handcrafted furniture piece featured in the {lookbookTitle}, resolved directly from
            the master collection with transparent INR pricing.
          </p>
        </div>

        {/* Quick View Tray Trigger */}
        <div className="self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <Layers className="w-3.5 h-3.5 text-forest" />
            <span>View All Pieces ({products.length})</span>
          </Button>
        </div>
      </div>

      {/* Primary Products Grid (Reusing ProductCard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Accessible "Shop the Look" Focus Drawer / Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shop-the-look-modal-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-ivory rounded shadow-2xl border border-sand/60 max-h-[90vh] flex flex-col z-10 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-sand/40 flex items-center justify-between bg-white">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-taupe font-semibold block">
                  Ensemble Pieces ({products.length})
                </span>
                <h3
                  id="shop-the-look-modal-title"
                  className="font-serif text-xl sm:text-2xl font-semibold text-charcoal"
                >
                  Shop the Look: {lookbookTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Product Cards */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-sand/40 bg-white flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Close Ensemble View
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
