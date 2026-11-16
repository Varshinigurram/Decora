import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import Button from '../components/common/Button';
import PriceDisplay from '../components/common/PriceDisplay';

export default function DesignBoardsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-taupe font-medium">
            Project Moodboards
          </span>
          <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
            My Design Boards
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Curate room projects, retain custom variant configurations, and estimate total room budgets.
          </p>
        </div>
        <Button variant="primary" size="md">
          + Create New Board
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/boards/board-01" className="card-architectural p-6 space-y-4 block group">
          <div className="aspect-[3/2] bg-ivory-subtle rounded flex items-center justify-center text-taupe font-serif">
            <Layers className="w-8 h-8 text-taupe/60" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-charcoal group-hover:text-forest transition-colors">
              Living Room Japandi 2026
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">3 items curated</p>
            <div className="mt-3 pt-3 border-t border-sand/40 flex justify-between items-baseline">
              <span className="text-xs text-charcoal-muted uppercase tracking-wider">Estimated Budget:</span>
              <PriceDisplay amount={91500} size="md" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
