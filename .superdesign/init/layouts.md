# Shared layouts

The root layout owns global metadata and fonts. The public layout renders the announcement bar, site header, floating affordances and footer.

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itforyouthghana.org"),
  title: {
    default: "IT For Youth Ghana",
    template: "%s | IT For Youth Ghana",
  },
  description:
    "Next.js rebuild foundation for IT For Youth Ghana, with a new public information architecture and CMS-ready scaffolding.",
  applicationName: "IT For Youth Ghana",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.svg",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### `app/(public)/layout.tsx`

```tsx
import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { FloatingElements } from "@/components/layout/floating-elements";
import { SiteHeader }      from "@/components/layout/site-header";
import { SiteFooter }      from "@/components/layout/site-footer";
import { siteMeta } from "@/lib/content/site-config";
import { getCmsAnnouncement, getCmsFloatingElements } from "@/lib/cms/homepage";
import { getCmsSettings } from "@/lib/cms/settings";

export const metadata: Metadata = {
  title: {
    default: siteMeta.defaultTitle,
    template: siteMeta.titleTemplate,
  },
  description: siteMeta.description,
  openGraph: siteMeta.openGraph,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [announcement, floating, settings] = await Promise.all([
    getCmsAnnouncement(),
    getCmsFloatingElements(),
    getCmsSettings(),
  ]);

  return (
    <>
      {/*
       * Stack order:
       *   AnnouncementBar - z-50, not sticky, scrolls away naturally
       *   SiteHeader      - z-40, sticky top-0
       *   main            - page content
       *   SiteFooter      - full-width dark footer
      */}
      <AnnouncementBar announcement={announcement} />
      <SiteHeader logoUrl={settings.logoUrl} />
      <main className="antialiased">{children}</main>
      <FloatingElements content={floating} />
      <SiteFooter settings={settings} />
    </>
  );
}
```

### `components/layout/announcement-bar.tsx`

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export type Announcement = {
  id: string;
  label: string;
  message: string;
  cta?: { label: string; href: string };
  variant?: "info" | "success" | "urgent" | "alert";
  startDate?: string;
  endDate?: string;
  countdownDate?: string;
  dismissible?: boolean;
};

type AnnouncementBarProps = {
  announcement: Announcement;
};

const variantStyles = {
  info: {
    wrap: "bg-brand-primary text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-blue px-3.5 py-1 text-[0.72rem]",
    close: "text-white/40 hover:text-white",
  },
  success: {
    wrap: "bg-brand-primary-dark text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-blue px-3.5 py-1 text-[0.72rem]",
    close: "text-white/45 hover:text-white",
  },
  urgent: {
    wrap: "bg-brand-accent text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-pink px-3.5 py-1 text-[0.72rem]",
    close: "text-white/55 hover:text-white",
  },
  alert: {
    wrap: "bg-brand-accent text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-pink px-3.5 py-1 text-[0.72rem]",
    close: "text-white/45 hover:text-white",
  },
};

const DISMISS_WINDOW_MS = 24 * 60 * 60 * 1000;

