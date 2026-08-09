import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "News & Articles",
  description: "Events, seasonal offers and announcements from Majestic City.",
};

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="News & Articles"
        title="What's happening at Majestic City."
        description="Events, seasonal offers and announcements as they land."
      />
      <ComingSoon section="News & Articles" />
    </>
  );
}
