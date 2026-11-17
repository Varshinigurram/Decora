import React from 'react';
import { Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function SwatchSelector({
  title,
  subtitle,
  options = [],
  selectedId,
  onSelect,
  type = 'fabric',
}) {
  if (!options || options.length === 0) return null;

  const formatDelta = (delta) => {
    if (delta === 0) return 'Included (Base)';
    if (delta > 0) return `+${formatINR(delta)}`;
    return `-${formatINR(Math.abs(delta))}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <label className="text-xs uppercase tracking-widest text-charcoal font-semibold block">
            {title}
          </label>
          {subtitle && (
            <span className="text-[11px] text-charcoal-muted block">{subtitle}</span>
          )}
        </div>
        <span className="text-[11px] font-mono text-taupe">
          {options.length} Option{options.length === 1 ? '' : 's'}
        </span>
      </div>

      {type === 'size' ? (
        /* Size Options Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-forest bg-white ring-2 ring-forest ring-offset-1 shadow-subtle'
                    : 'border-sand/60 bg-white/70 hover:bg-white text-charcoal-muted'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-charcoal">{opt.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-forest shrink-0" />}
                </div>
                <div className="pt-2 flex items-center justify-between w-full text-[11px]">
                  <span className="font-mono text-forest font-medium">{formatDelta(opt.delta)}</span>
                  {opt.scaleFactor && opt.scaleFactor !== 1 && (
                    <span className="text-[10px] text-taupe font-mono">
                      Scale ×{opt.scaleFactor}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Fabric / Finish Swatches Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={`p-2.5 rounded border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'border-forest bg-white ring-2 ring-forest ring-offset-1 shadow-subtle'
                    : 'border-sand/60 bg-white/70 hover:bg-white text-charcoal-muted'
                }`}
                aria-pressed={isSelected}
              >
                {/* Visual Swatch Pill / Circle */}
                <div
                  className="w-7 h-7 rounded-full border border-sand/80 shrink-0 shadow-xs flex items-center justify-center transition-transform"
                  style={{ backgroundColor: opt.colorHex || '#D8C8B5' }}
                  title={opt.name}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-charcoal block truncate">
                    {opt.name}
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] font-mono text-forest font-medium">
                      {formatDelta(opt.delta)}
                    </span>
                    {opt.texture && (
                      <span className="text-[10px] uppercase tracking-wider text-taupe capitalize">
                        {opt.texture}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-forest shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
