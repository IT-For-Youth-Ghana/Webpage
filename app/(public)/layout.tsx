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
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-control bg-white px-4 py-3 font-bold text-brand-deep shadow-panel transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-accent motion-reduce:transition-none"
      >
        Skip to main content
      </a>
      {/*
       * Stack order:
       *   AnnouncementBar - z-50, not sticky, scrolls away naturally
       *   SiteHeader      - z-40, sticky top-0
       *   main            - page content
       *   SiteFooter      - full-width dark footer
      */}
      <AnnouncementBar announcement={announcement} />
      <SiteHeader logoUrl={settings.logoUrl} />
      <main id="main-content" tabIndex={-1} className="antialiased">{children}</main>
      <FloatingElements content={floating} />
      <SiteFooter settings={settings} />
    </>
  );
}
