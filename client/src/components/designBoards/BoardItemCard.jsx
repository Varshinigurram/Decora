import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Sliders, ExternalLink, Sparkles } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Badge from '../common/Badge';

export default function BoardItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}) {
  const [imgSrc, setImgSrc] = useState(
    item.image || '/assets/placeholders/placeholder-product.svg'
  );

  const handleImageError = () => {
    setImgSrc('/assets/placeholders/placeholder-product.svg');
  };

  const lineTotal = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);
  const selectedOptions = item.selectedOptions || {};
  const fabric = selectedOptions.fabric;
  const finish = selectedOptions.finish;
  const size = selectedOptions.size;

  return (
    <article className="card-architectural p-4 sm:p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:shadow-subtle">
      {/* Left: Thumbnail & Details */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Product Visual Thumbnail */}
        <Link
          to={`/catalog/${item.productSlug || item.productId}`}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-ivory-subtle rounded border border-sand/40 overflow-hidden shrink-0 flex items-center justify-center p-2 group"
          title={`View full details for ${item.name}`}
        >
          <img
            src={imgSrc}
            alt={item.name}
            onError={handleImageError}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Snapshot Information */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold">
              {item.category}
            </span>
            {item.isCustomized ? (
              <Badge variant="forest" size="xs">
                Bespoke Snapshot
              </Badge>
            ) : (
              <Badge variant="taupe" size="xs">
                Standard Spec
              </Badge>
            )}
          </div>

          <Link
            to={`/catalog/${item.productSlug || item.productId}`}
            className="block font-serif text-lg font-semibold text-charcoal hover:text-forest transition-colors truncate"
          >
            {item.name}
          </Link>

          {/* Saved Material & Finish Configuration Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            {fabric && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-ivory-subtle border border-sand/50 rounded text-[11px] text-charcoal font-medium">
                {fabric.colorHex && (
                  <span
                    className="w-3 h-3 rounded-full border border-sand/70 shrink-0"
                    style={{ backgroundColor: fabric.colorHex }}
                  />
                )}
                <span className="truncate max-w-[130px]">{fabric.name}</span>
              </div>
            )}

            {finish && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-ivory-subtle border border-sand/50 rounded text-[11px] text-charcoal font-medium">
                {finish.colorHex && (
                  <span
                    className="w-3 h-3 rounded-full border border-sand/70 shrink-0"
                    style={{ backgroundColor: finish.colorHex }}
                  />
                )}
                <span className="truncate max-w-[130px]">{finish.name}</span>
              </div>
            )}

            {size && (
              <span className="px-2 py-0.5 bg-ivory border border-sand/50 rounded text-[10px] font-mono text-forest font-medium">
                {size.name}
              </span>
            )}
          </div>

          {/* Metric Dimensions */}
          {item.dimensions?.formatted && (
            <p className="text-[11px] font-mono text-taupe">
              Scale: {item.dimensions.formatted}
            </p>
          )}
        </div>
      </div>

      {/* Right: Quantity Stepper, Prices, and Actions */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-sand/30">
        {/* Quantity Controls */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
            Quantity
          </span>
          <div className="inline-flex items-center border border-sand rounded bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.boardItemId, Math.max(1, (item.quantity || 1) - 1))}
              disabled={(item.quantity || 1) <= 1}
              className="p-1.5 text-charcoal hover:bg-ivory disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-1 font-mono text-xs font-semibold text-charcoal min-w-[32px] text-center">
              {item.quantity || 1}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.boardItemId, (item.quantity || 1) + 1)}
              className="p-1.5 text-charcoal hover:bg-ivory transition-colors"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pricing Breakdown: Unit Price & Line Total */}
        <div className="text-right min-w-[110px]">
          <div className="text-[10px] uppercase tracking-wider text-charcoal-muted">
            {item.quantity > 1 ? (
              <span>
                ₹{item.unitPrice?.toLocaleString('en-IN')} &times; {item.quantity}
              </span>
            ) : (
              <span>Unit Price</span>
            )}
          </div>
          <PriceDisplay
            amount={lineTotal}
            size="lg"
            className="font-serif font-bold text-charcoal text-lg"
          />
        </div>

        {/* Actions Strip */}
        <div className="flex items-center gap-1.5">
          <Link
            to={`/customizer/${item.productId}`}
            className="p-2 text-taupe hover:text-forest hover:bg-ivory rounded transition-colors"
            title="Inspect / adjust bespoke options in Customizer"
            aria-label={`Reconfigure ${item.name}`}
          >
            <Sliders className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => onRemove(item.boardItemId)}
            className="p-2 text-taupe hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Remove item from design board"
            aria-label={`Remove ${item.name} from board`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
