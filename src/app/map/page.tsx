import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { MallMap } from "@/components/map/mall-map";
import { Reveal } from "@/components/motion/reveal";
import { visitInfo } from "@/config/home";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Interactive floor plans for Majestic City — search any shop, service or unit and see exactly which level it is on.",
};

export default function MapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Map"
        title="Find your way around."
        description="Search a shop or tap any unit on the plan to see what it is and which level it sits on."
      />

      <section className="bg-surface py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8">
          <MallMap />

          <Reveal className="mt-10 grid gap-3 sm:grid-cols-3">
            {visitInfo.gettingHere.map((line) => (
              <p
                key={line}
                className="rounded-[1.25rem] bg-white p-5 text-sm leading-relaxed text-muted-foreground ring-1 ring-black/5 text-pretty"
              >
                {line}
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
