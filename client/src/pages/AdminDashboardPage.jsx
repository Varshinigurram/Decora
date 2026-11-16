import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sand/40 pb-4 flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-taupe font-medium">
            Administrative Control Panel
          </span>
          <h1 className="text-3xl font-serif font-semibold text-charcoal mt-1">
            Admin Dashboard
          </h1>
        </div>
        <Link to="/">
          <Button variant="secondary" size="sm">
            Back to Public Site
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-architectural p-6">
          <span className="text-xs uppercase tracking-wider text-taupe block font-medium">Total Products</span>
          <span className="text-3xl font-serif font-semibold text-charcoal mt-1 block">34</span>
          <span className="text-xs text-charcoal-muted mt-1 block">Handcrafted pieces cataloged</span>
        </div>
        <div className="card-architectural p-6">
          <span className="text-xs uppercase tracking-wider text-taupe block font-medium">Pending Consultations</span>
          <span className="text-3xl font-serif font-semibold text-forest mt-1 block">8</span>
          <span className="text-xs text-charcoal-muted mt-1 block">Inquiries requiring review</span>
        </div>
        <div className="card-architectural p-6">
          <span className="text-xs uppercase tracking-wider text-taupe block font-medium">Registered Accounts</span>
          <span className="text-3xl font-serif font-semibold text-charcoal mt-1 block">142</span>
          <span className="text-xs text-charcoal-muted mt-1 block">Active customer profiles</span>
        </div>
      </div>

      <div className="bg-white border border-sand/40 rounded p-6 shadow-subtle text-sm text-charcoal-muted">
        Full administrative CRUD controls and consultation status pipeline scheduled for Day 13.
      </div>
    </div>
  );
}
