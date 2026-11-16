import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ivory border-t border-sand/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Manifesto */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif text-2xl font-semibold tracking-wider text-charcoal">
              DÉCORA
            </span>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              An architectural interior design and furniture customization platform. Connecting
              inspiration, bespoke material selection, transparent pricing, and spatial room planning.
            </p>
            <p className="text-xs text-taupe font-medium uppercase tracking-wider">
              Studio & Workshop • All India
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-charcoal">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-muted">
              <li>
                <Link to="/catalog" className="hover:text-forest transition-colors">
                  Furniture Catalog
                </Link>
              </li>
              <li>
                <Link to="/customizer" className="hover:text-forest transition-colors">
                  Configurator
                </Link>
              </li>
              <li>
                <Link to="/inspiration" className="hover:text-forest transition-colors">
                  Interior Inspiration
                </Link>
              </li>
              <li>
                <Link to="/room-planner" className="hover:text-forest transition-colors">
                  2D Room Planner
                </Link>
              </li>
              <li>
                <Link to="/boards" className="hover:text-forest transition-colors">
                  My Design Boards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Curated Design Styles */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-charcoal">
              Interior Styles
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-muted">
              <li>
                <span className="hover:text-forest cursor-pointer transition-colors">
                  Japandi Warmth
                </span>
              </li>
              <li>
                <span className="hover:text-forest cursor-pointer transition-colors">
                  Nordic Minimalist
                </span>
              </li>
              <li>
                <span className="hover:text-forest cursor-pointer transition-colors">
                  Mid-Century Modern
                </span>
              </li>
              <li>
                <span className="hover:text-forest cursor-pointer transition-colors">
                  Architectural Loft
                </span>
              </li>
              <li>
                <Link to="/consultation" className="text-forest font-medium hover:underline">
                  Book Custom Consultation →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Disclosures */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-charcoal">
              Academic Project
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Subject: <strong>Frontend Web Development</strong> (Term II). Built with React, Vite,
              Tailwind CSS, and Node.js REST architecture.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-taupe font-medium">
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/40 rounded">React 18</span>
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/40 rounded">Tailwind v3</span>
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/40 rounded">Vite</span>
              <span className="px-2 py-0.5 bg-ivory-subtle border border-sand/40 rounded">INR (₹)</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-8 border-t border-sand/40 flex flex-col sm:flex-row justify-between items-center text-xs text-charcoal-muted gap-4">
          <p>© {new Date().getFullYear()} Décora Studio. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/admin" className="hover:text-charcoal transition-colors">
              Admin Portal
            </Link>
            <span className="hover:text-charcoal cursor-pointer">Privacy Policy</span>
            <span className="hover:text-charcoal cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
