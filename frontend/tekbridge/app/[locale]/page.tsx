import { Navigation } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
