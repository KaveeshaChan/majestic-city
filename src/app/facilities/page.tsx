import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Parking, cinema, food court, banking and every other amenity at Majestic City.",
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Facilities"
        title="Built around the way you shop."
        description="Covered parking, a multiplex cinema, a full food court and the services that keep a visit easy."
      />
      <ComingSoon section="Facilities" />
    </>
  );
}
