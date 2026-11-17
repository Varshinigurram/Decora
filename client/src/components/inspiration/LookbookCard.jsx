import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function LookbookCard({ lookbook }) {
  const [imgSrc, setImgSrc] = useState(
    lookbook?.heroImage || '/assets/placeholders/placeholder-product.svg'
  );

  const handleImageError = () => {
    setImgSrc(lookbook?.fallback || '/assets/placeholders/placeholder-product.svg');
  };

  const productCount = lookbook?.referencedProductIds?.length || 0;

  return (
    <article className="card-architectural group overflow-hidden flex flex-col bg-white">
      {/* 3:2 Editorial Image Canvas */}
      <Link
        to={`/inspiration/${lookbook.id}`}
        className="relative aspect-[3/2] bg-ivory-subtle overflow-hidden border-b border-sand/30 block"
        aria-label={`View ${lookbook.title} lookbook`}
      >
        <img
          src={imgSrc}
          alt={lookbook.title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Style Tag */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <Badge variant="forest" size="xs">
            {lookbook.style}
          </Badge>
        </div>

        {/* Room Type Tag */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[10px] uppercase tracking-wider text-taupe font-medium border border-sand/40 shadow-xs">
            {lookbook.roomLabel || lookbook.roomType}
          </span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-taupe font-medium">
            <span>{lookbook.roomLabel}</span>
            <span className="font-mono text-forest font-semibold">
              {productCount} Design{productCount === 1 ? '' : 's'} Featured
            </span>
          </div>

          <Link to={`/inspiration/${lookbook.id}`} className="block">
            <h3 className="font-serif text-2xl font-semibold text-charcoal group-hover:text-forest transition-colors leading-snug">
              {lookbook.title}
            </h3>
          </Link>

          <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-2 font-normal">
            {lookbook.shortDescription}
          </p>
        </div>

        {/* Color Palette Preview & Action */}
        <div className="pt-3 border-t border-sand/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5" title="Curated Color Palette">
            {lookbook.palette?.map((swatch, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-sand/60 shadow-xs inline-block"
                style={{ backgroundColor: swatch.hex }}
                title={`${swatch.name} (${swatch.hex})`}
              />
            ))}
          </div>

          <Link
            to={`/inspiration/${lookbook.id}`}
            className="text-xs font-medium text-forest hover:text-forest-dark flex items-center gap-1 group-hover:underline"
          >
            <span>Explore Lookbook</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
