import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ROOM_CATEGORIES } from '../../assets/furnitureMapping';

export default function RoomCategories() {
  return (
    <section className="py-12 border-t border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-taupe font-medium">
              Architectural Spaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal">
              Curated by Living Space
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1 group"
          >
            <span>Explore All 34 Pieces</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 4-Column Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.path}
              className="card-architectural group overflow-hidden flex flex-col bg-white"
            >
              {/* Category Image Staging (4:3 Aspect Ratio) */}
              <div className="relative aspect-[4/3] bg-ivory-subtle overflow-hidden border-b border-sand/30">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[11px] font-medium text-taupe shadow-subtle">
                  {cat.pieceCount}
                </div>
              </div>

              {/* Text Meta */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-charcoal group-hover:text-forest transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="pt-3 border-t border-sand/30 flex items-center justify-between text-xs font-medium text-forest mt-3">
                  <span>View Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
