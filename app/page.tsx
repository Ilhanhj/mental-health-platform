"use client";

import { ArticlesSection } from "@/components/sections/education/article-preview";
import { FeaturesSection } from "@/components/sections/home/features-section";
import HeroSection from "@/components/sections/home/hero";

export default function Home() {
  // Kata-kata untuk animasi judul

  return (
    <>
      <HeroSection />;
      <ArticlesSection />
      <FeaturesSection />
    </>
  );
}
