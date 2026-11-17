import React from 'react';
import { Search, X, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';

export default function CatalogFilters({
  searchQuery,
  onSearchChange,
  selectedRoom,
  onRoomChange,
  selectedCategory,
  onCategoryChange,
  selectedMaterials,
  onMaterialToggle,
  minPrice,
  maxPrice,
  onPriceRangeChange,
  minCatalogPrice,
  maxCatalogPrice,
  inStockOnly,
  onInStockToggle,
  onResetFilters,
  hasActiveFilters,
  activeFilterCount,
  roomOptions = [],
  categoryOptions = [],
  materialOptions = [],
}) {
  const isPriceFiltered = minPrice > minCatalogPrice || maxPrice < maxCatalogPrice;

  const handleMinSliderChange = (e) => {
    const val = Number(e.target.value);
    const clampedVal = Math.min(val, maxPrice);
    onPriceRangeChange(clampedVal, maxPrice);
  };

  const handleMaxSliderChange = (e) => {
    const val = Number(e.target.value);
    const clampedVal = Math.max(val, minPrice);
    onPriceRangeChange(minPrice, clampedVal);
  };

  const setTier = (tierMin, tierMax) => {
    onPriceRangeChange(tierMin, tierMax);
  };

  return (
    <aside className="space-y-6" aria-label="Catalog Filters">
      {/* Search Header */}
      <div className="space-y-2">
        <label
          htmlFor="catalog-search"
          className="text-xs uppercase tracking-widest text-taupe font-semibold block"
        >
          Search Collection
        </label>
        <div className="relative">
          <input
            id="catalog-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search piece, material, style..."
            className="w-full bg-white border border-sand/60 rounded px-3.5 py-2 pl-9 text-xs text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest transition-all"
          />
          <Search className="w-4 h-4 text-taupe absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-charcoal-muted hover:text-charcoal p-0.5"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips & Reset */}
      {hasActiveFilters && (
        <div className="p-3 bg-ivory-subtle border border-sand/50 rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-taupe font-semibold">
              Active Filters ({activeFilterCount})
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] text-forest hover:text-forest-dark hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-sand/60 rounded text-[11px] text-charcoal">
                "{searchQuery}"
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3 text-taupe hover:text-charcoal" />
                </button>
              </span>
            )}
            {selectedRoom !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-sand/60 rounded text-[11px] text-charcoal">
                Room: {roomOptions.find((r) => r.id === selectedRoom)?.label || selectedRoom}
                <button
                  type="button"
                  onClick={() => onRoomChange('all')}
                  aria-label="Remove room filter"
                >
                  <X className="w-3 h-3 text-taupe hover:text-charcoal" />
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-sand/60 rounded text-[11px] text-charcoal">
                Category: {selectedCategory}
                <button
                  type="button"
                  onClick={() => onCategoryChange('All')}
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3 text-taupe hover:text-charcoal" />
                </button>
              </span>
            )}
            {selectedMaterials.map((mat) => (
              <span
                key={mat}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-sand/60 rounded text-[11px] text-charcoal"
              >
                {mat}
                <button
                  type="button"
                  onClick={() => onMaterialToggle(mat)}
                  aria-label={`Remove material filter ${mat}`}
                >
                  <X className="w-3 h-3 text-taupe hover:text-charcoal" />
                </button>
              </span>
            ))}
            {isPriceFiltered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-sand/60 rounded text-[11px] text-charcoal">
                ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                <button
                  type="button"
                  onClick={() => onPriceRangeChange(minCatalogPrice, maxCatalogPrice)}
                  aria-label="Remove price range filter"
                >
                  <X className="w-3 h-3 text-taupe hover:text-charcoal" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-sand/60 rounded text-[11px] text-charcoal">
                In Stock Only
                <button
                  type="button"
                  onClick={() => onInStockToggle(false)}
                  aria-label="Remove in stock filter"
                >
                  <X className="w-3 h-3 text-taupe hover:text-charcoal" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Living Space / Room Type */}
      <div className="border-t border-sand/40 pt-4 space-y-2">
        <h4 className="text-xs uppercase tracking-widest text-taupe font-semibold">
          Living Space
        </h4>
        <div className="space-y-1">
          {roomOptions.map((room) => {
            const isSelected = selectedRoom === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onRoomChange(room.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-forest text-ivory font-medium'
                    : 'text-charcoal-muted hover:bg-ivory-subtle hover:text-charcoal'
                }`}
              >
                <span>{room.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-ivory" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Furniture Category */}
      <div className="border-t border-sand/40 pt-4 space-y-2">
        <h4 className="text-xs uppercase tracking-widest text-taupe font-semibold">
          Furniture Category
        </h4>
        <div className="space-y-1">
          {categoryOptions.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-forest text-ivory font-medium'
                    : 'text-charcoal-muted hover:bg-ivory-subtle hover:text-charcoal'
                }`}
              >
                <span>{category}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-ivory" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Proper Minimum & Maximum Price Range Filter */}
      <div className="border-t border-sand/40 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-widest text-taupe font-semibold">
            Price Range (INR ₹)
          </h4>
          <span className="text-xs font-mono font-medium text-forest">
            ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Quick Tiers */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setTier(minCatalogPrice, maxCatalogPrice)}
            className={`py-1 px-2 rounded text-[11px] font-medium transition-all ${
              !isPriceFiltered
                ? 'bg-forest text-ivory'
                : 'bg-white border border-sand/50 text-charcoal-muted hover:bg-ivory-subtle hover:text-charcoal'
            }`}
          >
            All Prices
          </button>
          <button
            type="button"
            onClick={() => setTier(minCatalogPrice, 25000)}
            className={`py-1 px-2 rounded text-[11px] font-medium transition-all ${
              minPrice === minCatalogPrice && maxPrice === 25000
                ? 'bg-forest text-ivory'
                : 'bg-white border border-sand/50 text-charcoal-muted hover:bg-ivory-subtle hover:text-charcoal'
            }`}
          >
            Under ₹25k
          </button>
          <button
            type="button"
            onClick={() => setTier(25000, 45000)}
            className={`py-1 px-2 rounded text-[11px] font-medium transition-all ${
              minPrice === 25000 && maxPrice === 45000
                ? 'bg-forest text-ivory'
                : 'bg-white border border-sand/50 text-charcoal-muted hover:bg-ivory-subtle hover:text-charcoal'
            }`}
          >
            ₹25k – ₹45k
          </button>
          <button
            type="button"
            onClick={() => setTier(45000, maxCatalogPrice)}
            className={`py-1 px-2 rounded text-[11px] font-medium transition-all ${
              minPrice === 45000 && maxPrice === maxCatalogPrice
                ? 'bg-forest text-ivory'
                : 'bg-white border border-sand/50 text-charcoal-muted hover:bg-ivory-subtle hover:text-charcoal'
            }`}
          >
            ₹45k & Above
          </button>
        </div>

        {/* Min Price Slider */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-charcoal-muted">
            <span>Minimum Price</span>
            <span className="font-mono font-medium text-charcoal">₹{minPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={minCatalogPrice}
            max={maxCatalogPrice}
            step="1000"
            value={minPrice}
            onChange={handleMinSliderChange}
            className="w-full accent-forest cursor-pointer h-1.5 bg-sand/50 rounded appearance-none"
            aria-label="Minimum price filter"
          />
        </div>

        {/* Max Price Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-charcoal-muted">
            <span>Maximum Price</span>
            <span className="font-mono font-medium text-charcoal">₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={minCatalogPrice}
            max={maxCatalogPrice}
            step="1000"
            value={maxPrice}
            onChange={handleMaxSliderChange}
            className="w-full accent-forest cursor-pointer h-1.5 bg-sand/50 rounded appearance-none"
            aria-label="Maximum price filter"
          />
        </div>
      </div>

      {/* Availability / In-Stock Toggle */}
      <div className="border-t border-sand/40 pt-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-medium text-charcoal group-hover:text-forest transition-colors">
            In Stock & Ready to Ship
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockToggle(e.target.checked)}
            className="w-4 h-4 accent-forest rounded border-sand/60 cursor-pointer"
          />
        </label>
      </div>

      {/* Tactile Materials */}
      <div className="border-t border-sand/40 pt-4 space-y-2">
        <h4 className="text-xs uppercase tracking-widest text-taupe font-semibold">
          Primary Materials
        </h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {materialOptions.map((mat) => {
            const isChecked = selectedMaterials.includes(mat);
            return (
              <label
                key={mat}
                className="flex items-center gap-2.5 text-xs text-charcoal-muted hover:text-charcoal cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onMaterialToggle(mat)}
                  className="w-3.5 h-3.5 accent-forest rounded border-sand/60 cursor-pointer"
                />
                <span className={isChecked ? 'text-charcoal font-medium' : ''}>{mat}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
