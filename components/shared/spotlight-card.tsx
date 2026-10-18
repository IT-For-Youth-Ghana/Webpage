import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type SpotlightCardProps = {
  image?: string | null;
  imageAlt?: string | null;
  accentColor?: string;
  categoryLabel?: string;
  title: string;
  excerpt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

/**
 * SpotlightCard — Camfed-inspired card with accent bar, image, label, title, excerpt and CTA.
 * Degrades gracefully when image/category/cta are absent.
 */
export function SpotlightCard({
  image,
  imageAlt,
  accentColor = "var(--color-accent)",
  categoryLabel,
  title,
  excerpt,
  ctaLabel,
  ctaHref,
  className,
}: SpotlightCardProps) {
  return (
    <article className={cn("overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-sm", className)}>
      {/* Accent bar */}
      <div aria-hidden="true" style={{ background: accentColor, height: 6 }} />

      {/* Image */}
      {image ? (
        <div className="relative aspect-[16/9] w-full">
          <Image src={image} alt={imageAlt || title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
      ) : null}

      <div className="p-6">
        {categoryLabel ? (
          <span className="inline-flex rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-deep">
            {categoryLabel}
          </span>
        ) : null}

        <h3 className={cn("mt-3 font-heading text-2xl font-bold text-brand-ink", categoryLabel && "mt-4")}>{title}</h3>

        {excerpt ? (
          <p className="mt-3 text-base leading-7 text-slate-600">{excerpt}</p>
        ) : null}

        {ctaLabel && ctaHref ? (
          <div className="mt-5">
            <Button href={ctaHref} variant="pink" size="lg">
              {ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
