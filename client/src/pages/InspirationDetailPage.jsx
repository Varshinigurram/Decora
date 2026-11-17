import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Ruler,
  Sun,
  Layers,
  ArrowRight,
  PackageOpen,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import PaletteSwatches from '../components/inspiration/PaletteSwatches';
import ShopTheLookSection from '../components/inspiration/ShopTheLookSection';
import LookbookCard from '../components/inspiration/LookbookCard';
import {
  getInspirationByIdOrSlug,
  getResolvedProductsForLookbook,
  getRelatedInspirations,
} from '../data/inspirations';

export default function InspirationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Resolve Lookbook Record
  const lookbook = useMemo(() => getInspirationByIdOrSlug(id), [id]);

  // 2. Resolve Actual Featured Products from products.js
  const resolvedProducts = useMemo(() => {
    return getResolvedProductsForLookbook(lookbook);
  }, [lookbook]);

  // 3. Resolve Related Inspirations
  const relatedInspirations = useMemo(() => {
    return getRelatedInspirations(lookbook, 2);
  }, [lookbook]);

  const [imgError, setImgError] = useState(false);

  // 4. Handle Invalid Lookbook Route (404)
  if (!lookbook) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Lookbook Not Found"
          message={`We could not locate any interior portfolio matching "${id}". The design story may have been relocated or the link is invalid.`}
          actionLabel="Return to Inspiration Gallery"
          onAction={() => navigate('/inspiration')}
          icon={PackageOpen}
        />
      </div>
    );
  }

  const heroImageSrc = imgError
    ? lookbook.fallback || '/assets/placeholders/placeholder-product.svg'
    : lookbook.heroImage || '/assets/placeholders/placeholder-product.svg';

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Interior Inspiration', path: '/inspiration' },
          { label: lookbook.style, path: `/inspiration?style=${encodeURIComponent(lookbook.style)}` },
          { label: lookbook.title },
        ]}
      />

      {/* 2. Editorial Hero Header */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="forest" size="xs">
              {lookbook.style}
            </Badge>
            <span className="text-sand select-none">•</span>
            <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
              {lookbook.roomLabel}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-charcoal leading-tight">
            {lookbook.title}
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl font-normal leading-relaxed">
            {lookbook.subtitle}
          </p>
        </div>

        {/* Hero Visual Stage (16:9 / 21:9 Responsive Frame) */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-ivory-subtle rounded overflow-hidden border border-sand/40 shadow-elevated">
          <img
            src={heroImageSrc}
            alt={lookbook.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />

          {/* Staged Room Badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto p-3.5 bg-white/95 backdrop-blur-md rounded border border-sand/40 shadow-subtle max-w-md">
            <span className="text-[10px] uppercase tracking-wider text-taupe font-semibold block">
              Architectural Concept Setting
            </span>
            <span className="font-serif text-sm sm:text-base font-medium text-charcoal block">
              {lookbook.title} • {lookbook.style} Principles
            </span>
          </div>
        </div>
      </div>

      {/* 3. Editorial Narrative & Design Philosophy (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Deep Narrative & Designer Notes (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-taupe font-semibold block">
              Concept Narrative
            </span>
            <p className="text-base sm:text-lg text-charcoal leading-relaxed font-serif">
              {lookbook.editorialDescription}
            </p>
          </div>

          {/* Design Philosophy Callout */}
          <div className="p-6 bg-white border border-sand/50 rounded shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-forest">
              <Compass className="w-4 h-4" />
              <h3 className="font-serif text-xl font-medium text-charcoal">
                Design Philosophy
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {lookbook.designPhilosophy}
            </p>
          </div>

          {/* Designer Notes Quote */}
          {lookbook.designerNotes && (
            <div className="p-6 bg-ivory-subtle border-l-2 border-forest rounded space-y-2">
              <div className="flex items-center gap-1.5 text-taupe text-xs uppercase tracking-wider font-semibold">
                <Quote className="w-3.5 h-3.5 text-forest" />
                <span>Interior Architect's Log</span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal italic font-serif leading-relaxed">
                "{lookbook.designerNotes}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Color Palette & Room Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Color Palette Swatches */}
          <div className="p-6 bg-white border border-sand/50 rounded shadow-subtle space-y-4">
            <PaletteSwatches palette={lookbook.palette} />
          </div>

          {/* Material Tactility Stack */}
          <div className="p-6 bg-white border border-sand/50 rounded shadow-subtle space-y-4">
            <span className="text-xs uppercase tracking-widest text-taupe font-semibold block">
              Tactile Materials & Textures
            </span>
            <ul className="space-y-2 text-xs text-charcoal">
              {lookbook.materials.map((mat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metric Room Guidance Specifications */}
          {lookbook.roomDetails && (
            <div className="p-6 bg-ivory-subtle border border-sand/60 rounded space-y-4 text-xs">
              <span className="text-xs uppercase tracking-widest text-taupe font-semibold block">
                Spatial Proportions & Lighting
              </span>

              <div className="space-y-3 divide-y divide-sand/30">
                <div className="pt-2 first:pt-0 flex items-start gap-2.5">
                  <Ruler className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <span className="text-charcoal font-medium block">Room Dimensions</span>
                    <span className="text-charcoal-muted font-mono">{lookbook.roomDetails.recommendedDimensions}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <span className="text-charcoal font-medium block">Ceiling Height</span>
                    <span className="text-charcoal-muted">{lookbook.roomDetails.ceilingHeight}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-start gap-2.5">
                  <Sun className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <span className="text-charcoal font-medium block">Lighting Orientation</span>
                    <span className="text-charcoal-muted leading-relaxed">{lookbook.roomDetails.lightingCondition}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Shop the Look: Furniture Used in this Design */}
      <ShopTheLookSection
        products={resolvedProducts}
        lookbookTitle={lookbook.title}
      />

      {/* 5. Related Inspiration Portfolios */}
      {relatedInspirations.length > 0 && (
        <section className="pt-12 sm:pt-16 border-t border-sand/40 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
                Explore More Spaces
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-charcoal">
                Related Lookbooks
              </h2>
            </div>
            <Link
              to="/inspiration"
              className="text-xs font-medium text-forest hover:text-forest-dark flex items-center gap-1"
            >
              <span>View All Portfolios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedInspirations.map((relLookbook) => (
              <LookbookCard key={relLookbook.id} lookbook={relLookbook} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
