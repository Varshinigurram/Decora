import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';

export default function ProductGallery({
  images = [],
  fallback = '/assets/placeholders/placeholder-product.svg',
  productName = 'Furniture Piece',
}) {
  const galleryImages = images.length > 0 ? images : [fallback];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const activeSrc = imageErrorMap[activeImageIndex]
    ? fallback
    : galleryImages[activeImageIndex] || fallback;

  const handleImageError = (index) => {
    setImageErrorMap((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="space-y-4">
      {/* Main Staged Visual Stage (4:5 Ratio) */}
      <div
        className="relative aspect-[4/5] bg-ivory-subtle border border-sand/50 rounded overflow-hidden group shadow-elevated"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          src={activeSrc}
          alt={`${productName} view ${activeImageIndex + 1}`}
          onError={() => handleImageError(activeImageIndex)}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
            isZoomed ? 'scale-108' : 'scale-100'
          }`}
        />

        {/* Subtle Architectural Zoom Hint */}
        <div className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>

        {/* Angle Badge (Multi-image galleries only) */}
        {galleryImages.length > 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] uppercase tracking-wider text-taupe font-semibold border border-sand/40">
            Angle {activeImageIndex + 1} of {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            const thumbSrc = imageErrorMap[idx] ? fallback : img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-24 rounded overflow-hidden border-2 transition-all flex-shrink-0 bg-ivory-subtle ${
                  isSelected
                    ? 'border-forest shadow-sm ring-1 ring-forest'
                    : 'border-sand/50 opacity-70 hover:opacity-100 hover:border-sand'
                }`}
                aria-label={`Select angle ${idx + 1}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <img
                  src={thumbSrc}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  onError={() => handleImageError(idx)}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
