import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import {
  getCmsArticles,
  getCmsArticleTags,
} from "@/lib/cms/articles";
import {
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";
import type { ArticleSeed } from "@/types/content";

const articleColumns: AdminTableColumn<ArticleSeed>[] = [
  {
    key: "title",
    label: "Article",
    render: (article) => (
      <div>
        <p className="font-bold text-slate-950">{article.title}</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{article.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(article.tags ?? []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "category",
    label: "Type",
    render: (article) => (
      <div className="space-y-2">
        <AdminStatusPill status={article.status ?? "published"} />
        <p className="text-sm font-bold text-slate-700">{getArticleLabel(article)}</p>
      </div>
    ),
  },
  {
    key: "publishedAt",
    label: "Published",
    render: (article) => (
      <div>
        <p className="font-semibold text-slate-800">{formatDate(article.publishedAt)}</p>
        <p className="mt-1 text-sm text-slate-500">{getArticleReadTime(article)} min read</p>
      </div>
    ),
  },
  {
    key: "author",
    label: "Author",
    render: (article) => (
      <div>
        <p className="font-semibold text-slate-800">{article.author?.name ?? "ITFY Team"}</p>
        <p className="mt-1 text-sm text-slate-500">{article.author?.role ?? "Editorial"}</p>
      </div>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (article) => (
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/articles/${article.id ?? article.slug}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <Link
          href={`/news-and-updates/${article.category}/${article.slug}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>
      </div>
    ),
  },
];

export default async function AdminArticlesPage() {
  const [articles, tags] = await Promise.all([
    getCmsArticles({ includeDrafts: true }),
    getCmsArticleTags(),
  ]);
  const publishedArticles = articles.filter(
    (article) => article.status !== "draft" && article.status !== "archived",
  );
  const articleMetrics: AdminMetric[] = [
    {
      label: "Total records",
      value: String(articles.length),
      description: "Articles resolved through the CMS integration, with seed fallback when Firestore is unavailable.",
      status: "active",
    },
    {
      label: "Published",
      value: String(publishedArticles.length),
      description: "Records currently available to public news and blog routes.",
      status: "published",
    },
    {
      label: "Topics",
      value: String(tags.length),
      description: "Unique tags ready for future filter and type-ahead controls.",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="News & blog CMS"
        title="Article manager"
        description="A seeded management view for news and blog content. The table already mirrors the planned Firestore document contract: status, category, tags, author, publish date, SEO-ready metadata, and rendered content."
        primaryAction={{ label: "Create article", href: "/admin/articles/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {articleMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={articleColumns} rows={articles} />
    </div>
  );
}
