import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CatalogFilters from '../components/catalog/CatalogFilters';
import CatalogSort from '../components/catalog/CatalogSort';
import ProductGrid from '../components/catalog/ProductGrid';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';
import {
  getAllProducts,
  getUniqueCategories,
  getUniqueRoomTypes,
  getUniqueMaterials,
  getPriceBounds,
} from '../data/products';

const ITEMS_PER_PAGE = 6;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const allProducts = useMemo(() => getAllProducts(), []);
  const roomOptions = useMemo(() => getUniqueRoomTypes(), []);
  const categoryOptions = useMemo(() => getUniqueCategories(), []);
  const materialOptions = useMemo(() => getUniqueMaterials(), []);
  const priceBounds = useMemo(() => getPriceBounds(), []);

  // 1. Read Filter State from URL Query Parameters
  const searchQuery = searchParams.get('q') || '';
  const selectedRoom = searchParams.get('room') || 'all';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedMaterials = useMemo(() => {
    const raw = searchParams.get('material');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const rawMaxPrice = searchParams.get('maxPrice');
  const priceRange = rawMaxPrice ? Number(rawMaxPrice) : priceBounds.max;
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

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

  const handlePriceChange = (maxPrice) => {
    updateParams({ maxPrice: maxPrice >= priceBounds.max ? null : maxPrice });
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

  // 2. Centralized Filtering Engine
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search matching (name, description, style, primaryMaterial, materials)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesStyle = product.style?.toLowerCase().includes(query);
        const matchesMaterial = product.materials?.some((m) =>
          m.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesStyle && !matchesMaterial) {
          return false;
        }
      }

      // Room matching
      if (selectedRoom !== 'all') {
        if (product.roomType !== selectedRoom) {
          return false;
        }
      }

      // Category matching
      if (selectedCategory !== 'All') {
        if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Materials matching (must match at least one selected material)
      if (selectedMaterials.length > 0) {
        const hasMaterial = product.materials?.some((m) =>
          selectedMaterials.includes(m)
        );
        if (!hasMaterial) {
          return false;
        }
      }

      // Price ceiling matching
      if (product.basePrice > priceRange) {
        return false;
      }

      // In stock only matching
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [
    allProducts,
    searchQuery,
    selectedRoom,
    selectedCategory,
    selectedMaterials,
    priceRange,
    inStockOnly,
  ]);

  // 3. Centralized Sorting Engine
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.basePrice - b.basePrice);
      case 'price-desc':
        return list.sort((a, b) => b.basePrice - a.basePrice);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        // Featured items first, then stable alphabetical
        return list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
    }
  }, [filteredProducts, sortBy]);

  // 4. Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // Active filters metrics
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedRoom !== 'all' ||
    selectedCategory !== 'All' ||
    selectedMaterials.length > 0 ||
    priceRange < priceBounds.max ||
    inStockOnly;

  const activeFilterCount = [
    Boolean(searchQuery),
    selectedRoom !== 'all',
    selectedCategory !== 'All',
    selectedMaterials.length > 0,
    priceRange < priceBounds.max,
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
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
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
                    priceRange={priceRange}
                    onPriceChange={handlePriceChange}
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
                  View {sortedProducts.length} Results
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
            totalCount={sortedProducts.length}
          />

          {/* Product Grid */}
          <ProductGrid
            products={paginatedProducts}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={sortedProducts.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </div>
    </div>
  );
}
