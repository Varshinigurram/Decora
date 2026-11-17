import React from 'react';
import { RotateCw, RotateCcw, Trash2, X, AlertTriangle, Layers, Ruler } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Button from '../common/Button';

export default function SelectedFurnitureInspector({
  selectedItem,
  hasCollision,
  onRotate,
  onRemove,
  onDeselect,
}) {
  if (!selectedItem) {
    return (
      <div className="card-architectural p-4 bg-white/70 border border-sand/50 text-center space-y-1.5 text-charcoal-muted">
        <Layers className="w-5 h-5 text-taupe mx-auto" />
        <p className="text-xs font-serif text-charcoal">No Piece Selected</p>
        <p className="text-[11px] text-charcoal-muted leading-relaxed">
          Click any placed furniture block on the floorplan to rotate, reposition, or inspect dimensions.
        </p>
      </div>
    );
  }

  return (
    <div className={`card-architectural p-5 bg-white space-y-4 transition-all ${
      hasCollision ? 'ring-2 ring-red-400 border-red-200' : 'border-forest/40'
    }`}>
      {/* Header with Title and Deselect */}
      <div className="flex items-start justify-between border-b border-sand/40 pb-3">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-forest font-semibold block">
            Selected Piece
          </span>
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

      {/* Item Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-ivory-subtle rounded border border-sand/40">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Estimated Price
          </span>
          <PriceDisplay amount={selectedItem.price} size="sm" className="font-semibold text-charcoal mt-0.5" />
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
