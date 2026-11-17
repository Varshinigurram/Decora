import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

export default function ProductGrid({
  products = [],
  onResetFilters,
  className = '',
}) {
  if (products.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="No Matching Designs Found"
          message="We could not find any handcrafted furniture pieces matching your active filter criteria. Try adjusting your material selection or expanding the price ceiling."
          actionLabel="Reset All Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
