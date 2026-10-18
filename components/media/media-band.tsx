import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type MediaBandProps = {
  src: string;
  /** What is happening in the photograph, not a restatement of the heading. */
  alt: string;
  /** Overlaid content. Omit for a pure band. */
  children?: ReactNode;
  height?: "short" | "tall";
  /** Darkens the photograph so overlaid text stays legible. */
  scrim?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * A full-bleed landscape band.
 *
 * The widest of the wide treatments, and the right default for programme
 * content: the library is roughly 30:1 landscape, so a band uses the shape the
 * photography actually is instead of cropping a wide frame into a tall hole.
 *
 * See docs/addendum-media-pairing.md for the orientation constraint.
 */
export function MediaBand({
  src,
  alt,
  children,
  height = "short",
  scrim = true,
  priority = false,
  className,
}: MediaBandProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <div className={cn("relative w-full", height === "tall" ? "min-h-[32rem]" : "min-h-[20rem]")}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={priority}
          className="object-cover"
        />
        {scrim ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-brand-deep/88 via-brand-deep/62 to-brand-deep/30"
          />
        ) : null}

        {children ? (
          <div className="relative mx-auto flex min-h-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl">{children}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
