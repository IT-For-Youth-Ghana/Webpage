import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type { ArticleSeed } from "@/types/content";

type LatestNewsGridProps = {
  articles: ArticleSeed[];
};

export function LatestNewsGrid({ articles }: LatestNewsGridProps) {
  const latest = [...articles]
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    )
    .slice(0, 3);
  if (!latest.length) return null;

  return (
    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-heading text-5xl font-bold leading-none text-brand-ink sm:text-6xl lg:text-7xl">
              Latest news &amp; blog
            </h2>
            <p className="mt-5 max-w-2xl font-heading text-2xl font-bold leading-tight text-brand-ink sm:text-3xl">
              Fresh updates from the people and programmes shaping our work
            </p>
            <p className="mt-4 max-w-2xl text-base leading-[1.8] text-slate-500">
              Follow new opportunities, learner stories, programme milestones, and ideas
              from across the IT For Youth Ghana community.
            </p>
          </div>
          <Button
            href="/news-and-updates"
            variant="blue-outline"
          >
            View all updates
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {latest.map((article) => (
            <Link
              key={article.slug}
              href={`/news-and-updates/${article.category}/${article.slug}`}
              className="group overflow-hidden rounded-panel border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
            >
              <div className="relative h-56 overflow-hidden bg-brand-mist">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-hero-grid" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/45 via-brand-deep/10 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-deep">
                  {getArticleLabel(article)}
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span className="h-1 w-1 rounded-full bg-brand-accent" />
                  <span>{getArticleReadTime(article)} min read</span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold leading-snug text-brand-ink transition group-hover:text-brand-deep">
                    {article.title}
                  </h3>
                  <p className="overflow-hidden text-base leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                    {article.excerpt}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
