import { getAdminSdkStatus } from "@/lib/firebase/admin";
import { firebaseScaffoldConfig } from "@/lib/firebase/config";
import { storageFolders } from "@/lib/firebase/storage";
import {
  activeAnnouncement,
  departments,
  heroSlides,
  initiatives,
  partners,
  testimonials,
} from "@/lib/content/site-config";
import { articles, getPublishedArticles } from "@/lib/content/news-config";
import { contactPageContent } from "@/lib/content/contact-config";
import { impactOverviewContent } from "@/lib/content/impact-config";
import { organisationServices } from "@/lib/content/organisation-config";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";
import type {
  AdminActivityItem,
  AdminApplicationRecord,
  AdminCollectionDefinition,
  AdminHomepageSectionConfig,
  AdminMediaFolder,
  AdminMetric,
  AdminSettingsGroup,
} from "@/types/admin";

export const adminRoleCapabilities = [
  {
    role: "super-admin",
    label: "Super admin",
    description: "Full access, including users, settings, deletes, publishing, and role management.",
  },
  {
    role: "editor",
    label: "Editor",
    description: "Can manage public content, articles, team, partners, applications, and media.",
  },
  {
    role: "viewer",
    label: "Viewer",
    description: "Read-only access for reporting, application review, and operational visibility.",
  },
  {
    role: "file-server-only",
    label: "File server only",
    description: "Can authenticate to the file server with Firebase credentials, but cannot enter the Webpage CMS.",
  },
] as const;

export const cmsCollections: AdminCollectionDefinition[] = [
  {
    key: "homepage",
    label: "Homepage",
    collection: FIREBASE_COLLECTIONS.homepage,
    route: "/admin/content/homepage",
    description: "Single document containing homepage section order, toggles, and editable modules.",
    readModel: "public-read",
    writeRole: "editor",
    status: "cms-ready",
    documentCount: 1,
  },
  {
    key: "siteContent",
    label: "Site content",
    collection: FIREBASE_COLLECTIONS.siteContent,
    route: "/admin/content/apply-for-training",
    description: "Public hub pages such as Who We Are, Apply for Training, Contact, Team, Partners, and Careers.",
    readModel: "public-read",
    writeRole: "editor",
    status: "cms-ready",
    documentCount: 9,
  },
  {
    key: "initiatives",
    label: "Initiatives",
    collection: FIREBASE_COLLECTIONS.initiatives,
    route: "/admin/programmes/girls-in-tech",
    description: "One document per What We Do initiative page.",
    readModel: "public-read",
    writeRole: "editor",
    status: "live-seed",
    documentCount: initiatives.length,
  },
  {
    key: "forOrganisations",
    label: "Organisation services",
    collection: FIREBASE_COLLECTIONS.forOrganisations,
    route: "/admin/programmes/for-organisations/overview",
    description: "Service pages for corporate training, sponsorships, hiring, and volunteering.",
    readModel: "public-read",
    writeRole: "editor",
    status: "live-seed",
    documentCount: organisationServices.length,
  },
  {
    key: "articles",
    label: "Articles",
    collection: FIREBASE_COLLECTIONS.articles,
    route: "/admin/articles",
    description: "News and blog documents with status, SEO, tags, cover images, and TipTap HTML.",
    readModel: "public-read",
    writeRole: "editor",
    status: "live-seed",
    documentCount: articles.length,
  },
  {
    key: "team",
    label: "Team",
    collection: FIREBASE_COLLECTIONS.team,
    route: "/admin/team",
    description: "Team profiles, departments, featured state, ordering, and bios.",
    readModel: "public-read",
    writeRole: "editor",
    status: "cms-ready",
    documentCount: 0,
  },
  {
    key: "departments",
    label: "Departments",
    collection: FIREBASE_COLLECTIONS.departments,
    route: "/admin/departments",
    description: "Department pages with responsibilities, services, workflows, priorities, team links, and resources.",
    readModel: "public-read",
    writeRole: "editor",
    status: "cms-ready",
    documentCount: departments.length,
  },
  {
    key: "partners",
    label: "Partners",
    collection: FIREBASE_COLLECTIONS.partners,
    route: "/admin/partners",
    description: "Partner organisations, logos, links, relationship notes, and ordering.",
    readModel: "public-read",
    writeRole: "editor",
    status: "live-seed",
    documentCount: partners.length,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    collection: FIREBASE_COLLECTIONS.testimonials,
    route: "/admin/testimonials",
    description: "Global testimonial pool for homepage, initiatives, and impact pages.",
    readModel: "public-read",
    writeRole: "editor",
    status: "live-seed",
    documentCount: testimonials.length,
  },
  {
    key: "applications",
    label: "Applications",
    collection: FIREBASE_COLLECTIONS.applications,
    route: "/admin/applications",
    description: "Write-public learner applications with admin review, notes, status, and export.",
    readModel: "admin-read",
    writeRole: "editor",
    status: "needs-firebase",
    documentCount: 5,
  },
  {
    key: "contactMessages",
    label: "Contact messages",
    collection: FIREBASE_COLLECTIONS.contactMessages,
    route: "/admin/messages",
    description: "Validated public contact submissions routed into admin review and email alerts.",
    readModel: "write-only-public",
    writeRole: "editor",
    status: "needs-firebase",
    documentCount: 0,
  },
  {
    key: "settings",
    label: "Settings",
    collection: FIREBASE_COLLECTIONS.settings,
    route: "/admin/settings",
    description: "SEO defaults, social links, contact information, and integration settings.",
    readModel: "admin-only",
    writeRole: "super-admin",
    status: "cms-ready",
    documentCount: 1,
  },
  {
    key: "users",
    label: "Users",
    collection: FIREBASE_COLLECTIONS.users,
    route: "/admin/users",
    description: "Admin accounts, invite state, role claims, and access management.",
    readModel: "admin-only",
    writeRole: "super-admin",
    status: "protected",
    documentCount: 0,
  },
];

