import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

import {
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type { ArticleSeed } from "@/types/content";

type ArticleCardProps = {
  article: ArticleSeed;
  variant?: "standard" | "featured" | "compact";
};

function articleHref(article: ArticleSeed) {
  return `/news-and-updates/${article.category}/${article.slug}`;
}

function ArticleMeta({ article }: { article: ArticleSeed }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-brand-accent" />
        {formatDate(article.publishedAt)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5 text-brand-accent" />
        {getArticleReadTime(article)} min read
      </span>
    </div>
  );
}

export function ArticleCard({
  article,
  variant = "standard",
}: ArticleCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Link
      href={articleHref(article)}
      className={`group block overflow-hidden border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel ${
        isFeatured ? "rounded-[34px]" : "rounded-[28px]"
      }`}
    >
      <div className={isFeatured ? "grid lg:grid-cols-[0.52fr_0.48fr]" : ""}>
        <div
          className={`relative overflow-hidden bg-brand-mist ${
            isFeatured ? "min-h-[23rem] lg:min-h-full" : isCompact ? "h-44" : "h-60"
          }`}
        >
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.coverAlt ?? article.title}
              fill
              sizes={isFeatured ? "(max-width: 1023px) 100vw, 52vw" : "(max-width: 1023px) 100vw, 33vw"}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-hero-grid" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/55 via-brand-deep/12 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-deep">
            {getArticleLabel(article)}
          </div>
        </div>

        <div className={`flex flex-col ${isFeatured ? "justify-between p-8 lg:p-10" : "p-6"}`}>
          <div className="space-y-4">
            <ArticleMeta article={article} />
            <div className="space-y-3">
              <h2
                className={`font-heading font-bold leading-snug text-brand-ink transition group-hover:text-brand-deep ${
                  isFeatured ? "text-4xl" : isCompact ? "text-2xl" : "text-3xl"
                }`}
              >
                {article.title}
              </h2>
              <p
                className={`leading-7 text-slate-600 ${
                  isFeatured ? "text-lg" : "text-base"
                }`}
              >
                {article.excerpt}
              </p>
            </div>

            {article.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, isFeatured ? 4 : 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-border bg-brand-mist/65 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-deep">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
