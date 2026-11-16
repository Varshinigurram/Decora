import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function ConsultationCTA() {
  return (
    <section className="py-14 sm:py-20 border-t border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest text-ivory rounded p-8 sm:p-14 shadow-elevated relative overflow-hidden">
          {/* Subtle architectural vector accent */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
            <Compass className="w-96 h-96" />
          </div>

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded text-xs uppercase tracking-widest text-sand font-medium">
              <CalendarCheck className="w-3.5 h-3.5 text-sand" />
              <span>Interior Architecture Advisory</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-ivory leading-tight">
              Planning a Complete Room Transformation?
            </h2>

            <p className="text-sm sm:text-base text-sand/90 leading-relaxed font-normal">
              Collaborate directly with our interior architects. Receive tailored layout blueprints,
              tactile material pairing advice, and transparent budget estimates tailored to your room’s
              exact metric dimensions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-sand">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sand shrink-0" />
                <span>Open to all — no prior registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sand shrink-0" />
                <span>24-Hour architectural review turnaround</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/consultation">
                <Button variant="primary" size="lg" className="bg-sand text-charcoal hover:bg-white">
                  Request Design Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/room-planner">
                <Button variant="secondary" size="lg" className="border-sand/60 text-sand hover:bg-white/10 hover:text-white">
                  Try 2D Room Planner First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
