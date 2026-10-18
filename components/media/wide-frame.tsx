import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type WideFrameProps = {
  src: string;
  alt: string;
  /** Short caption. Adds meaning; omit rather than restating the heading. */
  caption?: string;
  ratio?: "wide" | "cinema";
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * A landscape frame, sized to sit above a text column.
 *
 * The second wide treatment: where a band is full-bleed and atmospheric, this
 * is a contained editorial plate that gives a text block something to open
 * against without spanning the viewport.
 */
export function WideFrame({
  src,
  alt,
  caption,
  ratio = "wide",
  priority = false,
  sizes = "(min-width: 1024px) 70vw, 100vw",
  className,
}: WideFrameProps) {
  return (
    <figure className={cn("m-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-panel bg-brand-mist",
          ratio === "cinema" ? "aspect-[21/9]" : "aspect-[16/9]",
        )}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-6 text-brand-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
