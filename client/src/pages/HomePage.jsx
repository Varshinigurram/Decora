import React from 'react';
import HeroSection from '../components/home/HeroSection';
import DesignPillars from '../components/home/DesignPillars';
import RoomCategories from '../components/home/RoomCategories';
import FeaturedCollection from '../components/home/FeaturedCollection';
import CustomizerPromo from '../components/home/CustomizerPromo';
import InspirationPreview from '../components/home/InspirationPreview';
import ConsultationCTA from '../components/home/ConsultationCTA';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Hero Architectural Stage */}
      <HeroSection />

      {/* 2. Foundational Design & Engineering Pillars */}
      <DesignPillars />

      {/* 3. Room Categories Showcase */}
      <RoomCategories />

      {/* 4. Featured Configurable Furniture Collection */}
      <FeaturedCollection />

      {/* 5. Interactive Material Customizer Teaser */}
      <CustomizerPromo />

      {/* 6. Curated Interior Inspiration & Aesthetic Lookbooks */}
      <InspirationPreview />

      {/* 7. Design Consultation & Architectural Advisory CTA */}
      <ConsultationCTA />
    </div>
  );
}