export const adminDashboardMetrics: AdminMetric[] = [
  {
    label: "Public content collections",
    value: String(cmsCollections.filter((collection) => collection.readModel === "public-read").length),
    description: "Collections that will be readable by public routes after Firestore wiring.",
    status: "published",
  },
  {
    label: "Seeded documents",
    value: String(cmsCollections.reduce((total, collection) => total + collection.documentCount, 0)),
    description: "Local seed records currently powering the admin previews.",
    status: "active",
  },
  {
    label: "Published articles",
    value: String(getPublishedArticles().length),
    description: "News and blog routes already generated from the article contract.",
    status: "published",
  },
  {
    label: "Firebase Admin SDK",
    value: getAdminSdkStatus().configured ? "Configured" : "Missing",
    description: "Requires server credentials before live Firestore writes are enabled.",
    status: getAdminSdkStatus().configured ? "configured" : "missing",
  },
];

export const adminActivityItems: AdminActivityItem[] = [
  {
    id: "activity-news",
    title: "News & Updates system upgraded",
    description: "Article hub, listing pages, detail rendering, tags, SEO, and sitemap entries are live.",
    timestamp: "2026-06-24",
    status: "published",
    href: "/admin/articles",
  },
  {
    id: "activity-contact",
    title: "Contact route validates enquiries",
    description: "The contact API now validates messages and can send Brevo notifications when configured.",
    timestamp: "2026-06-24",
    status: "active",
    href: "/admin/settings",
  },
  {
    id: "activity-impact",
    title: "Impact pages have seeded reporting routes",
    description: "Reports, testimonials, SDG alignment, and downloadable briefs are ready for CMS content.",
    timestamp: "2026-06-24",
    status: "published",
    href: "/our-impact",
  },
  {
    id: "activity-firebase",
    title: "Firestore write layer pending",
    description: "The admin UI is ready for Firebase Auth, Firestore CRUD, Storage uploads, and audit logging.",
    timestamp: "Next phase",
    status: "missing",
    href: "/admin/settings",
  },
];

export const adminApplicationRecords: AdminApplicationRecord[] = [
  {
    id: "APP-2026-001",
    name: "Akua Mensah",
    email: "akua@example.com",
    course: "Web Development Foundations",
    status: "new",
    submittedAt: "2026-06-22",
    notes: "Needs device support and prefers weekend sessions.",
  },
  {
    id: "APP-2026-002",
    name: "Kofi Boateng",
    email: "kofi@example.com",
    course: "Data Literacy for Work",
    status: "reviewed",
    submittedAt: "2026-06-21",
    notes: "Strong motivation note, follow up for availability.",
  },
  {
    id: "APP-2026-003",
    name: "Ama Owusu",
    email: "ama@example.com",
    course: "UX Design Basics",
    status: "shortlisted",
    submittedAt: "2026-06-20",
    notes: "Good fit for design cohort, ask for portfolio sample if available.",
  },
  {
    id: "APP-2026-004",
    name: "Yaw Asare",
    email: "yaw@example.com",
    course: "Digital Marketing Starter",
    status: "enrolled",
    submittedAt: "2026-06-18",
    notes: "Confirmed for onboarding sequence.",
  },
  {
    id: "APP-2026-005",
    name: "Efua Adjei",
    email: "efua@example.com",
    course: "Web Development Foundations",
    status: "rejected",
    submittedAt: "2026-06-17",
    notes: "Under minimum age for current cohort, share youth club route.",
  },
];

