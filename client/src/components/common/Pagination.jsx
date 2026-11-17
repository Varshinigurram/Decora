import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || totalPages * itemsPerPage);

  return (
    <div className="pt-8 sm:pt-12 border-t border-sand/40 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Information text */}
      <div className="text-xs text-charcoal-muted">
        {totalItems ? (
          <span>
            Showing <strong className="text-charcoal font-mono font-medium">{startItem}–{endItem}</strong> of{' '}
            <strong className="text-charcoal font-mono font-medium">{totalItems}</strong> designs
          </span>
        ) : (
          <span>
            Page <strong className="text-charcoal font-mono">{currentPage}</strong> of{' '}
            <strong className="text-charcoal font-mono">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Page controls */}
      <nav aria-label="Pagination Navigation" className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded border border-sand/60 bg-white text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-forest text-ivory shadow-subtle'
                  : 'bg-white text-charcoal-muted border border-sand/50 hover:bg-ivory-subtle hover:text-charcoal'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded border border-sand/60 bg-white text-charcoal-muted hover:text-charcoal hover:bg-ivory-subtle disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
