import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${siteConfig.name} team in Bambalapitiya, Colombo 04.`,
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Address",
    value: siteConfig.contact.address,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Talk to the Majestic City team."
        description="Leasing enquiries, lost property, event bookings or anything else — we're on Station Road, seven days a week."
      />

      <section className="mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 sm:py-24">
        <ul className="grid gap-4 sm:grid-cols-3">
          {CHANNELS.map(({ icon: Icon, label, value, href }) => {
            const body = (
              <>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                  <Icon className="size-5" />
                </span>
                <span className="mt-4 block text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {label}
                </span>
                <span className="mt-1.5 block font-heading text-base font-medium text-pretty">
                  {value}
                </span>
              </>
            );

            return (
              <li
                key={label}
                className="rounded-3xl border border-black/8 bg-card p-6"
              >
                {href ? (
                  <a
                    href={href}
                    className="block transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                  >
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
