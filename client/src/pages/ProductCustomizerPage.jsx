import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sliders, ExternalLink, Info, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SwatchSelector from '../components/customizer/SwatchSelector';
import PriceBreakdownCard from '../components/customizer/PriceBreakdownCard';
import productService from '../services/productService';
import { getDefaultConfiguration, calculateConfiguredPrice } from '../utils/pricingEngine';

export default function ProductCustomizerPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Async Product API State
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const [configuration, setConfiguration] = useState({ fabricId: null, finishId: null, sizeId: null });
  const [imgSrc, setImgSrc] = useState('/assets/placeholders/placeholder-product.svg');

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setIsNotFound(false);
    setError(null);

    try {
      const result = await productService.getProductByIdOrSlug(productId);
      const data = result?.product;
      if (!data || !data.customizable || !data.customizationOptions) {
        setIsNotFound(true);
        setProduct(null);
      } else {
        setProduct(data);
        const defaults = getDefaultConfiguration(data);
        setConfiguration(defaults);
        setImgSrc(data.image || '/assets/placeholders/placeholder-product.svg');
        setIsFallback(Boolean(result.isFallback));
      }
    } catch (err) {
      if (err?.statusCode === 404 || err?.isNotFound || err?.response?.status === 404) {
        setIsNotFound(true);
        setProduct(null);
      } else {
        setError(err?.message || 'Unable to connect to the customizer studio service.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProduct]);

  const defaultConfig = useMemo(() => {
    return product ? getDefaultConfiguration(product) : { fabricId: null, finishId: null, sizeId: null };
  }, [product]);

  const pricingResult = useMemo(() => {
    if (!product) return null;
    return calculateConfiguredPrice(product, configuration);
  }, [product, configuration]);

  const isDirty = useMemo(() => {
    if (!product || !configuration || !defaultConfig) return false;
    return (
      configuration.fabricId !== defaultConfig.fabricId ||
      configuration.finishId !== defaultConfig.finishId ||
      configuration.sizeId !== defaultConfig.sizeId
    );
  }, [configuration, defaultConfig, product]);

  const handleReset = () => {
    setConfiguration(defaultConfig);
  };

  const handleImageError = () => {
    setImgSrc(product?.fallback || '/assets/placeholders/placeholder-product.svg');
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-ivory min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-4 bg-sand/30 rounded w-48" />
        <div className="h-10 bg-sand/40 rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 aspect-[4/3] bg-sand/20 rounded border border-sand/40" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-48 bg-sand/20 rounded border border-sand/30" />
            <div className="h-64 bg-sand/20 rounded border border-sand/30" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Product Not Found or Not Customizable State
  if (isNotFound || (!product && !error)) {
    return (
      <div className="bg-ivory min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <EmptyState
          title="Customizer Not Available"
          message={`The requested piece "${productId || 'unknown'}" is either unavailable or does not currently support bespoke material customization.`}
          actionLabel="Browse Customizable Pieces"
          onAction={() => navigate('/customizer')}
        />
      </div>
    );
  }

  // 3. Error State
  if (error && !product) {
    return (
      <div className="bg-ivory min-h-screen py-20 px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-md mx-auto">
        <div className="inline-flex p-4 rounded-full bg-accent-error/10 text-accent-error mb-2">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal">
          Error Loading Customizer
        </h2>
        <p className="text-sm text-charcoal-muted">
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
            onClick={() => navigate('/customizer')}
          >
            All Customizable Pieces
          </Button>
        </div>
      </div>
    );
  }

  const { customizationOptions } = product;
  const fabrics = customizationOptions.fabrics || [];
  const finishes = customizationOptions.finishes || [];
  const sizes = customizationOptions.sizes || [];

  const selectedFabric = pricingResult?.selectedOptions?.fabric;
  const selectedFinish = pricingResult?.selectedOptions?.finish;
  const selectedSize = pricingResult?.selectedOptions?.size;

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Customization Studio', path: '/customizer' },
    { label: product.name },
  ];

  return (
    <div className="bg-ivory min-h-screen pb-24">
      {/* Sticky Top Breadcrumbs Navigation */}
      <div className="border-b border-sand/40 bg-white/60 backdrop-blur-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Breadcrumbs items={breadcrumbs} />
          <Link
            to="/customizer"
            className="text-xs text-taupe hover:text-forest transition-colors inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Customizable Pieces</span>
            <span className="sm:hidden">Studio</span>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Offline Fallback Banner */}
        {isFallback && (
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded flex items-center justify-between text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Operating in <strong>offline fallback mode</strong>. Displaying cached customizer options.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
              Local Fallback
            </span>
          </div>
        )}

        {/* Header Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand/40 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="forest" size="xs">
                Bespoke Atelier
              </Badge>
              <span className="text-xs uppercase tracking-wider text-taupe font-medium">
                {product.category} &bull; {product.style}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal">
              Configure {product.name}
            </h1>
            <p className="text-sm text-charcoal-muted max-w-2xl leading-relaxed">
              {product.description}
            </p>
          </div>

          <Link
            to={`/catalog/${product.slug || product.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-forest hover:text-forest-dark font-medium pb-1"
          >
            <span>View Full Specifications & PDP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Configurator Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Staged Architectural Product Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-architectural p-6 bg-white overflow-hidden space-y-4 shadow-subtle">
              {/* Product Visual Canvas */}
              <div className="relative aspect-[4/3] bg-ivory-subtle rounded border border-sand/40 overflow-hidden flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 ease-out"
                />

                {/* Floating Active Configuration Summary Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded border border-sand/50 shadow-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    {selectedFabric && (
                      <div className="flex items-center gap-1.5" title={`Fabric: ${selectedFabric.name}`}>
                        {selectedFabric.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-sand/70 shrink-0"
                            style={{ backgroundColor: selectedFabric.colorHex }}
                          />
                        )}
                        <span className="text-charcoal font-medium truncate max-w-[120px]">
                          {selectedFabric.name}
                        </span>
                      </div>
                    )}
                    {selectedFinish && (
                      <div className="flex items-center gap-1.5" title={`Finish: ${selectedFinish.name}`}>
                        {selectedFinish.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-sand/70 shrink-0"
                            style={{ backgroundColor: selectedFinish.colorHex }}
                          />
                        )}
                        <span className="text-charcoal font-medium truncate max-w-[120px]">
                          {selectedFinish.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedSize && (
                    <span className="px-2 py-0.5 bg-ivory border border-sand/50 rounded text-[11px] font-mono text-forest font-medium">
                      {selectedSize.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Architectural Dimensions & Technical Spec */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-ivory-subtle rounded border border-sand/40">
                  <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
                    Dimensions
                  </span>
                  <span className="text-charcoal font-mono mt-0.5 block">
                    {product.dimensions?.width} &times; {product.dimensions?.depth} &times; {product.dimensions?.height} {product.dimensions?.unit || 'cm'}
                  </span>
                </div>

                <div className="p-3 bg-ivory-subtle rounded border border-sand/40">
                  <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
                    Primary Material
                  </span>
                  <span className="text-charcoal mt-0.5 block truncate">
                    {product.material}
                  </span>
                </div>

                <div className="p-3 bg-ivory-subtle rounded border border-sand/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
                    Design Origin
                  </span>
                  <span className="text-charcoal mt-0.5 block">
                    {product.origin || 'Artisanal Studio'}
                  </span>
                </div>
              </div>

              {/* 2D Architectural Studio Disclosure */}
              <div className="p-3.5 bg-ivory-subtle/70 border border-sand/50 rounded flex items-start gap-2.5 text-[11px] text-charcoal-muted leading-relaxed">
                <Info className="w-4 h-4 text-taupe shrink-0 mt-0.5" />
                <p>
                  <strong className="text-charcoal">2D Architectural Studio Preview:</strong> Swatches represent authentic physical material samples and finishes. Physical swatch rings and timber finish samples can be dispatched via our design consultation service prior to final fabrication.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls & Dynamic Pricing Engine (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Material & Scale Selection Controls */}
            <div className="card-architectural p-6 bg-white space-y-6 shadow-subtle">
              <div className="flex items-center justify-between border-b border-sand/40 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-forest" />
                  <h3 className="font-serif text-xl font-semibold text-charcoal">
                    Material &amp; Scale Options
                  </h3>
                </div>
              </div>

              {/* 1. Upholstery Fabric Selection (Only if product has fabrics) */}
              {fabrics.length > 0 && (
                <div className="border-b border-sand/30 pb-6">
                  <SwatchSelector
                    title="1. Upholstery Textile"
                    subtitle="Select from tactile linen, bouclé, or saddle leather"
                    options={fabrics}
                    selectedId={configuration.fabricId}
                    onSelect={(id) => setConfiguration((prev) => ({ ...prev, fabricId: id }))}
                    type="fabric"
                  />
                </div>
              )}

              {/* 2. Timber Finish Selection (Only if product has finishes) */}
              {finishes.length > 0 && (
                <div className="border-b border-sand/30 pb-6">
                  <SwatchSelector
                    title={fabrics.length > 0 ? "2. Timber Finish" : "1. Timber Finish"}
                    subtitle="Artisanal hand-rubbed organic oil and wax finishes"
                    options={finishes}
                    selectedId={configuration.finishId}
                    onSelect={(id) => setConfiguration((prev) => ({ ...prev, finishId: id }))}
                    type="finish"
                  />
                </div>
              )}

              {/* 3. Architectural Size / Scale Selection */}
              {sizes.length > 0 && (
                <div>
                  <SwatchSelector
                    title={
                      fabrics.length > 0 && finishes.length > 0
                        ? "3. Architectural Proportion & Scale"
                        : fabrics.length > 0 || finishes.length > 0
                        ? "2. Architectural Proportion & Scale"
                        : "1. Architectural Proportion & Scale"
                    }
                    subtitle="Proportions engineered for intimate nooks or grand residences"
                    options={sizes}
                    selectedId={configuration.sizeId}
                    onSelect={(id) => setConfiguration((prev) => ({ ...prev, sizeId: id }))}
                    type="size"
                  />
                </div>
              )}
            </div>

            {/* Dynamic Additive Pricing Breakdown Ledger */}
            <PriceBreakdownCard
              product={product}
              pricingResult={pricingResult}
              onReset={handleReset}
              isDirty={isDirty}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
