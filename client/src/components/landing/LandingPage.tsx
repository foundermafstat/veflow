'use client';

import { Hero } from './Hero';
import { Features } from './Features';
import { Benefits } from './Benefits';
import { UseCases } from './UseCases';
import { TechnicalSpecs } from './TechnicalSpecs';
import { CTA } from './CTA';
import { Footer } from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Benefits />
      <UseCases />
      <TechnicalSpecs />
      <CTA />
      <Footer />
    </div>
  );
}
