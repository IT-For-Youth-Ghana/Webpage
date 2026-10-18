import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type CircularFigureProps = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  /** Ring colour. The rim is what makes the crop read as deliberate. */
  accent?: string;
  caption?: string;
  /** Focal point, so a wide source crops to the subject rather than the centre. */
  objectPosition?: string;
  className?: string;
};

const sizes = {
  sm: "size-24",
  md: "size-40",
  lg: "size-[clamp(11rem,22vw,17rem)]",
};

/**
 * A circular media form, without the slideshow machinery of CapsuleMedia.
 *
 * The circular crop is the one treatment the orientation split does not touch:
 * it crops cleanly from a landscape or a portrait source, so it stays available
 * for any section regardless of which library it draws from. That makes it the
 * fallback to try before declaring a section unpairable.
 */
export function CircularFigure({
  src,
  alt,
  size = "md",
  accent = "var(--color-accent)",
  caption,
  objectPosition = "50% 40%",
  className,
}: CircularFigureProps) {
  return (
    <figure className={cn("m-0 flex flex-col items-center text-center", className)}>
      <div
        className={cn("relative overflow-hidden rounded-full bg-brand-mist", sizes[size])}
        style={{ boxShadow: `0 0 0 3px var(--color-bg), 0 0 0 5px ${accent}` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 20vw, 45vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs leading-6 text-brand-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
