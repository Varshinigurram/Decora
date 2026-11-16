import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PriceDisplay from '../components/common/PriceDisplay';
import Button from '../components/common/Button';

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-xs text-charcoal-muted">
        <Link to="/catalog" className="hover:text-forest">Catalog</Link> / <span>Product #{id || 'sample'}</span>
      </div>
      <div className="bg-white border border-sand/40 rounded p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-subtle">
        <div className="aspect-[4/5] bg-ivory-subtle rounded flex items-center justify-center text-taupe font-serif">
          [ Multi-Angle Gallery Placeholder ]
        </div>
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-taupe">Seating • Japandi</span>
            <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
              Komorebi Lounge Chair
            </h1>
            <PriceDisplay amount={28000} size="xl" className="mt-2" />
          </div>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Low-slung accent armchair crafted with sculpted solid white oak joinery and high-resilience
            cushioning. Specifications and multi-angle view full implementation scheduled for Day 7.
          </p>
          <div className="pt-4 flex gap-4">
            <Link to={`/customizer/${id || 'chair-komorebi'}`}>
              <Button variant="primary" size="md">
                Customize This Piece
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="secondary" size="md">
                Back to Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