export const adminMediaFolders: AdminMediaFolder[] = storageFolders.map((folder) => {
  const folderConfig: Record<typeof folder, Omit<AdminMediaFolder, "id" | "storagePath">> = {
    initiatives: {
      label: "Initiatives",
      description: "Hero images, galleries, programme proof, and route-specific media.",
      itemCount: initiatives.length + organisationServices.length,
      sampleAssets: [
        "/images/randomPictures/groupworkstudents.jpg",
        "/images/randomPictures/studentsblueclothing.jpg",
      ],
    },
    team: {
      label: "Team",
      description: "Profile photos, board images, mentor portraits, and staff headshots.",
      itemCount: 12,
      sampleAssets: ["/images/people/peter.jpg", "/images/people/Belinda.jpg"],
    },
    news: {
      label: "News",
      description: "Article covers, press images, event images, and blog illustrations.",
      itemCount: articles.length,
      sampleAssets: [
        "/images/randomPictures/studentpresenting.jpg",
        "/images/randomPictures/mireiotalking.jpg",
      ],
    },
    logos: {
      label: "Logos",
      description: "Partner logos, ITFY brand marks, and public identity files.",
      itemCount: partners.length + 2,
      sampleAssets: ["/images/logo/logo.png", "/images/logo/logo_small.jpg"],
    },
    documents: {
      label: "Documents",
      description: "Impact briefs, reports, downloadable PDFs, and public reference files.",
      itemCount: 3,
      sampleAssets: [
        "/reports/itfy-impact-2025-brief.txt",
        "/reports/itfy-sdg-alignment-brief.txt",
      ],
    },
  };

  return {
    id: folder,
    storagePath: folder,
    ...folderConfig[folder],
  };
});

