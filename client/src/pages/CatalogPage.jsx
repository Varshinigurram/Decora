import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CatalogFilters from '../components/catalog/CatalogFilters';
import CatalogSort from '../components/catalog/CatalogSort';
import ProductGrid from '../components/catalog/ProductGrid';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import productService from '../services/productService';
import {
  getUniqueCategories,
  getUniqueRoomTypes,
  getUniqueMaterials,
  getPriceBounds,
} from '../data/products';

const ITEMS_PER_PAGE = 6;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Dynamic state from Product API
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [filterMeta, setFilterMeta] = useState(null);

  // Static fallback options for instantaneous initial render
  const initialRoomOptions = useMemo(() => getUniqueRoomTypes(), []);
  const initialCategoryOptions = useMemo(() => getUniqueCategories(), []);
  const initialMaterialOptions = useMemo(() => getUniqueMaterials(), []);
  const initialPriceBounds = useMemo(() => getPriceBounds(), []);

  // Compute active bounds
  const priceBounds = useMemo(() => {
    if (filterMeta?.priceRange) {
      return {
        min: filterMeta.priceRange.min,
        max: filterMeta.priceRange.max,
      };
    }
    return initialPriceBounds;
  }, [filterMeta, initialPriceBounds]);

  const categoryOptions = useMemo(() => {
    if (filterMeta?.categories && filterMeta.categories.length > 0) {
      return ['All', ...filterMeta.categories];
    }
    return initialCategoryOptions;
  }, [filterMeta, initialCategoryOptions]);

  const roomOptions = useMemo(() => {
    return initialRoomOptions;
  }, [initialRoomOptions]);

  const materialOptions = useMemo(() => {
    return initialMaterialOptions;
  }, [initialMaterialOptions]);

  // 1. Read Filter State from URL Query Parameters
  const searchQuery = searchParams.get('q') || '';
  const selectedRoom = searchParams.get('room') || 'all';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedMaterials = useMemo(() => {
    const raw = searchParams.get('material');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const rawMinPrice = searchParams.get('minPrice');
  const rawMaxPrice = searchParams.get('maxPrice');
  const minPrice = rawMinPrice ? Math.max(priceBounds.min, Number(rawMinPrice)) : priceBounds.min;
  const maxPrice = rawMaxPrice ? Math.min(priceBounds.max, Number(rawMaxPrice)) : priceBounds.max;

  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

  // Fetch filter metadata once on mount
  useEffect(() => {
    let isMounted = true;
    productService
      .getFilterMetadata()
      .then((meta) => {
        if (isMounted && meta) {
          setFilterMeta(meta);
        }
      })
      .catch((err) => {
        // Non-blocking: will retain static fallback options
        console.warn('Could not load dynamic filter metadata; using static defaults:', err?.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch products whenever search params change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: sortBy,
      };

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (selectedRoom && selectedRoom !== 'all') {
        params.room = selectedRoom;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (rawMinPrice) {
        params.minPrice = Number(rawMinPrice);
      }
      if (rawMaxPrice) {
        params.maxPrice = Number(rawMaxPrice);
      }
      if (inStockOnly) {
        params.inStock = true;
      }
      if (selectedMaterials.length > 0) {
        params.material = selectedMaterials.join(',');
      }

      const result = await productService.getProducts(params);
      setProducts(result.products || []);
      setPagination(
        result.pagination || {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          total: result.products?.length || 0,
          pages: Math.ceil((result.products?.length || 0) / ITEMS_PER_PAGE) || 1,
        }
      );
      setIsFallback(Boolean(result.isFallback));
    } catch (err) {
      console.error('Error fetching catalog products:', err);
      setError(err?.message || 'Unable to connect to the furniture catalog service.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    sortBy,
    selectedCategory,
    selectedRoom,
    searchQuery,
    rawMinPrice,
    rawMaxPrice,
    inStockOnly,
    selectedMaterials,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Helper to update search params while resetting page to 1 on filter changes
  const updateParams = (updates, resetPage = true) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '' || val === 'all' || val === 'All' || val === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(val));
      }
    });

    if (resetPage) {
      newParams.delete('page');
    }

    setSearchParams(newParams, { replace: false });
  };

  // Handlers for individual filter changes
  const handleSearchChange = (q) => updateParams({ q });
  const handleRoomChange = (room) => updateParams({ room });
  const handleCategoryChange = (category) => updateParams({ category });

  const handleMaterialToggle = (material) => {
    const nextMaterials = selectedMaterials.includes(material)
      ? selectedMaterials.filter((m) => m !== material)
      : [...selectedMaterials, material];
    updateParams({ material: nextMaterials.length > 0 ? nextMaterials.join(',') : null });
  };

  const handlePriceRangeChange = (newMin, newMax) => {
    const safeMin = Math.max(priceBounds.min, Math.min(newMin, newMax));
    const safeMax = Math.min(priceBounds.max, Math.max(newMin, newMax));

    updateParams({
      minPrice: safeMin > priceBounds.min ? safeMin : null,
      maxPrice: safeMax < priceBounds.max ? safeMax : null,
    });
  };

  const handleInStockToggle = (inStock) => updateParams({ inStock });
  const handleSortChange = (sort) => updateParams({ sort }, false);
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page <= 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', String(page));
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: false });
  };

  // Active filters metrics
  const isPriceFiltered = minPrice > priceBounds.min || maxPrice < priceBounds.max;
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedRoom !== 'all' ||
    selectedCategory !== 'All' ||
    selectedMaterials.length > 0 ||
    isPriceFiltered ||
    inStockOnly;

  const activeFilterCount = [
    Boolean(searchQuery),
    selectedRoom !== 'all',
    selectedCategory !== 'All',
    selectedMaterials.length > 0,
    isPriceFiltered,
    inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Furniture Catalog', path: '/catalog' },
          ...(selectedCategory !== 'All' ? [{ label: selectedCategory }] : []),
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/40 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
            Architectural Collection
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-charcoal">
            The Furniture Catalog
          </h1>
          <p className="text-sm text-charcoal-muted leading-relaxed font-normal">
            Handcrafted minimalist and Japandi furniture built with solid oak, smoked walnut,
            tactile bouclé, and natural Belgian linen. Transparently priced in Indian Rupees (₹).
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-forest" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </Button>
        </div>
      </div>

      {/* Offline Fallback Banner */}
      {isFallback && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded flex items-center justify-between text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Operating in <strong>offline fallback mode</strong>. Displaying cached local catalog designs.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
            Local Fallback
          </span>
        </div>
      )}

      {/* Main 2-Column Catalog Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
        {/* Desktop Sidebar (1 Column) */}
        <div className="hidden lg:block lg:col-span-1 bg-white border border-sand/50 rounded p-6 shadow-subtle sticky top-28">
          <CatalogFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedRoom={selectedRoom}
            onRoomChange={handleRoomChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedMaterials={selectedMaterials}
            onMaterialToggle={handleMaterialToggle}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceRangeChange={handlePriceRangeChange}
            minCatalogPrice={priceBounds.min}
            maxCatalogPrice={priceBounds.max}
            inStockOnly={inStockOnly}
            onInStockToggle={handleInStockToggle}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            roomOptions={roomOptions}
            categoryOptions={categoryOptions}
            materialOptions={materialOptions}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFiltersOpen(false)}
            />

            {/* Slide-in Drawer */}
            <div className="relative ml-auto w-full max-w-sm bg-ivory h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-sand/40">
                  <span className="font-serif text-lg font-semibold text-charcoal">
                    Filter Collection
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1.5 text-charcoal-muted hover:text-charcoal"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-4">
                  <CatalogFilters
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    selectedRoom={selectedRoom}
                    onRoomChange={handleRoomChange}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    selectedMaterials={selectedMaterials}
                    onMaterialToggle={handleMaterialToggle}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceRangeChange={handlePriceRangeChange}
                    minCatalogPrice={priceBounds.min}
                    maxCatalogPrice={priceBounds.max}
                    inStockOnly={inStockOnly}
                    onInStockToggle={handleInStockToggle}
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                    activeFilterCount={activeFilterCount}
                    roomOptions={roomOptions}
                    categoryOptions={categoryOptions}
                    materialOptions={materialOptions}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-sand/40">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full"
                >
                  View {pagination.total} Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Product Grid Column (3 Columns on Wide) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <CatalogSort
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalCount={pagination.total}
          />

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-6 bg-white border border-accent-error/30 rounded text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-accent-error/10 text-accent-error">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Unable to Load Catalog
              </h3>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                {error}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchProducts}
                className="inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </Button>
            </div>
          )}

          {/* Loading Skeleton Grid */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <div
                  key={idx}
                  className="card-architectural bg-white animate-pulse overflow-hidden rounded border border-sand/40"
                >
                  <div className="aspect-[4/5] bg-sand/20" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-sand/30 rounded w-1/3" />
                    <div className="h-4 bg-sand/40 rounded w-3/4" />
                    <div className="h-4 bg-sand/30 rounded w-1/2 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loaded Product Grid */}
          {!isLoading && !error && (
            <ProductGrid
              products={products}
              onResetFilters={handleResetFilters}
            />
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
              totalItems={pagination.total}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>
    </div>
  );
}
