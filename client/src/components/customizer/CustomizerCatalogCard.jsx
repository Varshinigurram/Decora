import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sliders, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import PriceDisplay from '../common/PriceDisplay';

export default function CustomizerCatalogCard({ product }) {
  const [imgSrc, setImgSrc] = useState(
    product?.image || '/assets/placeholders/placeholder-product.svg'
  );

  const handleImageError = () => {
    setImgSrc(product?.fallback || '/assets/placeholders/placeholder-product.svg');
  };

  const { customizationOptions } = product || {};
  const fabricCount = customizationOptions?.fabrics?.length || 0;
  const finishCount = customizationOptions?.finishes?.length || 0;
  const sizeCount = customizationOptions?.sizes?.length || 0;

  return (
    <article className="card-architectural group overflow-hidden flex flex-col bg-white">
      {/* 4:5 Staged Product Image Canvas */}
      <Link
        to={`/customizer/${product.id}`}
        className="relative aspect-[4/5] bg-ivory-subtle overflow-hidden border-b border-sand/30 block"
        aria-label={`Configure ${product.name}`}
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <Badge variant="forest" size="xs">
            Customization Ready
          </Badge>
          {product.tag && (
            <Badge variant="taupe" size="xs">
              {product.tag}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content Details & Dynamic Feature Badges */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-taupe font-medium">
            <span>{product.category}</span>
            <span>{product.style}</span>
          </div>

          <Link to={`/customizer/${product.id}`} className="block">
            <h3 className="font-serif text-xl font-semibold text-charcoal group-hover:text-forest transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-charcoal-muted line-clamp-1">
            {Array.isArray(product.materials)
              ? product.materials.join(' · ')
              : product.primaryMaterial || product.material || ''}
          </p>

          {/* Dynamically derived customization summary badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {fabricCount > 0 && (
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/50 rounded text-[10px] text-charcoal font-medium">
                {fabricCount} Fabric{fabricCount === 1 ? '' : 's'}
              </span>
            )}
            {finishCount > 0 && (
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/50 rounded text-[10px] text-charcoal font-medium">
                {finishCount} Timber Finish{finishCount === 1 ? '' : 'es'}
              </span>
            )}
            {sizeCount > 0 && (
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/50 rounded text-[10px] text-charcoal font-medium">
                {sizeCount} Scale{sizeCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Strip & Launch CTA */}
        <div className="pt-3 border-t border-sand/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
              Starting Base Price
            </span>
            <PriceDisplay amount={product.basePrice} size="md" className="font-semibold" />
          </div>

          <Link
            to={`/customizer/${product.id}`}
            className="py-1.5 px-3 bg-forest text-ivory text-xs font-medium rounded hover:bg-forest-dark transition-colors flex items-center gap-1 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
