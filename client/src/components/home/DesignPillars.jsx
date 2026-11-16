import React from 'react';
import { Sliders, Layout, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';

export default function DesignPillars() {
  const pillars = [
    {
      icon: Sliders,
      tag: 'Mathematical Integrity',
      title: 'Additive Dynamic Pricing',
      description:
        'Every customization price is calculated deterministically: Base + Fabric + Finish + Size adjustments. Transparently quoted in Indian Rupees (₹) with zero hidden fees.',
      metric: 'Base starting at ₹28,000'
    },
    {
      icon: Layout,
      tag: 'Metric Space Planning',
      title: 'React-Managed 2D Floor Planner',
      description:
        'Design room layouts to scale with drag-and-drop architectural furniture blocks, collision bounds, and live project budget tracking directly in your browser.',
      metric: 'Proportional cm & m Canvas'
    },
    {
      icon: Sparkles,
      tag: 'Material Tactility',
      title: 'Authentic Textures & Swatches',
      description:
        'Tactile Belgian linens, rich bouclés, and solid hardwoods (White Oak, Smoked Walnut). Coordinated variant visuals rendered across all configurations.',
      metric: '18+ Tactile Textures'
    },
    {
      icon: ShieldCheck,
      tag: 'Interior Collaboration',
      title: 'Project Boards & Dual Advisory',
      description:
        'Save personalized custom variants into themed Design Boards. Request free architectural reviews with or without user registration.',
      metric: 'Open Guest & Account Access'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-taupe font-medium">
            Architectural Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-charcoal">
            Engineering Precision Meets Interior Craftsmanship
          </h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Four foundational pillars that elevate Décora from a conventional furniture catalog to an
            integrated spatial design studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="card-architectural p-6 flex flex-col justify-between hover:border-taupe/60 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded bg-ivory-subtle border border-sand/50 flex items-center justify-center text-forest">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-taupe font-semibold block">
                    {pillar.tag}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-charcoal leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-sand/30">
                  <span className="text-[11px] font-mono text-forest font-medium">
                    {pillar.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
