import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Button from '../components/common/Button';

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-4">
        <span className="text-xs uppercase tracking-widest text-taupe font-medium">
          Personal Favorites
        </span>
        <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
          My Saved Items
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Quick-saved catalog pieces for fast comparison and availability tracking. (Distinct from Design Boards).
        </p>
      </div>

      <div className="bg-white border border-sand/40 rounded p-12 text-center space-y-4 shadow-subtle max-w-xl mx-auto">
        <div className="w-12 h-12 bg-ivory-subtle text-taupe rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl text-charcoal">Your wishlist is currently empty</h3>
        <p className="text-sm text-charcoal-muted">
          Browse the catalog and click the heart icon on any piece to save your favorite designs.
        </p>
        <Link to="/catalog">
          <Button variant="primary" size="md">
            Explore Furniture Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