export const adminSettingsGroups: AdminSettingsGroup[] = [
  {
    id: "seo",
    label: "SEO defaults",
    description: "Site-wide metadata, default Open Graph image, and fallback descriptions.",
    status: "configured",
    fields: [
      { label: "Site title", value: "IT For Youth Ghana" },
      { label: "Default description", value: "Youth digital skills, training, partnerships, and impact in Ghana." },
      { label: "Default OG route", value: "/images/logo/logo.png" },
    ],
  },
  {
    id: "contact",
    label: "Contact information",
    description: "Public contact values shown across footer, contact page, and partner CTAs.",
    status: "configured",
    fields: contactPageContent.channels.map((channel) => ({
      label: channel.label,
      value: channel.value,
    })),
  },
  {
    id: "firebase",
    label: "Firebase",
    description: "Client and admin SDK environment readiness.",
    status:
      firebaseScaffoldConfig.projectId && getAdminSdkStatus().configured
        ? "configured"
        : "missing",
    fields: [
      {
        label: "Project ID",
        value: firebaseScaffoldConfig.projectId ?? "NEXT_PUBLIC_FIREBASE_PROJECT_ID missing",
      },
      {
        label: "Storage bucket",
        value: firebaseScaffoldConfig.storageBucket ?? "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET missing",
      },
      {
        label: "Admin credentials",
        value: getAdminSdkStatus().configured
          ? "Configured"
          : "FIREBASE_SERVICE_ACCOUNT_BASE64 missing or invalid",
        secret: true,
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Operational keys and external service endpoints.",
    status: process.env.BREVO_API_KEY ? "configured" : "missing",
    fields: [
      {
        label: "Brevo API",
        value: process.env.BREVO_API_KEY ? "Configured" : "BREVO_API_KEY missing",
        secret: true,
      },
      {
        label: "Contact notification email",
        value: process.env.CONTACT_NOTIFICATION_EMAIL ?? "CONTACT_NOTIFICATION_EMAIL missing",
      },
      {
        label: "Portal API URL",
        value: process.env.COURSE_API_BASE_URL ?? "COURSE_API_BASE_URL missing",
      },
    ],
  },
];

export const homepageSectionConfigs: AdminHomepageSectionConfig[] = [
  {
    id: "announcement",
    label: "Announcement banner",
    route: "/admin/content/banner",
    status: activeAnnouncement ? "live" : "hidden",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Top-of-site campaign, cohort, or urgent update banner.",
  },
  {
    id: "hero-slideshow",
    label: "Hero slideshow",
    route: "/admin/content/hero-slides",
    status: heroSlides.length ? "live" : "hidden",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Full-screen story and programme slides with CTAs.",
  },
  {
    id: "marquee",
    label: "Marquee ticker",
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Rotating stats, calls to action, news headlines, and partner logos.",
  },
  {
    id: "impact-counter",
    label: "Impact counter",
    route: "/admin/content/impact-stats",
    status: impactOverviewContent.stats.length ? "live" : "planned",
    collection: FIREBASE_COLLECTIONS.impactStats,
    description: "Homepage count-up proof metrics and impact snapshot.",
  },
  {
    id: "challenge-section",
    label: "Challenge section",
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Digital-divide narrative, statistics, comparison lists, and support CTA.",
  },
  {
    id: "mission-section",
    label: "Mission section",
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Vision and mission narrative, supporting image, CTA, and visibility.",
  },
  {
    id: "programme-showcase",
    label: "Programme showcase",
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Featured training, initiative, and pathway cards.",
  },
  {
    id: "articles",
    label: "Latest news & blog",
    route: "/admin/articles",
    status: getPublishedArticles().length ? "live" : "planned",
    collection: FIREBASE_COLLECTIONS.articles,
    description: "Latest published articles feeding the homepage grid.",
  },
  {
    id: "testimonials",
    label: "Testimonials carousel",
    route: "/admin/testimonials",
    status: testimonials.length ? "live" : "planned",
    collection: FIREBASE_COLLECTIONS.testimonials,
    description: "Selected learner and partner stories reused across the public site.",
  },
  {
    id: "partners",
    label: "Partner strip",
    route: "/admin/partners",
    status: partners.length ? "live" : "planned",
    collection: FIREBASE_COLLECTIONS.partners,
    description: "Partner logos and trust proof across the homepage.",
  },
  {
    id: "floating-elements",
    label: "Floating elements",
    route: "/admin/content/floating-elements",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Floating donate CTA, scroll actions, and exit-intent newsletter.",
  },
  {
    id: "join-cta",
    label: "Join CTA cards",
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Learner, organisation, and volunteer CTA cards displayed near the end of the homepage.",
  },
  {
    id: "donation",
    label: "Donation campaign",
    route: "/admin/content/donation-campaign",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Campaign progress, urgency, donor count, and giving CTAs.",
  },
  {
    id: "featured-story",
    label: "Featured story",
    route: "/admin/content/featured-story",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Video or written story block for homepage proof.",
  },
  {
    id: "newsletter",
    label: "Newsletter signup",
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: "Newsletter signup copy, interest tag, privacy note, and visibility toggle.",
  },
];

export const adminContentSections = {
  homepage: {
    title: "Homepage Builder",
    description: "Control the homepage modules, their visibility, ordering, and linked collection contracts.",
    sections: homepageSectionConfigs,
  },
  banner: {
    title: "Announcement Banner",
    description: "Schedule urgent notices, cohort windows, campaign messages, and CTA links.",
    sections: homepageSectionConfigs.filter((section) => section.id === "announcement"),
  },
  "hero-slides": {
    title: "Hero Slides",
    description: "Manage slide order, media, copy, overlay settings, and destination CTAs.",
    sections: homepageSectionConfigs.filter((section) => section.id === "hero-slideshow"),
  },
  "impact-stats": {
    title: "Impact Statistics",
    description: "Edit counter values, labels, proof descriptions, and report-linked metrics.",
    sections: homepageSectionConfigs.filter((section) => section.id === "impact-counter"),
  },
  "donation-campaign": {
    title: "Donation Campaign",
    description: "Manage campaign story, progress values, deadline, donor count, and CTA destinations.",
    sections: homepageSectionConfigs.filter((section) => section.id === "donation"),
  },
  "featured-story": {
    title: "Featured Story",
    description: "Control the homepage story/video proof module and testimonial references.",
    sections: homepageSectionConfigs.filter((section) => section.id === "featured-story"),
  },
  "floating-elements": {
    title: "Floating Elements",
    description: "Manage the floating donate button, scroll actions, and exit-intent newsletter state.",
    sections: homepageSectionConfigs.filter((section) => section.id === "floating-elements"),
  },
} as const;
