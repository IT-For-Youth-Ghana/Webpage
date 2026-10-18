// lib/content/admin-registry.ts
// Central registry for Admin Content Explorer (hubs -> pages/collections)

import { initiatives } from "@/lib/content/site-config";
import { organisationServices } from "@/lib/content/organisation-config";
import { partnershipTracks } from "@/lib/content/partnership-config";

export type AdminNodeType = "singleton" | "collection";

export type AdminNode = {
  key: string;              // unique id (e.g., who-we-are.team)
  hub: string;              // hub key (e.g., who-we-are)
  label: string;            // display name
  type: AdminNodeType;      // singleton | collection
  adminPath: string;        // existing admin route to open editor
  previewHref?: string;     // public preview URL
  revalidateTag?: string;   // revalidation tag/key
};

export type AdminHub = {
  key: string;              // hub key (e.g., homepage, who-we-are)
  label: string;            // display name
  description?: string;
};

export const adminHubs: AdminHub[] = [
  { key: "homepage",        label: "Homepage",        description: "Top-level sections and blocks" },
  { key: "who-we-are",       label: "Who We Are",      description: "Team, partners, careers" },
  { key: "what-we-do",       label: "What We Do",      description: "Initiatives and programme pages" },
  { key: "apply-for-training", label: "Apply for Training", description: "Eligibility, courses, process" },
  { key: "for-organisations", label: "For Organisations", description: "Services for organisations" },
  { key: "partner-with-us",  label: "Partner With Us", description: "Partner tracks" },
  { key: "our-impact",       label: "Our Impact",      description: "Reports, testimonials, SDGs" },
  { key: "news-and-updates", label: "News & Updates",  description: "News and Blogs" },
  { key: "contact",          label: "Contact",         description: "Contact page content" },
  { key: "media",            label: "Media Library",   description: "Uploads and assets" },
  { key: "operations",       label: "Operations",      description: "Applications and messages" },
  { key: "system",           label: "System",          description: "Audit, settings, and tools" },
];

