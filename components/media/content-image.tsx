import Image from "next/image";

import { MediaFallback } from "@/components/media/media-fallback";
import { cn } from "@/lib/utils/cn";

type ContentImageProps = {
  src?: string | null;
  alt: string;
  /** `fill` keeps no ratio of its own; the parent must give the slot a height. */
  aspectRatio?: "landscape" | "portrait" | "square" | "wide" | "fill";
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  overlay?: boolean;
  sizes?: string;
  /** Stands in for the photograph when the content system has none yet. */
  fallbackLabel?: string | null;
  fallbackVariant?: "wordmark" | "monogram";
};

const aspectClasses = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
  fill: "h-full",
};

/**
 * Consistent editorial media treatment.
 *
 * With no src the slot renders a considered typographic composition at the same
 * proportions rather than a gradient, so a missing photograph reads as an
 * outstanding asset instead of a design decision nobody will revisit.
 */
export function ContentImage({
  src,
  alt,
  aspectRatio = "landscape",
  priority = false,
  className,
  imageClassName,
  overlay = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  fallbackLabel,
  fallbackVariant = "wordmark",
}: ContentImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-media bg-brand-mist", aspectClasses[aspectRatio], className)}>
      {src?.trim() ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover transition duration-700", imageClassName)}
        />
      ) : (
        <MediaFallback label={fallbackLabel} variant={fallbackVariant} />
      )}
      {overlay ? <div className="absolute inset-0 bg-brand-deep/20" aria-hidden="true" /> : null}
    </div>
  );
}
