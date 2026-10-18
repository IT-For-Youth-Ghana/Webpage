import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type PortraitFigureProps = {
  src: string;
  alt: string;
  name?: string;
  role?: string;
  /** Identity colour for the rule under the name. */
  accent?: string;
  priority?: boolean;
  className?: string;
};

/**
 * A portrait frame, for people.
 *
 * Portrait is reserved for people content, where the library runs about 16:1 in
 * portrait's favour and portrait is the honest shape for the subject: team
 * profiles, named testimonials, graduate stories. Programme content gets the
 * wide treatments instead. See docs/addendum-media-pairing.md.
 */
export function PortraitFigure({
  src,
  alt,
  name,
  role,
  accent = "var(--color-accent)",
  priority = false,
  className,
}: PortraitFigureProps) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-panel bg-brand-mist">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      {name || role ? (
        <figcaption className="mt-4">
          <span aria-hidden="true" className="block h-[3px] w-9 rounded-capsule" style={{ backgroundColor: accent }} />
          {name ? <p className="mt-3 font-heading text-lg font-bold text-brand-ink">{name}</p> : null}
          {role ? <p className="mt-1 text-base text-brand-muted">{role}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
