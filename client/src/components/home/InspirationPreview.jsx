import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass } from 'lucide-react';
import { INSPIRATION_STORIES } from '../../assets/furnitureMapping';

export default function InspirationPreview() {
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-taupe font-medium">
              Editorial Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal">
              Curated Interior Inspiration
            </h2>
            <p className="text-sm text-charcoal-muted max-w-xl">
              Immerse yourself in cohesive spatial aesthetics. Discover how organic materials, natural
              light, and handcrafted furniture harmonize.
            </p>
          </div>
          <Link
            to="/inspiration"
            className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1 group"
          >
            <span>Browse All Lookbooks</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INSPIRATION_STORIES.map((story) => (
            <Link
              key={story.id}
              to={`/inspiration/${story.id}`}
              className="card-architectural group overflow-hidden flex flex-col bg-white"
            >
              {/* Image Preview (3:2 Aspect Ratio) */}
              <div className="relative aspect-[3/2] bg-ivory-subtle overflow-hidden border-b border-sand/30">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[11px] font-medium text-forest shadow-subtle uppercase tracking-wider">
                  {story.style}
                </div>
              </div>

              {/* Story Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-taupe font-medium">
                    {story.room} • {story.featuredPiecesCount} Featured Pieces
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-charcoal group-hover:text-forest transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                    {story.designerNote}
                  </p>
                </div>

                {/* Color Palette Swatches Strip & Action */}
                <div className="pt-3 border-t border-sand/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5" title="Curated Room Palette">
                    {story.palette.map((hex, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-sand/60 shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-forest flex items-center gap-1 group-hover:underline">
                    Shop the Look <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
