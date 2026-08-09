import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Investor Relations",
  description:
    "Annual reports, quarterly filings and corporate governance disclosures.",
};

export default function InvestorRelationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Investor Relations"
        title="Reports, filings and governance."
        description="Annual reports, quarterly results and disclosures for shareholders."
      />
      <ComingSoon section="Investor Relations" />
    </>
  );
}
