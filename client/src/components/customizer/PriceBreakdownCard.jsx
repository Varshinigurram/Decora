import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, RotateCcw, Check, Sparkles, Compass, AlertCircle } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Button from '../common/Button';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR } from '../../utils/formatters';

export default function PriceBreakdownCard({
  product,
  pricingResult,
  onReset,
  isDirty = false,
}) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, addToWishlist } = useWishlist();
  const [savedFeedback, setSavedFeedback] = useState(false);

  const inWishlist = product ? isInWishlist(product.id) : false;

  const basePrice = pricingResult?.basePrice ?? 0;
  const fabricDelta = pricingResult?.fabricAdjustment ?? pricingResult?.fabricDelta ?? 0;
  const finishDelta = pricingResult?.finishAdjustment ?? pricingResult?.finishDelta ?? 0;
  const sizeDelta = pricingResult?.sizeAdjustment ?? pricingResult?.sizeDelta ?? 0;
  const totalPrice = pricingResult?.finalPrice ?? pricingResult?.totalPrice ?? 0;
  const selectedFabric = pricingResult?.selectedOptions?.fabric || pricingResult?.selectedFabric;
  const selectedFinish = pricingResult?.selectedOptions?.finish || pricingResult?.selectedFinish;
  const selectedSize = pricingResult?.selectedOptions?.size || pricingResult?.selectedSize;
  const isValid = pricingResult?.isValid ?? true;
  const errors = pricingResult?.errors || [];

  const handleSaveConfiguration = () => {
    if (!product) return;
    addToWishlist(product.id);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
    }, 2800);
  };

  const handleNavigateRoomPlanner = () => {
    navigate('/room-planner', {
      state: {
        configuredProduct: {
          id: product?.id,
          name: product?.name,
          category: product?.category,
          dimensions: product?.dimensions,
          price: totalPrice,
          configuration: {
            fabric: selectedFabric?.name,
            finish: selectedFinish?.name,
            size: selectedSize?.name,
          },
        },
      },
    });
  };

  const formatDeltaRow = (label, option, delta) => {
    if (!option) return null;

    return (
      <div className="flex items-center justify-between py-1.5 text-xs border-b border-sand/30 last:border-0">
        <div className="flex flex-col pr-2">
          <span className="text-charcoal font-medium">{label}</span>
          <span className="text-[11px] text-charcoal-muted truncate max-w-[170px]">
            {option.name}
          </span>
        </div>
        <div className="text-right shrink-0">
          {delta === 0 ? (
            <span className="text-taupe text-[11px] font-medium">Included (Base)</span>
          ) : delta > 0 ? (
            <span className="text-forest font-medium font-mono">+{formatINR(delta)}</span>
          ) : (
            <span className="text-amber-800 font-medium font-mono">-{formatINR(Math.abs(delta))}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="card-architectural p-6 bg-white space-y-6">
      <div className="border-b border-sand/40 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold block">
            Pricing Engine
          </span>
          <h3 className="font-serif text-xl font-semibold text-charcoal">
            Bespoke Price Breakdown
          </h3>
        </div>
        {isDirty && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-taupe hover:text-forest transition-colors py-1 px-2 rounded hover:bg-ivory-subtle"
            title="Reset options to baseline defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Itemized Calculation Ledger */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs py-1.5 border-b border-sand/30">
          <span className="text-charcoal-muted">Base Specification:</span>
          <PriceDisplay amount={basePrice} size="sm" />
        </div>

        {selectedFabric && formatDeltaRow('Upholstery Fabric', selectedFabric, fabricDelta)}
        {selectedFinish && formatDeltaRow('Timber Finish', selectedFinish, finishDelta)}
        {selectedSize && formatDeltaRow('Architectural Scale', selectedSize, sizeDelta)}
      </div>

      {/* Validation alert if invalid */}
      {!isValid && errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-medium">Configuration Error:</span>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Final Estimated Price Banner */}
      <div className="bg-ivory-subtle border border-sand/50 rounded p-4 space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-charcoal-muted font-medium">
            Total Estimated Price:
          </span>
          <span className="text-[11px] text-taupe">Incl. of all taxes</span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <PriceDisplay amount={totalPrice} size="xl" className="text-charcoal font-serif font-bold text-2xl" />
          <span className="text-[11px] text-forest font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Made to Order
          </span>
        </div>
      </div>

      {/* Craftsmanship & Delivery Notice */}
      <p className="text-[11px] text-charcoal-muted leading-relaxed">
        Estimated lead time for bespoke configuration: <strong className="text-charcoal">3–4 weeks</strong>. Includes white-glove architectural delivery and assembly across India.
      </p>

      {/* CTAs */}
      <div className="space-y-2.5 pt-1">
        <Button
          variant={savedFeedback ? 'secondary' : 'primary'}
          size="md"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSaveConfiguration}
        >
          {savedFeedback ? (
            <>
              <Check className="w-4 h-4 text-forest" />
              <span>Configuration Saved!</span>
            </>
          ) : (
            <>
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-white' : ''}`} />
              <span>{inWishlist ? 'Update in Wishlist' : 'Save Configuration'}</span>
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="md"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleNavigateRoomPlanner}
        >
          <Compass className="w-4 h-4 text-forest" />
          <span>Place in Room Planner</span>
        </Button>
      </div>
    </div>
  );
}
