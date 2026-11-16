import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sliders, Layout, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import PriceDisplay from '../components/common/PriceDisplay';

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Editorial Hero Shell */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-sand/40 rounded p-8 sm:p-14 shadow-subtle space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory-subtle border border-sand/60 rounded text-xs uppercase tracking-widest text-taupe font-medium">
            <Compass className="w-3.5 h-3.5 text-forest" />
            Architectural Interiors & Bespoke Furniture
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-charcoal leading-tight">
            Spaces Designed with Intent. Furniture Built for Life.
          </h1>
          <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl">
            A connected interior design platform bridging aesthetic inspiration, genuine material
            customization with transparent pricing in Indian Rupees (₹), and spatial 2D room planning.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/catalog">
              <Button variant="primary" size="lg">
                Explore Catalog <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/customizer">
              <Button variant="secondary" size="lg">
                Launch Configurator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-architectural p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-ivory-subtle flex items-center justify-center text-forest">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-charcoal">
              Additive Dynamic Pricing
            </h3>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Transparent price formulas computed in real time. Example baseline starting at{' '}
              <PriceDisplay amount={28000} size="md" /> with customizable upholstery and solid oak finishes.
            </p>
          </div>

          <div className="card-architectural p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-ivory-subtle flex items-center justify-center text-forest">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-charcoal">
              React-Managed SVG 2D Planner
            </h3>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Proportional metric floor planning with drag-and-drop architectural furniture blocks and
              live room budget tracking.
            </p>
          </div>

          <div className="card-architectural p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-ivory-subtle flex items-center justify-center text-forest">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-charcoal">
              Thematic Design Boards
            </h3>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Curate room makeovers with preserved custom variant snapshots, aggregated design budgets,
              and dual consultation requests.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
