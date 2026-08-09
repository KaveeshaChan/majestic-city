import { ScrollProgress } from "@/components/motion/scroll-progress";
import { BrandMarquee } from "@/components/sections/home/brand-marquee";
import { ClosingCta } from "@/components/sections/home/closing-cta";
import { ExperienceBento } from "@/components/sections/home/experience-bento";
import { FloorGuide } from "@/components/sections/home/floor-guide";
import { HomeHero } from "@/components/sections/home/hero";
import { Statement } from "@/components/sections/home/statement";
import { VisitInfo } from "@/components/sections/home/visit-info";
import { WhyMajestic } from "@/components/sections/home/why-majestic";

/**
 * The landing page, ordered as a single argument: what this place is (hero) →
 * what's in it (marquee, statement, bento) → why come here (trust) → where to
 * go (floors) → how to get here (visit) → do something (CTA).
 */
export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <HomeHero />
      <BrandMarquee />
      <Statement />
      <ExperienceBento />
      <WhyMajestic />
      <FloorGuide />
      <VisitInfo />
      <ClosingCta />
    </>
  );
}
