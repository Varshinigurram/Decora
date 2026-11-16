import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sliders, Check, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '../common/Button';
import PriceDisplay from '../common/PriceDisplay';
import { CUSTOMIZER_PREVIEW } from '../../assets/furnitureMapping';

export default function CustomizerPromo() {
  const [selectedFabric, setSelectedFabric] = useState(CUSTOMIZER_PREVIEW.fabrics[0]);
  const [selectedFinish, setSelectedFinish] = useState(CUSTOMIZER_PREVIEW.finishes[0]);
  const [isGrandScale, setIsGrandScale] = useState(false);

  const basePrice = CUSTOMIZER_PREVIEW.piece.basePrice;
  const sizeDelta = isGrandScale ? 4000 : 0;
  const finalPrice = basePrice + selectedFabric.delta + selectedFinish.delta + sizeDelta;

  const handleReset = () => {
    setSelectedFabric(CUSTOMIZER_PREVIEW.fabrics[0]);
    setSelectedFinish(CUSTOMIZER_PREVIEW.finishes[0]);
    setIsGrandScale(false);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory border border-sand/60 rounded text-xs uppercase tracking-widest text-taupe font-medium">
            <Sliders className="w-3.5 h-3.5 text-forest" />
            <span>Interactive Customization Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-charcoal">
            Personalize Finishes. Calculate Live Pricing.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Unlike static catalogs, Décora lets you modify upholstery fabrics, timber finishes, and
            proportional scale with immediate visual feedback and honest, additive pricing in INR (₹).
          </p>
        </div>

        {/* Split Configurator Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-ivory rounded p-6 sm:p-10 border border-sand/40 shadow-subtle">
          {/* Left Visual Preview Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-white rounded overflow-hidden border border-sand/40 flex items-center justify-center p-6 shadow-subtle">
              {/* Dynamic Tint / Visual Indicator */}
              <div className="text-center space-y-4 max-w-md">
                <div
                  className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-elevated transition-colors duration-300 relative flex items-center justify-center"
                  style={{ backgroundColor: selectedFabric.colorHex }}
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: selectedFinish.colorHex }}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-taupe font-semibold block">
                    Komorebi Lounge Chair
                  </span>
                  <h4 className="font-serif text-2xl font-medium text-charcoal">
                    {selectedFabric.name} with {selectedFinish.name}
                  </h4>
                  <p className="text-xs text-charcoal-muted">
                    Scale: {isGrandScale ? 'Grand Scale (86 × 92 cm)' : 'Standard (78 × 84 cm)'}
                  </p>
                </div>

                <div className="inline-block px-3 py-1 bg-ivory border border-sand/40 rounded text-xs text-charcoal font-medium">
                  Dynamic Additive Formula Active
                </div>
              </div>

              {/* Reset Control */}
              <button
                type="button"
                onClick={handleReset}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-charcoal-muted hover:text-charcoal rounded text-xs border border-sand/40 flex items-center gap-1.5 shadow-subtle"
                title="Reset to Base Defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Right Control Tray & Price Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Fabric Swatches */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs uppercase tracking-wider text-charcoal font-semibold">
                  1. Upholstery Fabric
                </label>
                <span className="text-xs text-forest font-medium">
                  +{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedFabric.delta)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CUSTOMIZER_PREVIEW.fabrics.map((fab) => (
                  <button
                    key={fab.id}
                    type="button"
                    onClick={() => setSelectedFabric(fab)}
                    className={`p-2.5 rounded border text-left flex items-center gap-2.5 transition-all ${
                      selectedFabric.id === fab.id
                        ? 'border-forest bg-white ring-1 ring-forest shadow-subtle'
                        : 'border-sand/60 bg-white/60 hover:bg-white text-charcoal-muted'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-sand shrink-0"
                      style={{ backgroundColor: fab.colorHex }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-charcoal block truncate">
                        {fab.name}
                      </span>
                    </div>
                    {selectedFabric.id === fab.id && (
                      <Check className="w-3.5 h-3.5 text-forest shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Wood Finish Swatches */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs uppercase tracking-wider text-charcoal font-semibold">
                  2. Timber Frame Finish
                </label>
                <span className="text-xs text-forest font-medium">
                  +{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedFinish.delta)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CUSTOMIZER_PREVIEW.finishes.map((fin) => (
                  <button
                    key={fin.id}
                    type="button"
                    onClick={() => setSelectedFinish(fin)}
                    className={`p-2 rounded border text-center transition-all ${
                      selectedFinish.id === fin.id
                        ? 'border-forest bg-white ring-1 ring-forest shadow-subtle'
                        : 'border-sand/60 bg-white/60 hover:bg-white text-charcoal-muted'
                    }`}
                  >
                    <span
                      className="w-5 h-5 mx-auto rounded-full border border-sand block mb-1"
                      style={{ backgroundColor: fin.colorHex }}
                    />
                    <span className="text-[11px] font-medium text-charcoal block truncate">
                      {fin.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Size Toggle */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-charcoal font-semibold block">
                3. Dimension Scale
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsGrandScale(false)}
                  className={`py-2 px-3 rounded border text-xs text-center font-medium transition-all ${
                    !isGrandScale
                      ? 'border-forest bg-white ring-1 ring-forest text-charcoal'
                      : 'border-sand/60 bg-white/60 text-charcoal-muted'
                  }`}
                >
                  Standard (78 × 84 cm)
                </button>
                <button
                  type="button"
                  onClick={() => setIsGrandScale(true)}
                  className={`py-2 px-3 rounded border text-xs text-center font-medium transition-all ${
                    isGrandScale
                      ? 'border-forest bg-white ring-1 ring-forest text-charcoal'
                      : 'border-sand/60 bg-white/60 text-charcoal-muted'
                  }`}
                >
                  Grand Scale (+₹4,000)
                </button>
              </div>
            </div>

            {/* Live Additive Formula Card */}
            <div className="bg-white rounded p-4 border border-sand/50 space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-muted">
                <span>Base Chair (Natural Beech):</span>
                <PriceDisplay amount={basePrice} size="sm" />
              </div>
              <div className="flex justify-between text-forest font-medium">
                <span>Fabric ({selectedFabric.name}):</span>
                <PriceDisplay amount={selectedFabric.delta} isDelta size="sm" />
              </div>
              <div className="flex justify-between text-forest font-medium">
                <span>Timber ({selectedFinish.name}):</span>
                <PriceDisplay amount={selectedFinish.delta} isDelta size="sm" />
              </div>
              {isGrandScale && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Grand Dimension Surcharge:</span>
                  <PriceDisplay amount={sizeDelta} isDelta size="sm" />
                </div>
              )}
              <div className="pt-2 border-t border-sand/40 flex justify-between items-baseline font-semibold text-charcoal text-base">
                <span>Estimated Configuration:</span>
                <PriceDisplay amount={finalPrice} size="lg" className="text-charcoal font-bold" />
              </div>
            </div>

            {/* Launch CTA */}
            <Link to={`/customizer/${CUSTOMIZER_PREVIEW.piece.id}`} className="block">
              <Button variant="primary" size="lg" className="w-full">
                Launch Bespoke Configurator <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
