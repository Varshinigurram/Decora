import React, { useMemo } from 'react';
import { RotateCw, RotateCcw, Trash2, X, AlertTriangle, Layers, Sliders, Check, Sparkles } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Button from '../common/Button';
import { PRODUCTS } from '../../data/products';
import { calculateConfiguredPrice } from '../../utils/pricingEngine';
import { formatINR } from '../../utils/formatters';

export default function SelectedFurnitureInspector({
  selectedItem,
  hasCollision,
  onRotate,
  onRemove,
  onDeselect,
  onUpdateConfiguration,
}) {
  if (!selectedItem) {
    return (
      <div className="card-architectural p-4 bg-white/70 border border-sand/50 text-center space-y-1.5 text-charcoal-muted">
        <Layers className="w-5 h-5 text-taupe mx-auto" />
        <p className="text-xs font-serif text-charcoal">No Piece Selected</p>
        <p className="text-[11px] text-charcoal-muted leading-relaxed">
          Click any placed furniture block on the floorplan to inspect, customize materials & finishes, rotate, or reposition.
        </p>
      </div>
    );
  }

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === selectedItem.productId) || null;
  }, [selectedItem.productId]);

  const customizationOptions = product?.customizationOptions || null;
  const isCustomizable = Boolean(product?.customizable && customizationOptions);

  const fabrics = customizationOptions?.fabrics || [];
  const finishes = customizationOptions?.finishes || [];
  const sizes = customizationOptions?.sizes || [];

  const currentConfig = selectedItem.configuration || {
    fabricId: selectedItem.activeFabric?.id || null,
    finishId: selectedItem.activeFinish?.id || null,
    sizeId: selectedItem.activeSize?.id || null,
  };

  const handleSelectFabric = (fabricId) => {
    if (!product) return;
    const nextConfig = { ...currentConfig, fabricId };
    onUpdateConfiguration(selectedItem.instanceId, nextConfig);
  };

  const handleSelectFinish = (finishId) => {
    if (!product) return;
    const nextConfig = { ...currentConfig, finishId };
    onUpdateConfiguration(selectedItem.instanceId, nextConfig);
  };

  const handleSelectSize = (sizeId) => {
    if (!product) return;
    const nextConfig = { ...currentConfig, sizeId };
    onUpdateConfiguration(selectedItem.instanceId, nextConfig);
  };

  const formatDelta = (delta) => {
    if (delta === 0) return 'Included';
    if (delta > 0) return `+${formatINR(delta)}`;
    return `-${formatINR(Math.abs(delta))}`;
  };

  return (
    <div
      className={`card-architectural p-5 bg-white space-y-5 transition-all ${
        hasCollision ? 'ring-2 ring-red-400 border-red-200' : 'border-forest/40'
      }`}
    >
      {/* Header with Title and Deselect */}
      <div className="flex items-start justify-between border-b border-sand/40 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-forest font-semibold">
              Selected Piece
            </span>
            {isCustomizable ? (
              <span className="px-1.5 py-0.2 bg-forest/10 text-forest text-[9px] font-medium rounded flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Customizable
              </span>
            ) : (
              <span className="px-1.5 py-0.2 bg-sand/30 text-taupe text-[9px] font-medium rounded">
                Standard Spec
              </span>
            )}
          </div>
          <h3 className="font-serif text-base font-semibold text-charcoal leading-snug">
            {selectedItem.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onDeselect}
          className="text-taupe hover:text-charcoal p-1 rounded hover:bg-ivory transition-colors"
          title="Deselect piece"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Collision Alert Banner */}
      {hasCollision && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Spatial Overlap Detected</span>
            <p className="text-[11px] leading-relaxed">
              This piece intersects another placed item. Reposition or rotate to ensure architectural clearance.
            </p>
          </div>
        </div>
      )}

      {/* Dimensions & Instance Price */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-ivory-subtle rounded border border-sand/40">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Configured Price
          </span>
          <PriceDisplay amount={selectedItem.price} size="sm" className="font-semibold text-forest mt-0.5" />
        </div>

        <div className="p-2.5 bg-ivory-subtle rounded border border-sand/40">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Scale (W &times; D)
          </span>
          <span className="font-mono text-charcoal mt-0.5 block">
            {selectedItem.w} &times; {selectedItem.d} cm
          </span>
        </div>
      </div>

      {/* Live Customization Trays (Only for customizable pieces) */}
      {isCustomizable && (
        <div className="space-y-4 pt-2 border-t border-sand/30">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-forest" />
            <span className="text-xs font-semibold text-charcoal">
              Live Material Customization
            </span>
          </div>

          {/* 1. Upholstery Textile Swatches */}
          {fabrics.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-charcoal font-medium block">
                Upholstery Textile
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {fabrics.map((fabric) => {
                  const isSelected = currentConfig.fabricId === fabric.id;
                  return (
                    <button
                      key={fabric.id}
                      type="button"
                      onClick={() => handleSelectFabric(fabric.id)}
                      className={`p-2 rounded border text-left transition-all flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'border-forest bg-forest/5 ring-1 ring-forest'
                          : 'border-sand/60 bg-white hover:bg-ivory'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-sand shrink-0 shadow-xs"
                          style={{ backgroundColor: fabric.colorHex }}
                        />
                        <div className="min-w-0">
                          <span className="text-[11px] font-medium text-charcoal truncate block">
                            {fabric.name}
                          </span>
                          <span className="text-[10px] font-mono text-taupe block">
                            {formatDelta(fabric.delta)}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-forest shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Timber Finish Swatches */}
          {finishes.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-charcoal font-medium block">
                Timber Finish
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {finishes.map((finish) => {
                  const isSelected = currentConfig.finishId === finish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => handleSelectFinish(finish.id)}
                      className={`p-2 rounded border text-left transition-all flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'border-forest bg-forest/5 ring-1 ring-forest'
                          : 'border-sand/60 bg-white hover:bg-ivory'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-sand shrink-0 shadow-xs"
                          style={{ backgroundColor: finish.colorHex }}
                        />
                        <div className="min-w-0">
                          <span className="text-[11px] font-medium text-charcoal truncate block">
                            {finish.name}
                          </span>
                          <span className="text-[10px] font-mono text-taupe block">
                            {formatDelta(finish.delta)}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-forest shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Size / Scale Options */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-charcoal font-medium block">
                Scale &amp; Proportion
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {sizes.map((size) => {
                  const isSelected = currentConfig.sizeId === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleSelectSize(size.id)}
                      className={`p-2 rounded border text-left transition-all flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'border-forest bg-forest/5 ring-1 ring-forest'
                          : 'border-sand/60 bg-white hover:bg-ivory'
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-medium text-charcoal block">
                          {size.name}
                        </span>
                        <span className="text-[10px] font-mono text-taupe block">
                          {formatDelta(size.delta)}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-forest shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rotation Angle and Controls */}
      <div className="space-y-2 pt-1 border-t border-sand/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-charcoal-muted">Orientation:</span>
          <span className="font-mono font-medium text-forest">{selectedItem.rotation || 0}&deg;</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onRotate(selectedItem.instanceId, -45)}
            className="px-2 py-1.5 bg-ivory border border-sand/60 hover:bg-sand/20 rounded text-xs text-charcoal font-medium inline-flex items-center justify-center gap-1 transition-colors"
            title="Rotate 45 degrees counter-clockwise"
          >
            <RotateCcw className="w-3.5 h-3.5 text-forest" />
            <span>-45&deg;</span>
          </button>

          <button
            type="button"
            onClick={() => onRotate(selectedItem.instanceId, 45)}
            className="px-2 py-1.5 bg-ivory border border-sand/60 hover:bg-sand/20 rounded text-xs text-charcoal font-medium inline-flex items-center justify-center gap-1 transition-colors"
            title="Rotate 45 degrees clockwise"
          >
            <RotateCw className="w-3.5 h-3.5 text-forest" />
            <span>+45&deg;</span>
          </button>

          <button
            type="button"
            onClick={() => onRotate(selectedItem.instanceId, 90)}
            className="px-2 py-1.5 bg-ivory border border-sand/60 hover:bg-sand/20 rounded text-xs text-charcoal font-medium inline-flex items-center justify-center gap-1 transition-colors"
            title="Rotate 90 degrees clockwise"
          >
            <RotateCw className="w-3.5 h-3.5 text-forest" />
            <span>+90&deg;</span>
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-red-700 hover:text-red-800 hover:bg-red-50 border-red-200 flex items-center justify-center gap-1.5"
          onClick={() => onRemove(selectedItem.instanceId)}
        >
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
          <span>Remove from Floorplan</span>
        </Button>
      </div>
    </div>
  );
}
