import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Layers, Sliders, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import ProductCard from '../components/catalog/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useWishlist } from '../context/WishlistContext';
import productService from '../services/productService';
import { PRODUCTS } from '../data/products';

export default function WishlistPage() {
  const {
    wishlistIds,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
    isLoading: isWishlistLoading,
  } = useWishlist();

  const [catalogProducts, setCatalogProducts] = useState(PRODUCTS);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fetch live products from backend to ensure latest pricing, images, and stock statuses
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setIsCatalogLoading(true);
        const res = await productService.getProducts({ limit: 48 });
        if (isMounted && res?.products && res.products.length > 0) {
          setCatalogProducts(res.products);
        }
      } catch (err) {
        // Fallback to static PRODUCTS is already preloaded in state
        console.warn('Failed to load remote products for wishlist, using local catalog:', err);
      } finally {
        if (isMounted) setIsCatalogLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Map of products indexed by both id and productId
  const productMap = useMemo(() => {
    const map = new Map();
    // 1. Initial baseline from local canonical catalog
    PRODUCTS.forEach((p) => {
      map.set(p.id, p);
      if (p.productId) map.set(p.productId, p);
    });
    // 2. Overlay live backend data
    catalogProducts.forEach((p) => {
      map.set(p.id, p);
      if (p.productId) map.set(p.productId, p);
    });
    return map;
  }, [catalogProducts]);

  // Resolve saved products preserving order
  const savedProducts = useMemo(() => {
    if (!wishlistIds || wishlistIds.size === 0) return [];
    const list = [];
    wishlistIds.forEach((id) => {
      const prod = productMap.get(id);
      if (prod) {
        list.push(prod);
      }
    });
    return list;
  }, [wishlistIds, productMap]);

  const handleClearAll = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Catalog', path: '/catalog' },
          { label: 'Wishlist' },
        ]}
      />

      {/* Page Header */}
      <div className="border-b border-sand/40 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-forest font-semibold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-forest" />
            Personal Curation
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal mt-1">
            My Saved Items
          </h1>
          <p className="text-sm text-charcoal-muted mt-2 max-w-2xl">
            Quick-saved catalog pieces for fast comparison, availability tracking, and space curation.
          </p>
        </div>

        {wishlistCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-taupe px-3 py-1.5 bg-ivory-subtle rounded border border-sand/40">
              {wishlistCount} {wishlistCount === 1 ? 'piece' : 'pieces'} saved
            </span>
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1 rounded">
                <span className="text-xs text-rose-700 font-medium">Remove all?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs text-taupe hover:text-charcoal ml-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="text-taupe hover:text-rose-600 flex items-center gap-1.5 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isWishlistLoading && savedProducts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-taupe font-medium">
            Loading your curated pieces...
          </p>
        </div>
      ) : savedProducts.length > 0 ? (
        <div className="space-y-12">
          {/* Responsive Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedProducts.map((product) => (
              <div key={product.id} className="relative flex flex-col">
                <ProductCard
                  product={product}
                  isWishlisted={true}
                  onToggleWishlist={() => removeFromWishlist(product.id)}
                />
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="mt-2 text-[11px] text-taupe hover:text-rose-600 self-center flex items-center gap-1 transition-colors py-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove from saved</span>
                </button>
              </div>
            ))}
          </div>

          {/* Action Callouts */}
          <div className="bg-sand-light/50 border border-sand/60 rounded p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-forest font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Next Step in Design
              </span>
              <h3 className="font-serif text-xl font-semibold text-charcoal">
                Ready to envision these pieces in your space?
              </h3>
              <p className="text-sm text-charcoal-muted max-w-xl">
                Organize your selected pieces into thematic Design Boards or arrange them inside the 2D Room Planner to check scale and layout.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/boards">
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Design Boards</span>
                </Button>
              </Link>
              <Link to="/room-planner">
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <span>Room Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-sand/40 rounded p-12 text-center space-y-6 shadow-subtle max-w-xl mx-auto my-8">
          <div className="w-14 h-14 bg-ivory-subtle text-taupe rounded-full flex items-center justify-center mx-auto border border-sand/40">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-semibold text-charcoal">
              Your wishlist is currently empty
            </h3>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Explore our architectural furniture collection and tap the heart icon on any piece to save it for immediate comparison, dimension reviews, and room layouts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/catalog">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                Explore Furniture Catalog
              </Button>
            </Link>
            <Link to="/customizer">
              <Button variant="secondary" size="md" className="w-full sm:w-auto flex items-center justify-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Customizer Studio</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
