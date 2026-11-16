import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-serif text-3xl font-semibold tracking-wider text-charcoal">
          DÉCORA
        </span>
        <h1 className="text-2xl font-serif font-medium text-charcoal">
          Create Your Account
        </h1>
        <p className="text-xs text-charcoal-muted">
          Persist custom variants, create design boards, and plan your living spaces.
        </p>
      </div>

      <div className="bg-white border border-sand/40 rounded p-8 space-y-5 shadow-subtle">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Full Name:</label>
            <input type="text" placeholder="e.g. Varsha Sharma" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Email Address:</label>
            <input type="email" placeholder="user@example.com" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Password:</label>
            <input type="password" placeholder="At least 6 characters with 1 number" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
        </div>

        <Button variant="primary" size="md" className="w-full">
          Create Account
        </Button>

        <p className="text-center text-xs text-charcoal-muted pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-forest font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
