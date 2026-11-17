import React from 'react';

export default function PaletteSwatches({ palette = [], className = '' }) {
  if (!palette || palette.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <span className="text-xs uppercase tracking-widest text-taupe font-semibold block">
        Curated Palette & Chromatic Harmony
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {palette.map((swatch, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-sand/40 rounded flex flex-col items-start gap-2 shadow-subtle group hover:border-taupe/60 transition-colors"
          >
            <div
              className="w-full h-10 rounded border border-sand/50 shadow-xs transition-transform duration-300 group-hover:scale-102"
              style={{ backgroundColor: swatch.hex }}
              aria-label={`Color swatch for ${swatch.name} (${swatch.hex})`}
            />
            <div className="space-y-0.5 min-w-0 w-full">
              <span className="text-xs font-medium text-charcoal block truncate">
                {swatch.name}
              </span>
              <span className="text-[10px] font-mono text-charcoal-muted uppercase block">
                {swatch.hex}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
