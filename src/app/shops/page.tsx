import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Shops",
  description: "Every brand at Majestic City, floor by floor.",
};

export default function ShopsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shops"
        title="Every brand, floor by floor."
        description="Fashion, electronics, groceries and gifts across five retail levels."
      />
      <ComingSoon section="Shops" />
    </>
  );
}
