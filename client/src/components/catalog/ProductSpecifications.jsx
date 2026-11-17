import React from 'react';
import { Ruler, ShieldCheck, Hammer, Sparkles, Box, Info } from 'lucide-react';

export default function ProductSpecifications({ product }) {
  if (!product) return null;

  const { dimensions, weightKg, specifications, primaryMaterial, materials } = product;

  return (
    <div className="space-y-6 pt-6 border-t border-sand/40">
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
          Architectural Details
        </span>
        <h3 className="font-serif text-2xl font-semibold text-charcoal">
          Specifications & Tactility
        </h3>
      </div>

      {/* Metric Dimension Grid Callout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white border border-sand/50 rounded shadow-subtle">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Width
          </span>
          <span className="font-mono text-base font-semibold text-charcoal">
            {dimensions?.width} cm
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Depth
          </span>
          <span className="font-mono text-base font-semibold text-charcoal">
            {dimensions?.depth} cm
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Height
          </span>
          <span className="font-mono text-base font-semibold text-charcoal">
            {dimensions?.height} cm
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
            Net Weight
          </span>
          <span className="font-mono text-base font-semibold text-charcoal">
            {weightKg} kg
          </span>
        </div>
      </div>

      {/* Detailed Specifications Table */}
      <div className="border border-sand/40 rounded overflow-hidden bg-white divide-y divide-sand/30 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
          <span className="text-taupe font-medium flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-forest" />
            Formatted Metric Scale
          </span>
          <span className="sm:col-span-2 text-charcoal font-mono font-medium">
            {dimensions?.formatted || `${dimensions?.width} × ${dimensions?.depth} × ${dimensions?.height} cm`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
          <span className="text-taupe font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-forest" />
            Primary Material
          </span>
          <span className="sm:col-span-2 text-charcoal font-medium">
            {primaryMaterial || (materials && materials[0])}
          </span>
        </div>

        {materials && materials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-forest" />
              Composite Elements
            </span>
            <span className="sm:col-span-2 text-charcoal-muted">
              {materials.join(' • ')}
            </span>
          </div>
        )}

        {specifications?.frameMaterial && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-forest" />
              Structural Frame
            </span>
            <span className="sm:col-span-2 text-charcoal">
              {specifications.frameMaterial}
            </span>
          </div>
        )}

        {specifications?.joinery && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-forest" />
              Architectural Joinery
            </span>
            <span className="sm:col-span-2 text-charcoal">
              {specifications.joinery}
            </span>
          </div>
        )}

        {specifications?.cushionFill && specifications.cushionFill !== 'N/A' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              Cushion Composition
            </span>
            <span className="sm:col-span-2 text-charcoal">
              {specifications.cushionFill}
            </span>
          </div>
        )}

        {specifications?.warranty && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              Studio Guarantee
            </span>
            <span className="sm:col-span-2 text-charcoal font-medium">
              {specifications.warranty}
            </span>
          </div>
        )}

        {specifications?.assemblyRequired !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-forest" />
              Assembly Status
            </span>
            <span className="sm:col-span-2 text-charcoal">
              {specifications.assemblyRequired ? 'Assembly Required (Hardware Included)' : 'Delivered Fully Assembled'}
            </span>
          </div>
        )}

        {specifications?.careInstructions && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-ivory-subtle/40 transition-colors">
            <span className="text-taupe font-medium flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-forest" />
              Care & Maintenance
            </span>
            <span className="sm:col-span-2 text-charcoal-muted leading-relaxed">
              {specifications.careInstructions}
            </span>
          </div>
        )}
      </div>

      {/* Academic Demonstration Disclosure */}
      <div className="p-3 bg-ivory-subtle/80 border border-sand/50 rounded text-[11px] text-charcoal-muted leading-relaxed flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
        <span>
          <strong className="text-charcoal font-medium">Illustrative Academic Specifications:</strong> Structural joinery, metric proportions, and material compositions represent planned architectural standards for academic demonstration. Commercial manufacturing claims and warranties are prototype benchmarks.
        </span>
      </div>
    </div>
  );
}
