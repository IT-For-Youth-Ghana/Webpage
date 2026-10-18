"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { publicNavigation, headerCtas } from "@/lib/content/site-config";

// ─── Dropdown panel ───────────────────────────────────────────────────────────
// Items ≥ 5 → 2-column glass panel. Below that → single column.

const WIDE_THRESHOLD = 5;

function DropdownPanel({ items }: { items: { label: string; href: string }[] }) {
  const isWide = items.length >= WIDE_THRESHOLD;
  const mid    = Math.ceil(items.length / 2);
  const cols   = isWide ? [items.slice(0, mid), items.slice(mid)] : [items];

  return (
    <div
      className={cn(
        // Positioning
        "absolute left-1/2 top-[calc(100%+12px)] z-50 -translate-x-1/2",
        // Glass dark panel
        "rounded-2xl border border-white/10 bg-[#030b18]/95 backdrop-blur-2xl",
        "shadow-[0_24px_60px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.06)]",
        "p-2",
        // Show/hide — pure CSS group-hover
        "pointer-events-none -translate-y-1 opacity-0 transition-all duration-150",
        "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
        // Width
        isWide ? "grid grid-cols-2 gap-0 min-w-[360px]" : "flex flex-col gap-0.5 min-w-[190px]",
      )}
    >
      {cols.map((col, ci) => (
        <div
          key={ci}
          className={cn(
            "flex flex-col gap-0.5 p-1",
            ci > 0 && "border-l border-white/[0.06] pl-2",
          )}
        >
          {col.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="rounded-xl px-3 py-2 text-[0.75rem] font-medium text-white transition hover:bg-white/[0.12]"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── SiteHeader ───────────────────────────────────────────────────────────────

type SiteHeaderProps = {
  logoUrl?: string;
};

export function SiteHeader({ logoUrl = "/Asset-1.png" }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.12] bg-[#030b18]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-0 sm:px-6 lg:px-8">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link href="/" className="flex shrink-0 items-center gap-3 py-3.5">
          <Image
            src={logoUrl}
            alt="IT For Youth Ghana"
            width={36}
            height={36}
            className="h-9 w-9 rounded-[10px] object-contain"
            unoptimized={logoUrl.startsWith("http")}
            priority
          />
          {/* Wordmark */}
          <span className="hidden sm:flex sm:flex-col sm:gap-0.5">
            <span className="font-heading text-[0.96rem] font-bold leading-none text-white">
              IT For Youth Ghana
            </span>
            <span className="text-[0.57rem] font-semibold uppercase tracking-[0.22em] text-white/75">
              Digital Skills &amp; Opportunity
            </span>
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────── */}
        <nav className="hidden items-center gap-0 xl:flex">
          {publicNavigation.map((item) =>
            item.items ? (
              <div key={item.label} className="group relative">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-white/[0.12]"
                  >
                    {item.label}
                  </Link>
                  <ChevronDown className="h-3 w-3 text-white/75 transition-transform duration-200 group-hover:rotate-180 group-hover:text-white" />
                </div>
                <DropdownPanel items={item.items} />
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-white/[0.12]"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* ── Desktop actions ───────────────────────────────────────── */}
        <div className="hidden items-center gap-2 xl:flex">
          <div className="mx-1 h-5 w-px bg-white/10" />
          <Button
            href={headerCtas.primary.href}
            variant="ghost"
            size="sm"
            className="rounded-lg text-[0.7rem]"
          >
            {headerCtas.primary.label}
          </Button>
          <Button
            href={headerCtas.secondary.href}
            variant="primary"
            size="sm"
            className="rounded-lg px-5 text-[0.7rem]"
          >
            {headerCtas.secondary.label}
          </Button>
        </div>

        {/* ── Hamburger ─────────────────────────────────────────────── */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/15 transition hover:bg-white/[0.07] xl:hidden"
        >
          {mobileOpen ? (
            <X className="h-4 w-4 text-white" />
          ) : (
            <>
              <span className="block h-[1.5px] w-4 rounded-full bg-white/70" />
              <span className="block h-[1.5px] w-4 rounded-full bg-white/70" />
              <span className="block h-[1.5px] w-3 rounded-full bg-white/70" />
            </>
          )}
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-white/[0.12] bg-[#030b18] xl:hidden">
          <div className="mx-auto max-w-[1400px] space-y-0.5 px-4 py-4 sm:px-6">
            {publicNavigation.map((item) =>
              item.items ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileSection((s) => (s === item.label ? null : item.label))
                    }
                    aria-expanded={mobileSection === item.label}
                    aria-controls={`mobile-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[0.85rem] font-medium text-white transition hover:bg-white/[0.12]"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-white/30 transition-transform duration-200",
                        mobileSection === item.label && "rotate-180 text-white/60",
                      )}
                    />
                  </button>
                  {mobileSection === item.label && (
                    <div id={`mobile-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.08] pb-2 pl-3">
                      {item.items.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-2.5 py-2 text-[0.82rem] font-medium text-white transition hover:bg-white/[0.1]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-[0.85rem] font-medium text-white transition hover:bg-white/[0.12]"
                >
                  {item.label}
                </Link>
              ),
            )}

            {/* Mobile CTAs */}
            <div className="flex gap-2 border-t border-white/[0.08] pt-4">
              <Link
                href={headerCtas.primary.href}
                onClick={() => setMobileOpen(false)}
                className="itfy-button-ghost-light flex-1 py-2.5 text-center text-[0.82rem]"
              >
                {headerCtas.primary.label}
              </Link>
              <Link
                href={headerCtas.secondary.href}
                onClick={() => setMobileOpen(false)}
                className="itfy-button-primary flex-1 py-2.5 text-center text-[0.82rem]"
              >
                {headerCtas.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
