import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured & Iconic' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Alphabetical: A to Z' },
];

export default function CatalogSort({
  sortBy = 'featured',
  onSortChange,
  totalCount = 0,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-sand/40">
      {/* Product count display */}
      <div className="text-xs uppercase tracking-wider text-charcoal-muted">
        Showing <span className="font-mono font-semibold text-charcoal">{totalCount}</span> handcrafted piece{totalCount === 1 ? '' : 's'}
      </div>

      {/* Sort selector */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <label htmlFor="catalog-sort" className="text-xs text-taupe font-medium flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort By:</span>
        </label>
        <div className="relative">
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs bg-white border border-sand/60 text-charcoal rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest transition-colors cursor-pointer font-medium"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
