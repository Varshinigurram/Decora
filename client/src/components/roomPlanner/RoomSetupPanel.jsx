import React from 'react';
import { Maximize2, Compass, Check, Grid } from 'lucide-react';
import { ROOM_PRESETS } from '../../utils/roomPlannerUtils';

export default function RoomSetupPanel({
  roomLength,
  roomWidth,
  onChangeLength,
  onChangeWidth,
  onSelectPreset,
  snapToGrid,
  onToggleSnap,
  showDimensions,
  onToggleDimensions,
}) {
  const areaM2 = (roomLength * roomWidth).toFixed(1);
  const areaSqFt = Math.round(roomLength * roomWidth * 10.7639);

  return (
    <div className="card-architectural p-5 bg-white space-y-5">
      <div className="border-b border-sand/40 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
            Architecture
          </span>
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            Room Boundary Setup
          </h3>
        </div>
        <Compass className="w-4 h-4 text-forest" />
      </div>

      {/* Preset Quick Selectors */}
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wider text-charcoal font-medium block">
          Architectural Presets
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ROOM_PRESETS.map((preset) => {
            const isSelected =
              Math.abs(roomLength - preset.length) < 0.05 &&
              Math.abs(roomWidth - preset.width) < 0.05;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onSelectPreset(preset.length, preset.width)}
                className={`px-2.5 py-1.5 text-left text-[11px] rounded border transition-all ${
                  isSelected
                    ? 'border-forest bg-forest/5 text-forest font-semibold'
                    : 'border-sand/60 bg-white hover:bg-ivory text-charcoal-muted'
                }`}
              >
                <span className="block truncate">{preset.label}</span>
                <span className="text-[10px] font-mono text-taupe block">
                  {preset.length}m &times; {preset.width}m
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimension Inputs in Metres */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal font-medium mb-1">
            Length (m)
          </label>
          <div className="relative">
            <input
              type="number"
              min="2.0"
              max="12.0"
              step="0.1"
              value={roomLength}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 1.5 && val <= 15) {
                  onChangeLength(val);
                }
              }}
              className="w-full px-3 py-2 pr-8 text-sm font-mono border border-sand rounded bg-white focus:outline-none focus:ring-1 focus:ring-forest text-charcoal"
            />
            <span className="absolute right-3 top-2.5 text-xs text-taupe font-mono pointer-events-none">
              m
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-charcoal font-medium mb-1">
            Width (m)
          </label>
          <div className="relative">
            <input
              type="number"
              min="2.0"
              max="12.0"
              step="0.1"
              value={roomWidth}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 1.5 && val <= 15) {
                  onChangeWidth(val);
                }
              }}
              className="w-full px-3 py-2 pr-8 text-sm font-mono border border-sand rounded bg-white focus:outline-none focus:ring-1 focus:ring-forest text-charcoal"
            />
            <span className="absolute right-3 top-2.5 text-xs text-taupe font-mono pointer-events-none">
              m
            </span>
          </div>
        </div>
      </div>

      {/* Room Scale & Area Summary */}
      <div className="p-3 bg-ivory-subtle rounded border border-sand/40 flex items-center justify-between text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Floor Area
          </span>
          <span className="font-serif text-sm font-semibold text-charcoal">
            {areaM2} m² <span className="text-xs font-sans text-charcoal-muted font-normal">({areaSqFt} sq ft)</span>
          </span>
        </div>
        <div className="text-right text-[11px] font-mono text-taupe">
          <span>{Math.round(roomLength * 100)} &times; {Math.round(roomWidth * 100)} cm</span>
        </div>
      </div>

      {/* Canvas Controls & Guides */}
      <div className="pt-2 border-t border-sand/30 space-y-2">
        <label className="flex items-center justify-between text-xs text-charcoal cursor-pointer">
          <span className="flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-forest" />
            <span>Snap to 10cm Grid</span>
          </span>
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => onToggleSnap(e.target.checked)}
            className="rounded border-sand text-forest focus:ring-forest"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-charcoal cursor-pointer">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-forest" />
            <span>Show Dimension Ticks</span>
          </span>
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={(e) => onToggleDimensions(e.target.checked)}
            className="rounded border-sand text-forest focus:ring-forest"
          />
        </label>
      </div>
    </div>
  );
}
