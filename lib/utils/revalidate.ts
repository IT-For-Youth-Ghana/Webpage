export const revalidationMap: Record<string, string[]> = {
  homepage: ["/"],
  /* The donation campaign appears in the homepage block AND on /donate, and had
     no entry at all, so saving it revalidated nothing and edits stayed
     invisible until the next deploy. */
  donationCampaign: ["/", "/donate"],
  initiative: ["/what-we-do"],
  organisation: ["/for-organisations"],
  partnership: ["/partner-with-us"],
  newsPage: ["/news-and-updates", "/news-and-updates/news", "/news-and-updates/blogs", "/sitemap.xml"],
  article: ["/news-and-updates", "/news-and-updates/news", "/news-and-updates/blogs", "/sitemap.xml"],
  department: ["/departments", "/sitemap.xml"],
  team: ["/who-we-are/team"],
  partners: ["/who-we-are/partners"],
  testimonials: ["/our-impact/testimonials"],
  job: ["/who-we-are/careers"],
  impactStats: ["/", "/our-impact", "/our-impact/reports"],
  impactPage: ["/our-impact", "/our-impact/reports", "/our-impact/testimonials", "/our-impact/sdgs", "/sitemap.xml"],
  settings: ["/", "/contact", "/sitemap.xml"],
  sitePage: ["/sitemap.xml"],
  whoWeAreDynamicPage: ["/who-we-are", "/sitemap.xml"],
  whatWeDoDynamicPage: ["/what-we-do", "/sitemap.xml"],
};

export function getRevalidationPaths(contentType: string, slug?: string) {
  const paths = new Set(revalidationMap[contentType] ?? []);

  if (slug) {
    if (contentType === "initiative") {
      paths.add(`/what-we-do/${slug}`);
    }

    if (contentType === "organisation") {
      paths.add(`/for-organisations/${slug}`);
    }

    if (contentType === "partnership") {
      paths.add(`/partner-with-us/${slug}`);
    }

    if (contentType === "article") {
      paths.add(`/news-and-updates/news/${slug}`);
      paths.add(`/news-and-updates/blogs/${slug}`);
      paths.add("/news-and-updates");
      paths.add("/");
    }

    if (contentType === "department") {
      paths.add(`/departments/${slug}`);
      paths.add("/departments");
    }

    if (contentType === "newsPage") {
      const newsPagePaths: Record<string, string> = {
        hub: "/news-and-updates",
        news: "/news-and-updates/news",
        blogs: "/news-and-updates/blogs",
      };

      paths.add(newsPagePaths[slug] ?? `/news-and-updates/${slug}`);
    }

    if (contentType === "sitePage") {
      const sitePagePaths: Record<string, string> = {
        "who-we-are": "/who-we-are",
        "apply-for-training": "/apply-for-training",
        "apply-for-training-who-can-apply": "/apply-for-training/who-can-apply",
        "apply-for-training-how-it-works": "/apply-for-training/how-it-works",
        "apply-for-training-courses": "/apply-for-training/courses",
        team: "/who-we-are/team",
        partners: "/who-we-are/partners",
        careers: "/who-we-are/careers",
        testimonials: "/our-impact/testimonials",
      };

      paths.add(sitePagePaths[slug] ?? `/${slug}`);
    }

    if (contentType === "whoWeAreDynamicPage") {
      paths.add(`/who-we-are/${slug}`);
      paths.add("/who-we-are");
    }

    if (contentType === "whatWeDoDynamicPage") {
      paths.add(`/what-we-do/${slug}`);
      paths.add("/what-we-do");
    }

    if (contentType === "impactPage") {
      const impactPagePaths: Record<string, string> = {
        overview: "/our-impact",
        reports: "/our-impact/reports",
        testimonials: "/our-impact/testimonials",
        sdgs: "/our-impact/sdgs",
      };

      paths.add(impactPagePaths[slug] ?? `/our-impact/${slug}`);
    }
  }

  return Array.from(paths);
}

export function isValidRevalidationSecret(secret?: string | null) {
  const expected = process.env.REVALIDATION_SECRET;
  return Boolean(secret && expected && secret === expected);
}
