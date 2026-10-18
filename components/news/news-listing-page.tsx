import Link from "next/link";
import { ArrowRight, Tags } from "lucide-react";

import { ArticleCard } from "@/components/news/article-card";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  articleCategoryLabels,
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type {
  ArticleCategoryContent,
  ArticleSeed,
} from "@/types/content";

type NewsListingPageProps = {
  content: ArticleCategoryContent;
  articles: ArticleSeed[];
  tags: string[];
};

export function NewsListingPage({
  content,
  articles,
  tags,
}: NewsListingPageProps) {
  const leadArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={content.heroImage}
        imageAlt={`${articleCategoryLabels[content.category]} listing`}
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News & Updates", href: "/news-and-updates" },
          { label: articleCategoryLabels[content.category] },
        ]}
        ctas={[{ label: content.heroCtaLabel, href: "/news-and-updates", variant: "secondary" }]}
        priority
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {leadArticle ? (
          <div className="space-y-10">
            <SectionHeading
              eyebrow={content.leadSectionEyebrow}
              title={content.leadSectionTitle}
              description={content.leadSectionDescription}
            />
            <ArticleCard article={leadArticle} variant="featured" />
          </div>
        ) : (
          <div className="rounded-[32px] border border-brand-border bg-brand-mist/45 p-10 text-center">
            <p className="text-base font-semibold text-slate-600">{content.emptyState}</p>
          </div>
        )}
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.76fr_0.24fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              eyebrow={content.archiveSectionEyebrow}
              title={content.archiveSectionTitle}
              description={content.archiveSectionDescription}
            />

            <div className="grid gap-6 md:grid-cols-2">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>

          <aside className="sticky top-32 rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-deep text-brand-accent">
                <Tags className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                  {content.topicsSectionEyebrow}
                </p>
                <h2 className="font-heading text-2xl font-bold text-brand-ink">
                  {content.topicsSectionTitle}
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand-border bg-brand-mist/65 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-7 border-t border-brand-border pt-6">
              <p className="text-base leading-7 text-slate-600">
                {content.topicsSectionDescription}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {leadArticle ? (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-brand-border bg-brand-deep p-8 text-white lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-center">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-accent">
                  {content.latestSignalEyebrow}
                </p>
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                  {leadArticle.title}
                </h2>
                <p className="max-w-3xl text-base leading-7 text-white/72">
                  {getArticleLabel(leadArticle)} published on {formatDate(leadArticle.publishedAt)}. Estimated reading time:{" "}
                  {getArticleReadTime(leadArticle)} minutes.
                </p>
              </div>
              <Link
                href={`/news-and-updates/${leadArticle.category}/${leadArticle.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {content.latestSignalCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
