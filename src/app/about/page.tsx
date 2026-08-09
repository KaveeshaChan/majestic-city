import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Three decades as Colombo's landmark shopping destination, from 1991 to today.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A Colombo landmark since 1991."
        description="Majestic City opened its doors on Station Road and has anchored Bambalapitiya retail ever since."
      />
      <ComingSoon section="About Us" />
    </>
  );
}
