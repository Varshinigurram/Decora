import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import Button from '../common/Button';
import { HERO_ASSET } from '../../assets/furnitureMapping';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid: Editorial Typography Left, Architectural Canvas Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Typography Column (7 Cols on Wide Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-sand/60 rounded-full shadow-subtle text-xs uppercase tracking-widest text-taupe font-medium">
              <Compass className="w-3.5 h-3.5 text-forest" />
              <span>Architectural Interiors & Bespoke Furniture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-semibold text-charcoal leading-[1.12] tracking-tight">
              Spaces Designed with Intent. Furniture Built for Life.
            </h1>

            <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl font-normal">
              Décora unifies aesthetic room inspiration, bespoke material customization with
              transparent pricing in Indian Rupees (₹), and responsive 2D spatial floor planning into
              a seamless, self-service design experience.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/catalog">
                <Button variant="primary" size="lg" className="shadow-elevated">
                  Explore Catalog <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/customizer">
                <Button variant="secondary" size="lg">
                  <Sliders className="w-4 h-4 mr-1.5" />
                  Launch Configurator
                </Button>
              </Link>
            </div>

            {/* Quick Guarantees & Pillars */}
            <div className="pt-6 border-t border-sand/40 grid grid-cols-3 gap-4 text-xs text-charcoal-muted">
              <div>
                <span className="font-semibold text-charcoal block text-sm">Solid Hardwoods</span>
                <span>Crafted Oak, Walnut & Teak</span>
              </div>
              <div>
                <span className="font-semibold text-charcoal block text-sm">Additive Pricing</span>
                <span>Transparent Itemized Math in ₹</span>
              </div>
              <div>
                <span className="font-semibold text-charcoal block text-sm">Metric Planning</span>
                <span>To-Scale 2D Room Floorboards</span>
              </div>
            </div>
          </div>

          {/* Staged Visual Column (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded overflow-hidden border border-sand/50 shadow-elevated bg-white group">
              <img
                src={HERO_ASSET.image}
                alt={HERO_ASSET.alt}
                className="w-full h-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded border border-sand/40 text-xs flex justify-between items-center shadow-subtle">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
                    Featured Architectural Living
                  </span>
                  <span className="font-serif text-sm font-medium text-charcoal">
                    Komorebi Sanctuary Concept
                  </span>
                </div>
                <Link
                  to="/inspiration/komorebi-living"
                  className="text-forest hover:text-forest-dark font-medium text-xs flex items-center gap-1"
                >
                  View Lookbook →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
