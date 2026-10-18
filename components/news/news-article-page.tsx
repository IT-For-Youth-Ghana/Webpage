import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Tags,
  UserRound,
} from "lucide-react";

import { ArticleCard } from "@/components/news/article-card";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import {
  articleCategoryLabels,
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type { ArticleSeed } from "@/types/content";

type NewsArticlePageProps = {
  article: ArticleSeed;
  relatedArticles: ArticleSeed[];
};

function getArticleHtml(article: ArticleSeed) {
  if (article.contentHtml) {
    return article.contentHtml;
  }

  return article.content.map((paragraph) => `<p>${paragraph}</p>`).join("");
}

export function NewsArticlePage({
  article,
  relatedArticles,
}: NewsArticlePageProps) {
  return (
    <article className="bg-white">
      <EditorialImageHero
        imageSrc={article.coverImage || "/images/randomPictures/groupworkstudents.jpg"}
        imageAlt={article.coverAlt ?? article.title}
        eyebrow={`${getArticleLabel(article)}${article.featured ? " · Featured" : ""}`}
        title={article.title}
        description={article.excerpt}
        supportingText={`${formatDate(article.publishedAt)} · ${getArticleReadTime(article)} min read${article.author?.name ? ` · ${article.author.name}` : ""}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News & Updates", href: "/news-and-updates" },
          { label: articleCategoryLabels[article.category], href: `/news-and-updates/${article.category}` },
          { label: "Article" },
        ]}
        ctas={[{ label: `Back to ${articleCategoryLabels[article.category].toLowerCase()}`, href: `/news-and-updates/${article.category}`, variant: "secondary" }]}
        priority
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.72fr_0.28fr] lg:px-8">
        <div className="min-w-0">
          <div className="rounded-[34px] border border-brand-border bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {/* Static seed HTML now. Sanitize CMS/TipTap HTML before it reaches this renderer. */}
            <div
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: getArticleHtml(article) }}
            />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          {article.author ? (
            <div className="rounded-[30px] border border-brand-border bg-brand-mist/45 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                Author
              </p>
              <div className="mt-5 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
                  {article.author.avatar ? (
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-deep text-brand-accent">
                      <UserRound className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-brand-ink">
                    {article.author.name}
                  </h2>
                  <p className="text-base font-medium text-slate-600">
                    {article.author.role}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {article.tags?.length ? (
            <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-deep text-brand-accent">
                  <Tags className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                    Tags
                  </p>
                  <h2 className="font-heading text-2xl font-bold text-brand-ink">
                    Article topics
                  </h2>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-border bg-brand-mist/65 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[30px] border border-brand-border bg-brand-warm p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-deep text-brand-accent">
              <Mail className="h-4 w-4" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
              Stay close to the next update
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              The newsletter route is already scaffolded across the site, ready to connect programme openings, stories, and partner news.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-deep px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Contact the team
            </Link>
          </div>
        </aside>
      </section>

      {relatedArticles.length ? (
        <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-accent">
                  Keep reading
                </p>
                <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
                  Related updates and reflections
                </h2>
              </div>
              <Link
                href="/news-and-updates"
                className="rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-bold text-brand-deep transition hover:border-brand-accent"
              >
                View all updates
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.slug}
                  article={relatedArticle}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
