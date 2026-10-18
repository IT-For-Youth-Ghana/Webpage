import { RemoteImage } from "@/components/media/remote-image";
import { cn } from "@/lib/utils/cn";

export type FilmstripFrame = {
  /** Absent is a supported state: the frame renders MediaFallback instead. */
  src?: string | null;
  alt: string;
  /** Says what this moment is. Never a restatement of the section heading. */
  caption?: string;
  /** Makes the frame a real link, which is also what makes it tabbable. */
  href?: string;
  /** What the typographic stand-in should say while the photograph is outstanding. */
  fallbackLabel?: string | null;
};

type FilmstripProps = {
  /** Five to twelve peers. Fewer than four is a cluster; use OffsetFrames. */
  frames: FilmstripFrame[];
  /** Accessible name for the scroll region. Required: an unnamed scroller is a trap. */
  label: string;
  /** Only ever true when this strip is the page's single above-the-fold image. */
  priorityFirst?: boolean;
  className?: string;
};

/** §5, row 7. Fixed so the strip and its `sizes` can never drift apart. */
const FRAME_SIZES = "(min-width: 1024px) 380px, 72vw";

/**
 * A horizontal scroll-snap row of 3:2 frames, each with its own caption.
 *
 * The failure it prevents: a set of 5–12 photographs that are peers has no
 * honest home in the existing primitives. `OffsetFrames` caps at three and
 * stacks vertically; a grid of equal photographs with no hierarchy is a contact
 * sheet, and the capsule's circle would claim one of them matters more than the
 * rest. Built ad hoc at a call site it becomes a carousel: JS state, arrow
 * buttons that are the only way to advance, and autoplay. This is native scroll
 * with no controller at all, so there is nothing to break and nothing to trap a
 * keyboard in.
 *
 * Accessibility, deliberately: the scroller carries `tabIndex={0}` and an
 * accessible name so a keyboard user can reach it and pan it with the arrow
 * keys (WCAG 2.1.1 for scrollable regions), and any frame given an `href` is a
 * real link that scroll-snaps itself fully into view when focused. The native
 * scrollbar is left visible on purpose: it is the affordance, and hiding it
 * would leave a pointer user with no indication the row continues.
 *
 * No motion of its own beyond a hover/focus lift, which resolves identically
 * under pointer, keyboard and `prefers-reduced-motion`.
 */
export function Filmstrip({ frames, label, priorityFirst = false, className }: FilmstripProps) {
  const visible = frames.filter((frame) => frame.alt?.trim());
  if (!visible.length) return null;

  return (
    <div
      role="group"
      aria-label={label}
      tabIndex={0}
      className={cn(
        // Native scroll is the whole mechanism. The trailing gutter lets the
        // last frame snap to the leading edge like every other one; without it
        // the strip stops short and the final caption is always half-read.
        "flex snap-x snap-mandatory gap-[clamp(0.75rem,1.6vw,1.5rem)] overflow-x-auto pb-4",
        "scroll-pl-[clamp(1rem,4vw,3.5rem)] scroll-pr-[clamp(1rem,4vw,3.5rem)]",
        "pe-[clamp(1rem,4vw,3.5rem)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary",
        className,
      )}
    >
      {visible.map((frame, index) => {
        const Frame = frame.href ? "a" : "div";

        return (
          <figure
            key={`${frame.src ?? "empty"}-${index}`}
            className="m-0 w-[72vw] max-w-[380px] flex-none snap-start scroll-mt-6 lg:w-[380px]"
          >
            <Frame
              {...(frame.href ? { href: frame.href } : {})}
              className={cn(
                "group block",
                frame.href &&
                  "rounded-media focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary",
              )}
            >
              <div
                className={cn(
                  "relative aspect-[3/2] overflow-hidden rounded-media bg-brand-mist",
                  // The same result from pointer, keyboard and click. Switched
                  // off entirely when the reader has asked for less motion.
                  "transition-transform duration-300 motion-reduce:transition-none",
                  frame.href && "group-hover:-translate-y-1 group-focus-visible:-translate-y-1",
                  "motion-reduce:transform-none",
                )}
              >
                <RemoteImage
                  src={frame.src}
                  alt={frame.alt}
                  sizes={FRAME_SIZES}
                  priority={priorityFirst && index === 0}
                  fallbackLabel={frame.fallbackLabel}
                />
              </div>
            </Frame>
            {frame.caption ? (
              <figcaption className="mt-3 text-xs leading-6 text-brand-muted">
                {frame.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
