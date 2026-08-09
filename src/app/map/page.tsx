import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Map",
  description: "Floor plans and directions to Majestic City, Bambalapitiya.",
};

export default function MapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Map"
        title="Find your way around."
        description="Floor plans, entrances, parking access and directions to Station Road."
      />
      <ComingSoon section="Map" />
    </>
  );
}
