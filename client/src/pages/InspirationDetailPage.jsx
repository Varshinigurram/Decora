import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function InspirationDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-xs text-charcoal-muted">
        <Link to="/inspiration" className="hover:text-forest">Inspiration</Link> / <span>{id || 'Lookbook'}</span>
      </div>

      <div className="bg-white border border-sand/40 rounded p-8 space-y-6 shadow-subtle">
        <span className="text-xs uppercase tracking-widest text-taupe font-medium">
          Aesthetic Story • Japandi Living
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal">
          Komorebi Living Space
        </h1>
        <div className="aspect-[16/9] bg-ivory-subtle rounded flex items-center justify-center text-taupe font-serif text-lg">
          [ High-Resolution Editorial Staged Room Photography (1200x800) ]
        </div>
        <p className="text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          Detailed concept narrative, extracted color swatches, and "Shop the Look" deep links full
          implementation scheduled for Day 8.
        </p>
        <Link to="/inspiration">
          <Button variant="secondary" size="sm">
            Back to Inspiration Gallery
          </Button>
        </Link>
      </div>
    </div>
  );
}
