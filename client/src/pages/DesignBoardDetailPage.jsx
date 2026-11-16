import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import PriceDisplay from '../components/common/PriceDisplay';

export default function DesignBoardDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-xs text-charcoal-muted">
        <Link to="/boards" className="hover:text-forest">Boards</Link> / <span>{id || 'Board Details'}</span>
      </div>

      <div className="border-b border-sand/40 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-taupe font-medium">Design Board</span>
          <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
            Living Room Japandi 2026
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Total Estimated Design Budget:{' '}
            <PriceDisplay amount={91500} size="lg" className="text-forest ml-1 font-semibold" />
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/consultation">
            <Button variant="primary" size="md">
              Attach to Consultation
            </Button>
          </Link>
          <Link to="/boards">
            <Button variant="secondary" size="md">
              Back to Boards
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-sand/40 rounded p-8 text-center text-sm text-charcoal-muted shadow-subtle">
        Full board item management, custom notes, and variant snapshots implementation scheduled for Day 11–12.
      </div>
    </div>
  );
}