function formatCountdownLabel(countdownDate?: string) {
  if (!countdownDate) {
    return null;
  }

  const delta = new Date(countdownDate).getTime() - Date.now();
  if (Number.isNaN(delta) || delta <= 0) {
    return null;
  }

  const totalMinutes = Math.floor(delta / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }

  if (hours > 0) {
    return `${hours}h left`;
  }

  return `${Math.max(totalMinutes, 1)}m left`;
}

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);

  const dismissKey = useMemo(
    () => `itfy-announcement-dismissed:${announcement.id}`,
    [announcement.id],
  );

  useEffect(() => {
    const now = Date.now();
    const start = announcement.startDate ? new Date(announcement.startDate).getTime() : null;
    const end = announcement.endDate ? new Date(announcement.endDate).getTime() : null;

    if ((start && now < start) || (end && now > end)) {
      setIsVisible(false);
      return;
    }

    if (announcement.dismissible !== false) {
      const dismissedUntil = window.localStorage.getItem(dismissKey);
      if (dismissedUntil && Number(dismissedUntil) > now) {
        setIsVisible(false);
        return;
      }
    }

    setIsVisible(true);
    setCountdownLabel(formatCountdownLabel(announcement.countdownDate));

    if (!announcement.countdownDate) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdownLabel(formatCountdownLabel(announcement.countdownDate));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [
    announcement.countdownDate,
    announcement.dismissible,
    announcement.endDate,
    announcement.startDate,
    dismissKey,
  ]);

  if (!isVisible) {
    return null;
  }

  const v = variantStyles[announcement.variant ?? "urgent"];

  const dismissAnnouncement = () => {
    if (announcement.dismissible === false) {
      return;
    }

    window.localStorage.setItem(dismissKey, String(Date.now() + DISMISS_WINDOW_MS));
    setIsVisible(false);
  };

  return (
    <div className={`relative z-50 animate-banner-in ${v.wrap}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${v.badge}`}
        >
          {announcement.label}
        </span>

        <p className="text-center text-[0.78rem] font-medium leading-snug sm:text-left">
          {announcement.message}
        </p>

        {countdownLabel ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.15em] ${v.badge}`}
          >
            {countdownLabel}
          </span>
        ) : null}

        {announcement.cta ? (
          <Link
            href={announcement.cta.href}
            className={`shrink-0 font-bold ${v.cta}`}
          >
            {announcement.cta.label} →
          </Link>
        ) : null}

        {announcement.dismissible !== false ? (
          <button
            onClick={dismissAnnouncement}
            aria-label="Dismiss announcement"
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${v.close}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
```

### `components/layout/site-header.tsx`

```tsx
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
          aria-label="Toggle menu"
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
        <div className="border-t border-white/[0.12] bg-[#030b18] xl:hidden">
          <div className="mx-auto max-w-[1400px] space-y-0.5 px-4 py-4 sm:px-6">
            {publicNavigation.map((item) =>
              item.items ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileSection((s) => (s === item.label ? null : item.label))
                    }
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
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.08] pb-2 pl-3">
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
```

### `components/layout/site-footer.tsx`

```tsx
import Link from "next/link";

import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";
import { footerNavigation, legalNavigation, newsletterSignupContent } from "@/lib/content/site-config";
import { getCmsSettings, type CmsPublicSettings } from "@/lib/cms/settings";

function SocialIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    );
  }
  if (l.includes("twitter") || l.includes("x")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    );
  }
  if (l.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
    );
  }
  if (l.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.5]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
    );
  }
  if (l.includes("youtube")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><circle cx="12" cy="12" r="10" /></svg>
  );
}
type SiteFooterProps = {
  settings?: CmsPublicSettings;
};

export async function SiteFooter({ settings: providedSettings }: SiteFooterProps = {}) {
  const settings = providedSettings ?? (await getCmsSettings());
  return (
    <footer className="bg-brand-deep text-white">
      {/* Main footer grid */}
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[0.72rem] font-bold tracking-wide text-brand-deep">
                ITFY
              </span>
              <span className="font-heading text-[1.15rem] font-bold leading-tight text-white">
                IT For Youth<br />Ghana
              </span>
            </Link>
            <p className="mt-4 text-[0.92rem] leading-[1.75] text-white/85">
              Empowering Ghanaian youth with the digital skills, confidence, and pathways needed to shape tomorrow&apos;s economy.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {settings.socials.map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/85 transition hover:bg-white/15 hover:text-white"
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>

            {/* Contact snippet */}
            <div className="mt-6 space-y-1.5 text-[0.85rem] text-white/85">
              {settings.contact.location && <p>{settings.contact.location}</p>}
              {settings.contact.email && <p>{settings.contact.email}</p>}
              {settings.contact.phone && <p>{settings.contact.phone}</p>}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-4">
            {footerNavigation.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.22em] text-white">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.92rem] text-white/85 transition hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-10">
          <div>
            <p className="text-[0.95rem] font-semibold text-white">{newsletterSignupContent.heading}</p>
            <p className="text-[0.85rem] text-white/85">{newsletterSignupContent.description}</p>
          </div>
          <NewsletterSignupForm
            variant="compact"
            interest="footer"
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
          <p className="text-[0.8rem] text-white/80">
            © {new Date().getFullYear()} IT For Youth Ghana. Registered NGO. All rights reserved.
          </p>
          <div className="flex gap-4">
            {legalNavigation.map((l) => (
              <Link key={l.href} href={l.href} className="text-[0.8rem] text-white/80 hover:text-white hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### `components/layout/page-container.tsx`

```tsx
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type PageContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "main" | "section" | "div";
};

export function PageContainer({ as: Component = "main", className, ...props }: PageContainerProps) {
  return <Component className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
```
