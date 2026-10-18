import type { MetadataRoute } from "next";

import { getTrainingCatalogMixed } from "@/lib/api/training";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getCmsDepartments } from "@/lib/cms/departments";
import { getCmsInitiatives } from "@/lib/cms/initiatives";
import {
  getCmsTrainingCoursesPage,
  getCmsWhatWeDoDynamicPages,
  getCmsWhoWeAreDynamicPages,
} from "@/lib/cms/site-pages";
import { organisationServices } from "@/lib/content/organisation-config";
import { partnershipTracks } from "@/lib/content/partnership-config";

const ORIGIN = "https://itforyouthghana.org";

/**
 * Static public routes, written out rather than derived from publicNavigation.
 *
 * The navigation is an editorial choice about what to surface in a menu, not a
 * list of what exists. /our-impact reached the sitemap only through the
 * publicNavigation spread, so removing it from the menu would have quietly
 * removed the impact hub from search as well. app/routes.test.ts now checks
 * this list against the route files in both directions.
 */
const STATIC_ROUTES = [
  "/",
  "/who-we-are",
  "/who-we-are/team",
  "/who-we-are/partners",
  "/who-we-are/careers",
  "/what-we-do",
  "/departments",
  "/apply-for-training",
  "/apply-for-training/who-can-apply",
  "/apply-for-training/how-it-works",
  "/apply-for-training/courses",
  "/for-organisations",
  "/partner-with-us",
  "/our-impact",
  "/our-impact/reports",
  "/our-impact/testimonials",
  "/our-impact/sdgs",
  "/news-and-updates",
  "/news-and-updates/news",
  "/news-and-updates/blogs",
  "/programs",
  "/contact",
  "/donate",
];

type Entry = { path: string; lastModified?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coursesPage = await getCmsTrainingCoursesPage();

  const [articles, departments, whoWeArePages, whatWeDoPages, initiatives, courses] =
    await Promise.all([
      getCmsPublishedArticles(),
      getCmsDepartments(),
      getCmsWhoWeAreDynamicPages(),
      getCmsWhatWeDoDynamicPages(),
      getCmsInitiatives(),
      /**
       * The same resolver the canonical course route uses, so the sitemap
       * cannot advertise a slug the page would 404 on, or omit one it serves.
       * It falls back to the seed catalogue when the portal API is unreachable,
       * so a bad API day empties no part of the sitemap.
       */
      getTrainingCatalogMixed(coursesPage.courses),
    ]);

  const entries: Entry[] = [
    ...STATIC_ROUTES.map((path) => ({ path })),
    ...initiatives.map((page) => ({ path: `/what-we-do/${page.slug}` })),
    ...organisationServices.map((page) => ({ path: `/for-organisations/${page.slug}` })),
    ...partnershipTracks.map((page) => ({ path: `/partner-with-us/${page.slug}` })),
    ...departments.map((department) => ({ path: `/departments/${department.slug}` })),
    ...whoWeArePages.map((page) => ({ path: `/who-we-are/${page.slug}` })),
    ...whatWeDoPages.map((page) => ({ path: `/what-we-do/${page.slug}` })),
    ...courses
      .map((course) => course.slug || course.id)
      .filter(Boolean)
      .map((slug) => ({ path: `/apply-for-training/courses/${slug}` })),
    /**
     * Articles are the only records carrying a real modification date, so they
     * are the only entries that claim one. Every entry used to report
     * new Date(), which told crawlers the whole site had changed on every
     * fetch. A date that is always now carries no information and trains a
     * crawler to ignore the field.
     */
    ...articles.map((article) => ({
      path: `/news-and-updates/${article.category}/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
    })),
  ];

  const seen = new Map<string, Entry>();
  for (const entry of entries) {
    const existing = seen.get(entry.path);
    if (!existing || (!existing.lastModified && entry.lastModified)) seen.set(entry.path, entry);
  }

  return Array.from(seen.values())
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((entry) => ({
      url: `${ORIGIN}${entry.path}`,
      ...(entry.lastModified ? { lastModified: new Date(entry.lastModified) } : {}),
    }));
}
