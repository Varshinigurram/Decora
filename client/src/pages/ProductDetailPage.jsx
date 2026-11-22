import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Sliders,
  Layout,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  PackageOpen,
  FolderPlus,
  AlertTriangle,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import PriceDisplay from '../components/common/PriceDisplay';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProductGallery from '../components/catalog/ProductGallery';
import ProductSpecifications from '../components/catalog/ProductSpecifications';
import ProductCard from '../components/catalog/ProductCard';
import EmptyState from '../components/common/EmptyState';
import AddToBoardModal from '../components/designBoards/AddToBoardModal';
import productService from '../services/productService';
import { getRelatedProducts } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { calculateConfiguredPrice } from '../utils/pricingEngine';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Async Product API State
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  // Design Board Integration State
  const [isAddToBoardOpen, setIsAddToBoardOpen] = useState(false);
  const [isCustomizePromptOpen, setIsCustomizePromptOpen] = useState(false);
  const [boardItemPayload, setBoardItemPayload] = useState(null);

  // Fetch product from Product API by ID or Slug
  const fetchProduct = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setIsNotFound(false);
    setError(null);

    try {
      const result = await productService.getProductByIdOrSlug(id);
      const data = result?.product;
      if (!data) {
        setIsNotFound(true);
        setProduct(null);
        setRelatedProducts([]);
      } else {
        setProduct(data);
        setIsFallback(Boolean(result.isFallback));

        // Resolve curated companion pieces
        const related = getRelatedProducts(data, 3);
        setRelatedProducts(related);
      }
    } catch (err) {
      if (err?.statusCode === 404 || err?.isNotFound || err?.response?.status === 404) {
        setIsNotFound(true);
        setProduct(null);
      } else {
        setError(err?.message || 'Unable to load product details from the studio service.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProduct]);

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-pulse">
        <div className="h-4 bg-sand/30 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 aspect-[4/3] bg-sand/20 rounded border border-sand/40" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-sand/30 rounded w-32" />
            <div className="h-8 bg-sand/40 rounded w-3/4" />
            <div className="h-24 bg-sand/20 rounded border border-sand/30" />
            <div className="h-16 bg-sand/20 rounded" />
            <div className="h-12 bg-sand/30 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Product Not Found (404)
  if (isNotFound || (!product && !error)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Product Not Found"
          message={`We could not locate any furniture piece matching "${id}". The design may have been archived or the link might be incorrect.`}
          actionLabel="Return to Furniture Catalog"
          onAction={() => navigate('/catalog')}
          icon={PackageOpen}
        />
      </div>
    );
  }

  // 3. Network or Server Error State
  if (error && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-accent-error/10 text-accent-error mb-2">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal">
          Error Loading Design Details
        </h2>
        <p className="text-sm text-charcoal-muted max-w-md mx-auto">
          {error}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={fetchProduct}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/catalog')}
          >
            Browse Catalog
          </Button>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Standard snapshot creator for non-customizable products or baseline specification
  const handleOpenAddToBoardStandard = () => {
    let selectedOptions = { fabric: null, finish: null, size: null };
    let configuration = { fabricId: null, finishId: null, sizeId: null };

    if (product.customizable && product.customizationOptions) {
      const { fabrics = [], finishes = [], sizes = [] } = product.customizationOptions;
      const defaultFabric = fabrics.find((f) => f.delta === 0) || fabrics[0] || null;
      const defaultFinish = finishes.find((f) => f.delta === 0) || finishes[0] || null;
      const defaultSize = sizes.find((s) => s.delta === 0) || sizes[0] || null;

      configuration = {
        fabricId: defaultFabric?.id || null,
        finishId: defaultFinish?.id || null,
        sizeId: defaultSize?.id || null,
      };

      selectedOptions = {
        fabric: defaultFabric,
        finish: defaultFinish,
        size: defaultSize,
      };
    }

    // Verify baseline price using pricingEngine
    const pricing = calculateConfiguredPrice(product, configuration);
    const unitPrice = pricing?.finalPrice || product.basePrice || product.price || 0;

    const snapshot = {
      boardItemId: `bitem-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      productId: product.id,
      productSlug: product.slug || product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      quantity: 1,
      unitPrice,
      isCustomized: false,
      configuration,
      selectedOptions,
      dimensions: product.dimensions || null,
      addedAt: new Date().toISOString(),
    };

    setBoardItemPayload(snapshot);
    setIsAddToBoardOpen(true);
  };

  const handleAddToBoardClick = () => {
    if (product.customizable) {
      setIsCustomizePromptOpen(true);
    } else {
      handleOpenAddToBoardStandard();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Catalog', path: '/catalog' },
          { label: product.category, path: `/catalog?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      {/* Offline Fallback Banner */}
      {isFallback && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Operating in <strong>offline fallback mode</strong>. Displaying cached specifications.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
            Local Fallback
          </span>
        </div>
      )}

      {/* 2. Main Staged PDP Grid: Gallery Left (Sticky), Actions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-28">
          <ProductGallery
            images={product.gallery}
            fallback={product.fallback}
            productName={product.name}
          />
        </div>

        {/* Right Column: Information, Pricing & Conversion (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
                {product.category}
              </span>
              <span className="text-sand select-none">•</span>
              <span className="text-xs uppercase tracking-widest text-taupe font-medium">
                {product.style} Aesthetic
              </span>
              {product.tag && (
                <Badge variant="taupe" size="xs">
                  {product.tag}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Stock Status */}
          <div className="p-4 bg-white border border-sand/50 rounded shadow-subtle space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-charcoal-muted block">
                  {product.customizable ? 'Starting Base Price' : 'Direct Studio Price'}
                </span>
                <PriceDisplay amount={product.basePrice} size="xl" className="font-semibold" />
              </div>

              {product.inStock ? (
                <div className="text-right">
                  <Badge variant="forest" size="sm">
                    In Stock
                  </Badge>
                  {product.stockCount && (
                    <span className="block text-[10px] text-forest font-mono mt-1">
                      Demo stock: {product.stockCount} units
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  <Badge variant="warning" size="sm">
                    Made to Order
                  </Badge>
                  <span className="block text-[10px] text-charcoal-muted mt-1">
                    Demo crafting lead time: 3–4 weeks
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-charcoal-muted border-t border-sand/30 pt-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-forest shrink-0" />
              <span>Complimentary insured architectural freight across India.</span>
            </p>
          </div>

          {/* Description & Editorial Note */}
          <div className="space-y-3 text-sm text-charcoal-muted leading-relaxed">
            <p>{product.description}</p>
            {product.editorialNote && (
              <blockquote className="p-3 bg-ivory-subtle border-l-2 border-taupe text-xs italic text-charcoal font-serif">
                "{product.editorialNote}"
              </blockquote>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            {product.customizable ? (
              <Link to={`/customizer/${product.id}`} className="block">
                <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 shadow-elevated">
                  <Sliders className="w-4 h-4" />
                  <span>Customize Materials & Finishes</span>
                </Button>
              </Link>
            ) : null}

            {/* Add to Design Board Action */}
            <Button
              variant={product.customizable ? 'secondary' : 'primary'}
              size={product.customizable ? 'md' : 'lg'}
              className="w-full flex items-center justify-center gap-2"
              onClick={handleAddToBoardClick}
            >
              <FolderPlus className="w-4 h-4 text-forest" />
              <span>Add to Design Board</span>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`w-full py-3 px-4 rounded border text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? 'bg-ivory-subtle border-accent-error text-accent-error shadow-subtle'
                    : 'bg-white border-sand/60 text-charcoal hover:bg-ivory-subtle hover:border-sand'
                }`}
                aria-pressed={isWishlisted}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-accent-error text-accent-error' : 'text-charcoal-muted'
                  }`}
                />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              {/* Room Planner Launch */}
              <Link to="/room-planner" className="w-full">
                <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-forest" />
                  <span>Place in Planner</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Studio Guarantees Banner */}
          <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-charcoal-muted border-t border-sand/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
              <span>5-Year Frame Benchmark (Demonstration)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-forest shrink-0" />
              <span>14-Day Return Assurance (Planned)</span>
            </div>
          </div>

          {/* Supported Customization Options Teaser (Eligible Products Only) */}
          {product.customizable && product.customizationOptions && (
            <div className="p-4 bg-ivory-subtle border border-sand/60 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-taupe font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-forest" />
                  Customization Ready
                </span>
                <span className="text-[11px] font-mono text-forest">
                  Additive Pricing
                </span>
              </div>
              <p className="text-xs text-charcoal-muted">
                Available in {product.customizationOptions.fabrics?.length || 0} upholstery textiles,{' '}
                {product.customizationOptions.finishes?.length || 0} solid wood finishes, and tailored dimensions.
              </p>
              <div className="flex gap-2 pt-1">
                {product.customizationOptions.finishes?.map((fin) => (
                  <span
                    key={fin.id}
                    className="w-5 h-5 rounded-full border border-sand shadow-xs inline-block"
                    style={{ backgroundColor: fin.colorHex }}
                    title={fin.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Product Architectural Specifications */}
      <ProductSpecifications product={product} />

      {/* 4. Related Products Grid ("Complete the Look") */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 sm:pt-16 border-t border-sand/40 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
                Curated Companions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-charcoal">
                Complete the Look
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl">
                Harmonious designs curated by our interior architects to complement the materials and proportions of the {product.name}.
              </p>
            </div>

            <Link
              to={`/catalog?room=${product.roomType}`}
              className="text-xs font-medium text-forest hover:text-forest-dark flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore more {product.roomType} pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Customizable Guidance Recommendation Modal */}
      <Modal
        isOpen={isCustomizePromptOpen}
        onClose={() => setIsCustomizePromptOpen(false)}
        title="Customization Recommended"
        subtitle="Bespoke Design Studio"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-charcoal-muted leading-relaxed">
            <strong className="text-charcoal">{product.name}</strong> is an architectural piece that supports bespoke fabrics, finishes, and tailoring.
          </p>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            We recommend configuring your specifications in the Bespoke Customizer first so your design board captures your exact fabric, wood finish, and tailored dimensions.
          </p>

          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 shadow-subtle"
              onClick={() => {
                setIsCustomizePromptOpen(false);
                navigate(`/customizer/${product.id}`);
              }}
            >
              <Sliders className="w-4 h-4" />
              <span>Configure in Customizer</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setIsCustomizePromptOpen(false);
                handleOpenAddToBoardStandard();
              }}
            >
              Add Standard Specification As-Is
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add To Design Board Modal */}
      <AddToBoardModal
        isOpen={isAddToBoardOpen}
        onClose={() => setIsAddToBoardOpen(false)}
        itemPayload={boardItemPayload}
        product={product}
      />
    </div>
  );
}
