import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sliders, ArrowUpRight } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Badge from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({
  product,
  isWishlisted: propIsWishlisted,
  onToggleWishlist,
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = propIsWishlisted !== undefined ? propIsWishlisted : isInWishlist(product?.id);
  const [imgSrc, setImgSrc] = useState(product?.image || '/assets/placeholders/placeholder-product.svg');
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImgSrc(product?.fallback || '/assets/placeholders/placeholder-product.svg');
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product?.id);
    } else {
      toggleWishlist(product?.id);
    }
  };

  return (
    <div
      className="card-architectural group relative flex flex-col overflow-hidden bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4:5 Portrait Image Container */}
      <div className="relative aspect-[4/5] bg-ivory-subtle overflow-hidden border-b border-sand/30">
        <img
          src={imgSrc}
          alt={product?.title || 'Furniture Design'}
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product?.tag && (
            <Badge variant="taupe" size="xs">
              {product.tag}
            </Badge>
          )}
          {product?.inStock ? (
            <Badge variant="forest" size="xs">
              In Stock
            </Badge>
          ) : (
            <Badge variant="warning" size="xs">
              Made to Order
            </Badge>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal-muted hover:text-accent-error shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
          aria-label={isWishlisted ? `Remove ${product?.title} from wishlist` : `Add ${product?.title} to wishlist`}
          title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-accent-error text-accent-error' : ''
            }`}
          />
        </button>

        {/* Quick Action Overlay (Fades in on Desktop hover) */}
        <div
          className={`hidden sm:flex absolute inset-x-3 bottom-3 gap-2 transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {product?.customizable ? (
            <Link
              to={`/customizer/${product?.id}`}
              className="flex-1 py-2 px-3 bg-forest text-ivory text-xs font-medium tracking-wide text-center rounded hover:bg-forest-dark transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              Customize
            </Link>
          ) : null}
          <Link
            to={`/catalog/${product?.id}`}
            className="flex-1 py-2 px-3 bg-white/95 text-charcoal border border-sand text-xs font-medium tracking-wide text-center rounded hover:bg-ivory-subtle transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            Details <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-taupe font-medium">
            <span>{product?.category}</span>
            <span>{product?.style}</span>
          </div>
          <Link to={`/catalog/${product?.id}`} className="block group-hover:text-forest transition-colors">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal line-clamp-1">
              {product?.title}
            </h3>
          </Link>
          <p className="text-xs text-charcoal-muted line-clamp-1">
            {product?.materials || product?.dimensions}
          </p>
        </div>

        {/* Pricing Strip */}
        <div className="pt-2 border-t border-sand/30 flex items-baseline justify-between">
          <span className="text-[11px] text-charcoal-muted uppercase tracking-wider">
            Starting from
          </span>
          <PriceDisplay amount={product?.basePrice} size="md" className="font-semibold" />
        </div>
      </div>
    </div>
  );
}
