import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../catalog/ProductCard';
import Button from '../common/Button';
import { FEATURED_PRODUCTS } from '../../assets/furnitureMapping';

export default function FeaturedCollection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlistIds, setWishlistIds] = useState(new Set(['chair-komorebi']));

  const categories = ['All', 'Seating', 'Tables', 'Storage', 'Beds'];

  const filteredProducts =
    activeCategory === 'All'
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === activeCategory);

  const handleToggleWishlist = (productId) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  return (
    <section className="py-14 sm:py-20 border-t border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-taupe font-medium">
              Signature Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal">
              Iconic Pieces & Configurable Designs
            </h2>
            <p className="text-sm text-charcoal-muted max-w-xl">
              Handcrafted furniture built from solid hardwoods, tactile bouclés, and Belgian linens.
              All pricing transparently computed in Indian Rupees (₹).
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-sand/40 pb-2 md:border-none md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-all ${
                  activeCategory === cat
                    ? 'bg-forest text-ivory shadow-subtle'
                    : 'bg-white text-charcoal-muted border border-sand/40 hover:text-charcoal hover:bg-ivory-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (4:5 portrait) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>

        {/* View Full Catalog CTA Strip */}
        <div className="text-center pt-4">
          <Link to="/catalog">
            <Button variant="secondary" size="lg">
              Explore Complete Collection (16 Pieces) <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
