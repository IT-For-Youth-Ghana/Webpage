import Image from "next/image";
import Link from "next/link";

import { MediaFallback } from "@/components/media/media-fallback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type EditorialHeroBreadcrumb = {
  label: string;
  href?: string;
};

export type EditorialHeroCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "primaryBlue";
};

export type EditorialImageHeroProps = {
  imageSrc?: string | null;
  imageAlt: string;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  supportingText?: string | null;
  breadcrumbs?: EditorialHeroBreadcrumb[];
  ctas?: EditorialHeroCta[];
  imagePosition?: string;
  priority?: boolean;
  className?: string;
};

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

/**
 * A reusable, image-led page hero with an editorial content card anchored to
 * the bottom-left corner of the photograph. Empty optional content is
 * removed along with its wrapper so CMS deletions never leave decorative
 * boxes behind.
 */
export function EditorialImageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  supportingText,
  breadcrumbs = [],
  ctas = [],
  imagePosition = "center",
  priority = false,
  className,
}: EditorialImageHeroProps) {
  const visibleImage = hasText(imageSrc) ? imageSrc : null;
  const visibleBreadcrumbs = breadcrumbs.filter((crumb) => hasText(crumb.label));
  const visibleCtas = ctas.filter((cta) => hasText(cta.label) && hasText(cta.href));
  const hasPanel =
    hasText(eyebrow) ||
    hasText(title) ||
    hasText(description) ||
    hasText(supportingText);
  const hasHeroContent = hasPanel || visibleCtas.length > 0;

  return (
    <section className={cn("relative overflow-hidden bg-white", className)}>
      <div className="relative min-h-[34rem] sm:min-h-[40rem] lg:min-h-[46rem]">
        {visibleImage ? (
          <Image
            src={visibleImage}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        ) : (
          /**
           * No photograph is still a designed hero, not a navy void.
           *
           * The empty state used to collapse to an 18rem block of brand-deep
           * with the scrim laid over nothing, so a page whose heroImage had not
           * been filled in shipped a shorter, emptier hero than every other
           * page and nobody could tell it was unfinished.
           */
          <MediaFallback label={title ?? undefined} tone="dark" />
        )}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,39,0.38)_0%,rgba(7,20,39,0.08)_42%,rgba(7,20,39,0.58)_100%)]"
          aria-hidden="true"
        />

        {visibleBreadcrumbs.length > 0 ? (
          <div className="absolute inset-x-0 top-0 z-10">
            <nav
              aria-label="Breadcrumb"
              className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-7 text-sm font-medium text-white sm:px-6 lg:px-8 lg:pt-9"
            >
              {visibleBreadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 ? <span className="text-white/55">/</span> : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded-sm text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        ) : null}

        {hasHeroContent ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 sm:bottom-6 lg:bottom-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="pointer-events-auto w-full sm:max-w-xl">
                {hasPanel ? (
                  <div className="border-l-4 border-brand-accent bg-brand-deep/90 px-6 py-7 text-white shadow-editorial backdrop-blur-xl backdrop-saturate-150 sm:px-8 sm:py-9">
                    {hasText(eyebrow) ? (
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-brand-accent">
                        {eyebrow}
                      </p>
                    ) : null}

                    {hasText(title) ? (
                      <h1 className="font-heading text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                        {title}
                      </h1>
                    ) : null}

                    {hasText(description) ? (
                      <p className={cn("text-lg leading-8 text-white/90", hasText(title) && "mt-5")}>
                        {description}
                      </p>
                    ) : null}

                    {hasText(supportingText) ? (
                      <p className="mt-3 text-base leading-6 text-white/75">{supportingText}</p>
                    ) : null}
                  </div>
                ) : null}

                {visibleCtas.length > 0 ? (
                  <div className={cn("flex flex-wrap gap-3", hasPanel && "mt-4")}>
                      {visibleCtas.map((cta) => (
                        <Button
                          key={`${cta.href}-${cta.label}`}
                          href={cta.href}
                          variant={cta.variant === "secondary" ? "white-outline" : cta.variant === "primaryBlue" ? "solid-blue" : "solid-pink"}
                          size="lg"
                        >
                          {cta.label}
                        </Button>
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
