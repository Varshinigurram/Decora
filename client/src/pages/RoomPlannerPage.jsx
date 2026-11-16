import React from 'react';
import Button from '../components/common/Button';
import PriceDisplay from '../components/common/PriceDisplay';

export default function RoomPlannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-taupe font-medium">
            Spatial Planning
          </span>
          <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
            2D Room Planner
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Proportional metric floorboard with drag-and-drop architectural furniture blocks (Scheduled for Day 10).
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-charcoal-muted uppercase tracking-wider block">Room Budget:</span>
            <PriceDisplay amount={84500} size="lg" className="text-forest font-semibold" />
          </div>
          <Button variant="secondary" size="md">
            Reset Canvas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-architectural p-6 space-y-4 md:col-span-1">
          <h3 className="font-serif text-lg text-charcoal">Room Setup</h3>
          <div className="space-y-3 text-sm text-charcoal-muted">
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Length (meters):</label>
              <input type="number" defaultValue="4.5" className="w-full px-3 py-1.5 border border-sand rounded bg-white" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Width (meters):</label>
              <input type="number" defaultValue="3.8" className="w-full px-3 py-1.5 border border-sand rounded bg-white" />
            </div>
          </div>
          <div className="pt-4 border-t border-sand/40">
            <h4 className="text-xs uppercase tracking-wider text-taupe mb-2 font-medium">Furniture Palette</h4>
            <p className="text-xs text-charcoal-muted">Top-down vector library scheduled for Day 10.</p>
          </div>
        </div>

        <div className="md:col-span-3 bg-white border border-sand/40 rounded p-12 flex items-center justify-center min-h-[420px] shadow-subtle">
          <div className="text-center space-y-2">
            <span className="font-serif text-xl text-taupe block">
              [ React-Managed SVG 2D Floorboard Grid (4.5m × 3.8m) ]
            </span>
            <span className="text-xs text-charcoal-muted block">
              Native SVG matrix transformations and drag-and-drop placement active in Day 10.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
