import React from 'react';
import { Link } from 'react-router-dom';
import PriceDisplay from '../components/common/PriceDisplay';
import Button from '../components/common/Button';

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-6">
        <span className="text-xs uppercase tracking-widest text-taupe font-medium">
          The Furniture Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal mt-1">
          Catalog & Discovery
        </h1>
        <p className="text-sm text-charcoal-muted mt-2 max-w-xl">
          Browse handcrafted furniture organized by living room, bedroom, dining, and study. Full search
          and faceted material filtering will be populated in Day 7.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-architectural p-6 space-y-4">
          <div className="aspect-[4/5] bg-ivory-subtle rounded flex items-center justify-center text-taupe font-serif text-lg">
            [ Featured Item 1 ]
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-taupe">Seating</span>
            <h3 className="font-serif text-xl text-charcoal">Komorebi Lounge Chair</h3>
            <PriceDisplay amount={28000} prefix="Starting at " size="md" className="mt-1" />
          </div>
          <Link to="/catalog/chair-komorebi" className="block">
            <Button variant="secondary" size="sm" className="w-full">
              View Specifications
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
