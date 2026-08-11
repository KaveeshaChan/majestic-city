import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ShopDirectory } from "@/components/sections/shops/shop-directory";
import { shopCategoriesInUse, shopFloorsInUse, shops } from "@/config/shops";

export const metadata: Metadata = {
  title: "Shops",
  description:
    "Search every brand at Majestic City by name, floor or category — from mobile and electronics to fashion, sarees and the cineplex.",
};

/** Headline figures, derived from the directory so they can never drift. */
const stats = [
  { value: `${shops.length}`, label: "Stores listed" },
  { value: `${shopFloorsInUse.length}`, label: "Retail floors" },
  { value: `${shopCategoriesInUse.length}`, label: "Categories" },
];

export default function ShopsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shops"
        title="Every brand, floor by floor."
        description="Search by name, narrow by floor, or browse a category — the list updates as you type."
      >
        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs tracking-[0.14em] text-white/45 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </PageHeader>

      <ShopDirectory />
    </>
  );
}
