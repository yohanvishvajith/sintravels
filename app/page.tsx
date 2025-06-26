"use client";

import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { ServicesSection } from "@/components/home/services-section";
import { WorldMapSection } from "@/components/home/world-map-section";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { CTASection } from "@/components/home/cta-section";
import { GoogleReview } from "@/components/home/google-review";
import YoutubeTravelSection from "@/components/home/youtube";
import WhatsappButton from "@/components/home/whatsapp";
export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <ServicesSection />

      <WorldMapSection />

      <YoutubeTravelSection />
      <WhatsappButton />
      
      <TestimonialSection />
      <GoogleReview />
      <CTASection />
    </div>
  );
}
