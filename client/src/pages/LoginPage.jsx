import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-serif text-3xl font-semibold tracking-wider text-charcoal">
          DÉCORA
        </span>
        <h1 className="text-2xl font-serif font-medium text-charcoal">
          Welcome Back
        </h1>
        <p className="text-xs text-charcoal-muted">
          Sign in to access your saved customizations, boards, and wishlist.
        </p>
      </div>

      <div className="bg-white border border-sand/40 rounded p-8 space-y-5 shadow-subtle">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Email Address:</label>
            <input type="email" placeholder="user@example.com" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Password:</label>
            <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
        </div>

        <Button variant="primary" size="md" className="w-full">
          Sign In
        </Button>

        <p className="text-center text-xs text-charcoal-muted pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
