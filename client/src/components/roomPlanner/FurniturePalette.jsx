import React, { useState, useMemo } from 'react';
import { Plus, Sparkles, Layers, Search, PackageOpen } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import { renderFurnitureGlyph, getFurnitureGlyphType } from './furnitureVectors';
import { PRODUCTS } from '../../data/products';

export default function FurniturePalette({ onAddFurniture, customHandoffItem }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Seating', 'Tables', 'Beds', 'Storage', 'Lighting'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="card-architectural p-5 bg-white space-y-4 flex flex-col h-full">
      <div className="border-b border-sand/40 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
            Architectural Catalog
          </span>
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            Furniture Palette
          </h3>
        </div>
        <Layers className="w-4 h-4 text-forest" />
      </div>

      {/* Incoming Staged Customizer Piece (if arrived via /customizer handoff) */}
      {customHandoffItem && (
        <div className="p-3 bg-forest/5 border border-forest/30 rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-forest font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-forest" />
              Customized Configuration
            </span>
            <PriceDisplay amount={customHandoffItem.price} size="sm" className="font-semibold text-forest" />
          </div>
          <p className="text-xs font-serif font-medium text-charcoal">
            {customHandoffItem.name}
          </p>
          <div className="text-[11px] text-charcoal-muted flex items-center justify-between">
            <span>
              {customHandoffItem.dimensions?.width} &times; {customHandoffItem.dimensions?.depth} cm
            </span>
            <button
              type="button"
              onClick={() => onAddFurniture(customHandoffItem)}
              className="px-2.5 py-1 bg-forest text-white rounded text-[11px] font-medium hover:bg-forest-dark transition-colors inline-flex items-center gap-1 shadow-subtle"
            >
              <Plus className="w-3 h-3" />
              <span>Add Custom Piece</span>
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded transition-all shrink-0 font-medium ${
                isSelected
                  ? 'bg-forest text-white shadow-subtle'
                  : 'bg-ivory border border-sand/50 text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter pieces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-sand/60 rounded bg-ivory-subtle/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest text-charcoal placeholder:text-charcoal-muted/60"
        />
        <Search className="w-3.5 h-3.5 text-taupe absolute left-2.5 top-2 pointer-events-none" />
      </div>

      {/* Scrollable Furniture Items List */}
      <div className="overflow-y-auto space-y-2 pr-1 max-h-[380px] sm:max-h-[460px] flex-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const glyphType = getFurnitureGlyphType(product);
            const w = product.dimensions?.width || 80;
            const d = product.dimensions?.depth || 80;

            return (
              <div
                key={product.id}
                className="p-2.5 rounded border border-sand/50 hover:border-forest/50 bg-white hover:bg-ivory-subtle/40 transition-all flex items-center justify-between gap-3 group"
              >
                {/* Scaled Top-Down SVG Vector Thumbnail */}
                <div className="w-12 h-12 rounded bg-ivory-subtle border border-sand/40 flex items-center justify-center shrink-0 p-1">
                  <svg
                    viewBox={`0 0 ${Math.max(w, d) + 10} ${Math.max(w, d) + 10}`}
                    className="w-full h-full"
                  >
                    <g
                      transform={`translate(${(Math.max(w, d) + 10 - w) / 2}, ${(Math.max(w, d) + 10 - d) / 2})`}
                    >
                      {renderFurnitureGlyph(glyphType, w, d, false, false)}
                    </g>
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif font-medium text-charcoal truncate group-hover:text-forest transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] font-mono text-taupe truncate">
                      {w} &times; {d} cm
                    </span>
                    <PriceDisplay amount={product.basePrice} size="sm" className="font-semibold text-charcoal" />
                  </div>
                </div>

                {/* Add CTA */}
                <button
                  type="button"
                  onClick={() => onAddFurniture(product)}
                  className="w-7 h-7 rounded border border-sand/70 bg-white group-hover:bg-forest group-hover:border-forest group-hover:text-white text-forest flex items-center justify-center shrink-0 transition-colors shadow-subtle"
                  title={`Place ${product.name} on floorplan`}
                  aria-label={`Place ${product.name}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-charcoal-muted space-y-1">
            <PackageOpen className="w-6 h-6 text-taupe mx-auto" />
            <p className="text-xs">No furniture designs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
