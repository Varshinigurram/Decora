import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PriceDisplay from '../components/common/PriceDisplay';
import Button from '../components/common/Button';

export default function CustomizerPage() {
  const { productId } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-4">
        <span className="text-xs uppercase tracking-widest text-taupe font-medium">
          Interactive Configurator
        </span>
        <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
          Bespoke Customizer {productId ? `(${productId})` : ''}
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Additive price calculations, genuine fabric swatches, and overlay previews scheduled for Day 9.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white border border-sand/40 rounded p-8 flex items-center justify-center min-h-[360px] shadow-subtle">
          <span className="font-serif text-lg text-taupe">
            [ Interactive Visual Customizer Canvas ]
          </span>
        </div>
        <div className="card-architectural p-6 space-y-4">
          <h3 className="font-serif text-xl text-charcoal">Additive Formula Model</h3>
          <div className="text-xs space-y-2 text-charcoal-muted border-t border-sand/40 pt-3">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <PriceDisplay amount={28000} size="sm" />
            </div>
            <div className="flex justify-between text-forest font-medium">
              <span>Cream Bouclé:</span>
              <PriceDisplay amount={3500} isDelta size="sm" />
            </div>
            <div className="flex justify-between text-forest font-medium">
              <span>Natural Oak Finish:</span>
              <PriceDisplay amount={2000} isDelta size="sm" />
            </div>
            <div className="flex justify-between text-forest font-medium">
              <span>Grand Scale (+10%):</span>
              <PriceDisplay amount={4000} isDelta size="sm" />
            </div>
            <div className="border-t border-sand/40 pt-2 flex justify-between font-semibold text-charcoal text-sm">
              <span>Total Estimated Price:</span>
              <PriceDisplay amount={37500} size="md" />
            </div>
          </div>
          <Link to="/catalog" className="block pt-2">
            <Button variant="secondary" size="sm" className="w-full">
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
