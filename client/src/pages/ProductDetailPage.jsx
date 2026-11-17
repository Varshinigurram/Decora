import React, { useMemo } from 'react';
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
} from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import PriceDisplay from '../components/common/PriceDisplay';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProductGallery from '../components/catalog/ProductGallery';
import ProductSpecifications from '../components/catalog/ProductSpecifications';
import ProductCard from '../components/catalog/ProductCard';
import EmptyState from '../components/common/EmptyState';
import { getProductByIdOrSlug, getRelatedProducts } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // 1. Resolve Product by ID or Slug
  const product = useMemo(() => getProductByIdOrSlug(id), [id]);

  // 2. Resolve Related Furniture Designs
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getRelatedProducts(product, 3);
  }, [product]);

  // Handle Invalid Product ID / Slug
  if (!product) {
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

  const isWishlisted = isInWishlist(product.id);

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
    </div>
  );
}
