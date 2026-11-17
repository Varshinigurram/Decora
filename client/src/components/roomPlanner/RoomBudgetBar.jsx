import React, { useState } from 'react';
import { RotateCcw, Sparkles, Check, Heart, HelpCircle } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import Button from '../common/Button';
import { useWishlist } from '../../context/WishlistContext';

export default function RoomBudgetBar({
  placedItems = [],
  onResetCanvas,
}) {
  const { addToWishlist } = useWishlist();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Pure dynamic sum of all currently placed furniture items
  const totalBudget = placedItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const itemCount = placedItems.length;

  const handleSaveAllToWishlist = () => {
    if (placedItems.length === 0) return;
    placedItems.forEach((item) => {
      if (item.productId) {
        addToWishlist(item.productId);
      }
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2800);
  };

  return (
    <div className="border-b border-sand/40 bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded card-architectural flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Editorial Header */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-taupe font-semibold">
            Interactive Floorplan Staging
          </span>
          <span className="px-2 py-0.2 bg-ivory-subtle border border-sand/50 rounded text-[10px] font-mono text-charcoal">
            {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'} Placed
          </span>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal">
          Spatial Room Planner
        </h2>
      </div>

      {/* Dynamic Budget Display & Actions */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
        {/* Estimated Room Budget Display */}
        <div className="text-left md:text-right">
          <div className="flex items-center gap-1 md:justify-end">
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-medium">
              Estimated Room Budget:
            </span>
            <span
              className="text-taupe hover:text-charcoal cursor-help"
              title="Sum of prices for all furniture pieces currently placed in the room. Excludes architectural installation & taxes."
            >
              <HelpCircle className="w-3 h-3" />
            </span>
          </div>
          <PriceDisplay
            amount={totalBudget}
            size="xl"
            className="text-forest font-serif font-bold text-2xl tracking-tight"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetCanvas}
            className="flex items-center gap-1.5 text-xs text-charcoal"
            title="Clear all furniture pieces and reset room budget to ₹0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-taupe" />
            <span>Reset Canvas</span>
          </Button>

          {itemCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAllToWishlist}
              className="flex items-center gap-1.5 text-xs"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest" />
                  <span>Plan Saved to Wishlist!</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5" />
                  <span>Save Plan to Wishlist</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
