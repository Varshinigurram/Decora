import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Layers, ArrowRight, HelpCircle } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Button from '../common/Button';

export default function BoardBudgetSummary({
  board,
  budget = 0,
  itemCount = 0,
  uniqueCount = 0,
}) {
  return (
    <div className="card-architectural p-6 bg-white space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
            Spatial Budget Estimation
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
            Estimated Furniture Budget
          </h3>
        </div>

        <div className="text-left sm:text-right">
          <div className="flex items-center gap-1 sm:justify-end">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-medium">
              Board Total
            </span>
            <span
              className="text-taupe hover:text-charcoal cursor-help"
              title="Sum of all saved furniture snapshot unit prices multiplied by their quantities. Excludes architectural installation & taxes."
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <PriceDisplay
            amount={budget}
            size="xl"
            className="text-forest font-serif font-bold text-2xl sm:text-3xl"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-ivory-subtle rounded border border-sand/40 space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Total Pieces
          </span>
          <span className="font-mono text-base font-semibold text-charcoal block">
            {itemCount}
          </span>
        </div>

        <div className="p-3 bg-ivory-subtle rounded border border-sand/40 space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Unique Designs
          </span>
          <span className="font-mono text-base font-semibold text-charcoal block">
            {uniqueCount}
          </span>
        </div>

        <div className="p-3 bg-ivory-subtle rounded border border-sand/40 space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Room Category
          </span>
          <span className="text-charcoal font-medium truncate block">
            {board?.roomType || 'Living Room'}
          </span>
        </div>

        <div className="p-3 bg-ivory-subtle rounded border border-sand/40 space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Aesthetic Style
          </span>
          <span className="text-charcoal font-medium truncate block">
            {board?.style || 'Warm Editorial'}
          </span>
        </div>
      </div>

      {/* Editorial Disclaimer & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p className="text-[11px] text-charcoal-muted leading-relaxed max-w-md">
          * Estimated furniture budget based on exact material and finish snapshots saved to this board. Excludes architectural delivery, taxes, and bespoke custom hardware.
        </p>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/consultation">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-subtle">
              <Calendar className="w-3.5 h-3.5" />
              <span>Attach to Consultation</span>
            </Button>
          </Link>

          <Link to="/catalog">
            <Button variant="secondary" size="sm" className="flex items-center gap-1 text-charcoal">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3 h-3 text-taupe" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
