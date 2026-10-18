import Link from "next/link";
import { FileText, Newspaper, Pencil, Rss } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  NEWS_PAGE_SLUGS,
  newsPageLabels,
  newsPagePreviewPaths,
} from "@/lib/cms/news-pages";

const icons = {
  hub: Rss,
  news: Newspaper,
  blogs: FileText,
};

export default function AdminNewsAndUpdatesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="News CMS"
        title="News & Updates"
        description="Manage the public news hub and listing page copy. Use Articles for individual news and blog posts."
        primaryAction={{ label: "Create article", href: "/admin/articles/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {NEWS_PAGE_SLUGS.map((slug) => {
          const Icon = icons[slug];

          return (
            <article
              key={slug}
              className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-deep text-brand-accent">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                News page
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
                {newsPageLabels[slug]}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {newsPagePreviewPaths[slug]}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/admin/news-and-updates/${slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
                <Link
                  href={newsPagePreviewPaths[slug]}
                  className="inline-flex items-center rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink"
                >
                  Preview
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-brand-ink">Article manager</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Individual article CRUD, status, feature flags, article HTML, SEO fields, and publish dates live in the existing Articles manager.
        </p>
        <Link
          href="/admin/articles"
          className="mt-5 inline-flex items-center rounded-full border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-ink"
        >
          Open articles
        </Link>
      </div>
    </div>
  );
}
