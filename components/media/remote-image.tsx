import Image from "next/image";

import { MediaFallback } from "@/components/media/media-fallback";
import { resolveImageSrc } from "@/lib/media/remote-image";
import { cn } from "@/lib/utils/cn";

type RemoteImageProps = {
  /** A URL from the CMS or the course API, or a repository-relative path. */
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Shown by the typographic stand-in when there is no usable image. */
  fallbackLabel?: string | null;
  fallbackVariant?: "wordmark" | "monogram";
};

/**
 * A fill-positioned image whose src came from outside the repository.
 *
 * Callers must not decide for themselves whether a host is optimisable. Two
 * components used to keep private copies of the host allowlist and quietly
 * swapped in a grey placeholder.svg on a miss, which meant an unlisted host
 * looked like missing content rather than a configuration gap. This routes
 * every such image through one contract and renders the typographic stand-in
 * when the URL is unusable.
 *
 * The parent must be positioned and must set the aspect ratio: this fills it.
 */
export function RemoteImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  fallbackLabel,
  fallbackVariant = "wordmark",
}: RemoteImageProps) {
  const resolved = resolveImageSrc(src);

  if (!resolved) {
    return <MediaFallback label={fallbackLabel} variant={fallbackVariant} />;
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
