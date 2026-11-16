import React from 'react';
import { Link } from 'react-router-dom';

export default function InspirationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-4">
        <span className="text-xs uppercase tracking-widest text-taupe font-medium">
          Editorial Portfolios
        </span>
        <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
          Interior Inspiration
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Curated room styles and "Shop the Look" deep links scheduled for Day 8.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/inspiration/komorebi-living" className="card-architectural p-6 space-y-3 block group">
          <div className="aspect-[3/2] bg-ivory-subtle rounded flex items-center justify-center text-taupe font-serif">
            [ Japandi Room Lookbook ]
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-taupe font-medium">Japandi</span>
            <h3 className="font-serif text-xl text-charcoal group-hover:text-forest transition-colors">
              Komorebi Living Space
            </h3>
            <p className="text-xs text-charcoal-muted mt-1">3 featured furniture pieces</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
