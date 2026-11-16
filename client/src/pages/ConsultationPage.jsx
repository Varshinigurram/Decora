import React from 'react';
import Button from '../components/common/Button';

export default function ConsultationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-taupe font-medium">
          Interior Architecture Advisory
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal">
          Request a Design Consultation
        </h1>
        <p className="text-sm text-charcoal-muted max-w-lg mx-auto">
          Collaborate with our interior architects. Open to both unauthenticated guests and registered customers.
          Full multi-step wizard active in Day 12.
        </p>
      </div>

      <div className="bg-white border border-sand/40 rounded p-8 sm:p-10 space-y-6 shadow-subtle">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Full Name:</label>
            <input type="text" placeholder="e.g. Varsha Sharma" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Email Address:</label>
            <input type="email" placeholder="e.g. varsha@example.com" className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-taupe mb-1">Room Type:</label>
          <select className="w-full px-3.5 py-2.5 border border-sand rounded bg-white text-sm text-charcoal">
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Dining Room</option>
            <option>Home Office / Study</option>
            <option>Full Home</option>
          </select>
        </div>

        <Button variant="primary" size="lg" className="w-full">
          Submit Consultation Inquiry
        </Button>
      </div>
    </div>
  );
}
