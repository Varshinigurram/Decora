import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, RotateCcw, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LookbookCard from '../components/inspiration/LookbookCard';
import EmptyState from '../components/common/EmptyState';
import {
  getAllInspirations,
  getUniqueInspirationStyles,
} from '../data/inspirations';

export default function InspirationPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const allInspirations = useMemo(() => getAllInspirations(), []);
  const availableStyles = useMemo(() => getUniqueInspirationStyles(), []);

  // 1. Read Style Filter from URL Query Parameters
  const activeStyle = searchParams.get('style') || 'All';

  const handleStyleChange = (style) => {
    const newParams = new URLSearchParams(searchParams);
    if (!style || style === 'All') {
      newParams.delete('style');
    } else {
      newParams.set('style', style);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('style');
    setSearchParams(newParams);
  };

  // 2. Filter Lookbooks Dataset
  const filteredLookbooks = useMemo(() => {
    if (activeStyle === 'All') return allInspirations;
    return allInspirations.filter(
      (item) => item.style.toLowerCase() === activeStyle.toLowerCase()
    );
  }, [allInspirations, activeStyle]);

  const hasActiveFilter = activeStyle !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Interior Inspiration' },
          ...(hasActiveFilter ? [{ label: activeStyle }] : []),
        ]}
      />

      {/* 2. Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/40 pb-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-sand/60 rounded-full text-xs uppercase tracking-widest text-taupe font-medium shadow-xs">
            <Compass className="w-3.5 h-3.5 text-forest" />
            <span>Curated Portfolios</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-charcoal leading-tight">
            Interior Inspiration & Aesthetic Lookbooks
          </h1>

          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-normal">
            Immerse yourself in cohesive spatial design concepts. Each architectural portfolio
            pairs tactile materials, color palettes, and handcrafted furniture into liveable harmonies.
          </p>
        </div>

        {/* Portfolio Counter */}
        <div className="text-xs uppercase tracking-wider text-charcoal-muted self-start md:self-auto font-mono">
          Showing <span className="font-semibold text-charcoal">{filteredLookbooks.length}</span> of {allInspirations.length} Lookbooks
        </div>
      </div>

      {/* 3. Style Filter Navigation Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter lookbooks by interior style"
        >
          {availableStyles.map((style) => {
            const isSelected = activeStyle.toLowerCase() === style.toLowerCase();
            return (
              <button
                key={style}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleStyleChange(style)}
                className={`px-4 py-2 text-xs font-medium rounded transition-all duration-200 ${
                  isSelected
                    ? 'bg-forest text-ivory shadow-subtle'
                    : 'bg-white text-charcoal-muted border border-sand/50 hover:bg-ivory-subtle hover:text-charcoal'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>

        {/* Clear-All Filter Button */}
        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-forest hover:text-forest-dark flex items-center gap-1.5 font-medium hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to All Styles</span>
          </button>
        )}
      </div>

      {/* 4. Lookbook Grid / Empty State */}
      {filteredLookbooks.length === 0 ? (
        <EmptyState
          title="No Lookbooks Found"
          message={`We currently have no interior design lookbooks cataloged under the "${activeStyle}" style. Try viewing all styles or exploring our furniture catalog.`}
          actionLabel="View All Lookbooks"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredLookbooks.map((lookbook) => (
            <LookbookCard key={lookbook.id} lookbook={lookbook} />
          ))}
        </div>
      )}
    </div>
  );
}
