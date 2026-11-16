import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <span className="font-serif text-7xl font-semibold text-taupe block">
        404
      </span>
      <h1 className="text-3xl font-serif font-semibold text-charcoal">
        This Space Does Not Exist
      </h1>
      <p className="text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto">
        The architectural page you are looking for has been moved, renamed, or is no longer part of our catalog.
      </p>
      <div className="pt-2 flex justify-center gap-4">
        <Link to="/catalog">
          <Button variant="primary" size="md">
            Explore Catalog
          </Button>
        </Link>
        <Link to="/">
          <Button variant="secondary" size="md">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
