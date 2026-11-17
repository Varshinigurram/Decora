import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, ArrowUpRight, Palette } from 'lucide-react';

export default function BoardMoodboardCanvas({ board }) {
  const items = board?.items || [];

  if (items.length === 0) {
    return (
      <div className="card-architectural p-8 sm:p-12 bg-white text-center space-y-4 border border-dashed border-sand">
        <div className="w-12 h-12 rounded-full bg-ivory-subtle border border-sand/50 flex items-center justify-center mx-auto text-taupe">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="font-serif text-xl font-semibold text-charcoal">
            Moodboard Canvas Empty
          </h4>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Add furniture pieces from the catalog or customizer to automatically generate an editorial moodboard collage with physical material swatches.
          </p>
        </div>
      </div>
    );
  }

  // Aggregate all unique material and finish color chips from saved snapshots
  const materialPalette = [];
  const seenColors = new Set();

  items.forEach((item) => {
    const fabric = item.selectedOptions?.fabric;
    const finish = item.selectedOptions?.finish;

    if (fabric?.colorHex && !seenColors.has(fabric.colorHex)) {
      seenColors.add(fabric.colorHex);
      materialPalette.push({
        name: fabric.name,
        type: 'Textile',
        hex: fabric.colorHex,
      });
    }

    if (finish?.colorHex && !seenColors.has(finish.colorHex)) {
      seenColors.add(finish.colorHex);
      materialPalette.push({
        name: finish.name,
        type: 'Timber Finish',
        hex: finish.colorHex,
      });
    }
  });

  return (
    <div className="card-architectural p-6 sm:p-8 bg-[#FAF8F5] border border-sand/60 space-y-8 shadow-subtle relative overflow-hidden">
      {/* Background Architectural Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Moodboard Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/40 pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-forest font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-forest" />
              Harmonized Palette &amp; Form
            </span>
            <span className="text-[10px] uppercase tracking-wider text-taupe font-medium">
              &bull; {board.roomType} ({board.style})
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
            {board.title} — Moodboard Studio
          </h3>
          {board.description && (
            <p className="text-xs text-charcoal-muted max-w-xl italic font-serif">
              "{board.description}"
            </p>
          )}
        </div>

        {/* Aggregated Palette Bar */}
        {materialPalette.length > 0 && (
          <div className="p-3 bg-white/90 backdrop-blur-sm rounded border border-sand/50 space-y-1.5 shrink-0 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-taupe font-semibold">
              <Palette className="w-3 h-3 text-forest" />
              <span>Material Swatches ({materialPalette.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              {materialPalette.map((chip, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border border-sand/80 shadow-xs cursor-help transition-transform hover:scale-125"
                  style={{ backgroundColor: chip.hex }}
                  title={`${chip.type}: ${chip.name} (${chip.hex})`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editorial Collage Grid (Staggered Asymmetric Presentation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {items.map((item, index) => {
          const fabric = item.selectedOptions?.fabric;
          const finish = item.selectedOptions?.finish;
          const size = item.selectedOptions?.size;

          return (
            <div
              key={item.boardItemId}
              className={`bg-white rounded border border-sand/50 overflow-hidden shadow-subtle flex flex-col justify-between group transition-all duration-300 hover:shadow-elevated ${
                index === 0 && items.length > 2 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Product Visual Canvas */}
              <Link
                to={`/catalog/${item.productSlug || item.productId}`}
                className="relative aspect-[4/3] bg-ivory-subtle overflow-hidden flex items-center justify-center p-4 block"
              >
                <img
                  src={item.image || '/assets/placeholders/placeholder-product.svg'}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Floating Tactile Swatch Chips */}
                {(fabric || finish) && (
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 bg-white/95 backdrop-blur-md rounded border border-sand/50 shadow-subtle flex items-center justify-between text-[11px] gap-2">
                    <div className="flex items-center gap-2 truncate">
                      {fabric && (
                        <div className="flex items-center gap-1 truncate" title={`Textile: ${fabric.name}`}>
                          <span
                            className="w-3 h-3 rounded-full border border-sand/70 shrink-0"
                            style={{ backgroundColor: fabric.colorHex }}
                          />
                          <span className="font-medium text-charcoal truncate max-w-[90px]">
                            {fabric.name}
                          </span>
                        </div>
                      )}
                      {finish && (
                        <div className="flex items-center gap-1 truncate" title={`Finish: ${finish.name}`}>
                          <span
                            className="w-3 h-3 rounded-full border border-sand/70 shrink-0"
                            style={{ backgroundColor: finish.colorHex }}
                          />
                          <span className="font-medium text-charcoal truncate max-w-[90px]">
                            {finish.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {size && (
                      <span className="px-1.5 py-0.2 bg-ivory border border-sand/40 rounded text-[9px] font-mono text-forest shrink-0">
                        {size.name}
                      </span>
                    )}
                  </div>
                )}
              </Link>

              {/* Editorial Caption */}
              <div className="p-4 space-y-1.5 border-t border-sand/30 bg-white">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-taupe font-semibold">
                  <span>{item.category}</span>
                  <span>Qty: {item.quantity}</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-serif text-base font-semibold text-charcoal group-hover:text-forest transition-colors truncate">
                    {item.name}
                  </h4>
                  <span className="font-mono text-xs font-semibold text-charcoal shrink-0">
                    ₹{item.unitPrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                {item.dimensions?.formatted && (
                  <p className="text-[10px] font-mono text-taupe truncate">
                    {item.dimensions.formatted}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