// Seed nodes mapped to existing admin routes
export const adminNodes: AdminNode[] = [
  // Homepage
  { key: "homepage.overview",        hub: "homepage", label: "Homepage Builder",   type: "singleton", adminPath: "/admin/content/homepage", previewHref: "/" },
  { key: "homepage.banner",          hub: "homepage", label: "Announcement Banner", type: "singleton", adminPath: "/admin/content/banner", previewHref: "/" },
  { key: "homepage.hero",            hub: "homepage", label: "Hero Slides",        type: "singleton", adminPath: "/admin/content/hero-slides", previewHref: "/" },
  { key: "homepage.impact",          hub: "homepage", label: "Impact Stats",       type: "singleton", adminPath: "/admin/content/impact-stats", previewHref: "/" },
  { key: "homepage.donation",        hub: "homepage", label: "Donation Campaign",  type: "singleton", adminPath: "/admin/content/donation-campaign", previewHref: "/donate" },
  { key: "homepage.featured-story",  hub: "homepage", label: "Featured Story",     type: "singleton", adminPath: "/admin/content/featured-story", previewHref: "/our-impact/testimonials" },
  { key: "homepage.join-cta",        hub: "homepage", label: "Join CTA Cards",     type: "singleton", adminPath: "/admin/content/homepage" },
  { key: "homepage.floating",        hub: "homepage", label: "Floating Elements",  type: "singleton", adminPath: "/admin/content/floating-elements" },
  { key: "homepage.ticker",          hub: "homepage", label: "Marquee Ticker",     type: "singleton", adminPath: "/admin/content/homepage" },

  // Who We Are
  { key: "who.team",        hub: "who-we-are", label: "Team",      type: "collection", adminPath: "/admin/team", previewHref: "/who-we-are/team" },
  { key: "who.partners",    hub: "who-we-are", label: "Partners",  type: "collection", adminPath: "/admin/partners", previewHref: "/who-we-are/partners" },
  { key: "who.careers",     hub: "who-we-are", label: "Careers",   type: "singleton",  adminPath: "/admin/who-we-are-pages" },

  // What We Do
  { key: "what.initiatives", hub: "what-we-do", label: "Initiatives", type: "collection", adminPath: "/admin/programmes", previewHref: "/what-we-do" },
  { key: "what.custom-pages", hub: "what-we-do", label: "Custom Pages", type: "collection", adminPath: "/admin/what-we-do-pages", previewHref: "/what-we-do" },
  /* The two nodes above both preview the /what-we-do hub, so the eight
     initiative detail pages were not discoverable in the Content Explorer and
     their preview links landed on the hub instead of the page being edited.
     Generated from the seed so the list cannot drift from the initiatives that
     actually exist. */
  ...initiatives.map((initiative) => ({
    key: `what.initiative.${initiative.slug}`,
    hub: "what-we-do",
    label: initiative.title,
    type: "singleton" as const,
    adminPath: `/admin/programmes/${initiative.slug}`,
    previewHref: `/what-we-do/${initiative.slug}`,
    revalidateTag: "initiative",
  })),

  // Apply for Training
  { key: "apply.landing",   hub: "apply-for-training", label: "Landing",       type: "singleton",  adminPath: "/admin/content/apply-for-training", previewHref: "/apply-for-training" },
  { key: "apply.who",       hub: "apply-for-training", label: "Who Can Apply", type: "singleton",  adminPath: "/admin/content/apply-for-training-who-can-apply", previewHref: "/apply-for-training/who-can-apply" },
  { key: "apply.courses",   hub: "apply-for-training", label: "Courses",       type: "collection", adminPath: "/admin/content/apply-for-training-courses", previewHref: "/apply-for-training/courses" },
  { key: "apply.process",   hub: "apply-for-training", label: "How It Works",   type: "singleton",  adminPath: "/admin/content/apply-for-training-how-it-works", previewHref: "/apply-for-training/how-it-works" },

  // For Organisations
  { key: "org.overview", hub: "for-organisations", label: "Overview", type: "singleton", adminPath: "/admin/programmes/for-organisations/overview", previewHref: "/for-organisations" },
  ...organisationServices.map((service): AdminNode => ({
    key: `org.${service.slug}`,
    hub: "for-organisations",
    label: service.title,
    type: "singleton",
    adminPath: `/admin/programmes/for-organisations/${service.slug}`,
    previewHref: `/for-organisations/${service.slug}`,
  })),

  // Partner With Us
  { key: "pwu.overview", hub: "partner-with-us", label: "Overview", type: "singleton", adminPath: "/admin/partner-with-us/overview", previewHref: "/partner-with-us" },
  ...partnershipTracks.map((track): AdminNode => ({
    key: `pwu.${track.slug}`,
    hub: "partner-with-us",
    label: track.title,
    type: "singleton",
    adminPath: `/admin/partner-with-us/${track.slug}`,
    previewHref: `/partner-with-us/${track.slug}`,
  })),

  // Our Impact
  { key: "impact.overview", hub: "our-impact", label: "Overview",   type: "singleton",  adminPath: "/admin/our-impact", previewHref: "/our-impact" },
  { key: "impact.reports",  hub: "our-impact", label: "Reports",    type: "collection", adminPath: "/admin/our-impact", previewHref: "/our-impact/reports" },
  { key: "impact.testimonials", hub: "our-impact", label: "Testimonials", type: "collection", adminPath: "/admin/testimonials", previewHref: "/our-impact/testimonials" },
  { key: "impact.sdgs",     hub: "our-impact", label: "UN SDGs",    type: "singleton",  adminPath: "/admin/our-impact", previewHref: "/our-impact/sdgs" },

  // News & Updates
  { key: "news.hub",    hub: "news-and-updates", label: "Overview", type: "singleton", adminPath: "/admin/news-and-updates/hub", previewHref: "/news-and-updates" },
  { key: "news.news",   hub: "news-and-updates", label: "News",  type: "collection", adminPath: "/admin/news-and-updates", previewHref: "/news-and-updates/news" },
  { key: "news.blogs",  hub: "news-and-updates", label: "Blogs", type: "collection", adminPath: "/admin/news-and-updates", previewHref: "/news-and-updates/blogs" },

  // Contact
  { key: "contact.page", hub: "contact", label: "Contact Page", type: "singleton", adminPath: "/admin/content/contact", previewHref: "/contact" },

  // Media
  { key: "media.library", hub: "media", label: "Assets", type: "collection", adminPath: "/admin/media" },

  // Operations
  { key: "ops.applications", hub: "operations", label: "Applications", type: "collection", adminPath: "/admin/applications" },
  { key: "ops.messages",     hub: "operations", label: "Messages",     type: "collection", adminPath: "/admin/messages" },

  // System
  { key: "sys.audit",     hub: "system", label: "Audit",       type: "collection", adminPath: "/admin/audit" },
  { key: "sys.settings",  hub: "system", label: "Settings",    type: "singleton",  adminPath: "/admin/settings" },
  { key: "sys.docs",       hub: "system", label: "Documentation", type: "singleton",  adminPath: "/admin/documentation" },
];

export function getHubs() {
  return adminHubs;
}

export function getNodesForHub(hubKey: string) {
  return adminNodes.filter((n) => n.hub === hubKey);
}
