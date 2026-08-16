"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface CtaButtonProps {
  href: string
  title: string
  isActive: boolean
  onNavigate?: () => void
  className?: string
}

/**
 * The pill call-to-action, shared between the desktop bar and the mobile
 * sheet so "Contact Us" always reads as a button rather than a plain link.
 */
export function CtaButton({
  href,
  title,
  isActive,
  onNavigate,
  className,
}: CtaButtonProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group inline-flex h-10 items-center justify-center gap-1.5 rounded-full pr-3.5 pl-4 text-sm font-medium whitespace-nowrap outline-none transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgb(123_20_22/0.65)] focus-visible:ring-2 focus-visible:ring-brand/40 active:translate-y-0 active:duration-150",
        isActive ? "bg-brand text-white" : "bg-ink text-white hover:bg-brand",
        className
      )}
    >
      {title}
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}
