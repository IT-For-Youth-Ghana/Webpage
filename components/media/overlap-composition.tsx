import { RemoteImage } from "@/components/media/remote-image";
import { cn } from "@/lib/utils/cn";

type Plate = {
  /** Absent is a supported state: the plate renders MediaFallback at 16:9. */
  src?: string | null;
  alt: string;
  fallbackLabel?: string | null;
};

type Portrait = Plate & {
  /** Named people get a monogram, never a stock face. */
  fallbackVariant?: "wordmark" | "monogram";
};

type OverlapCompositionProps = {
  /** The place. Its lower-leading corner is covered; nothing may live there. */
  plate: Plate;
  /** The person. Omit and the composition degrades to a plain wide plate. */
  portrait?: Portrait;
  /** One caption for both images, because they are one figure. */
  caption?: string;
  /** Only ever true for the page's single above-the-fold image. */
  priority?: boolean;
  className?: string;
};

/** §5, row 8. Kept here so the frame widths and the sizes hints cannot drift. */
const PLATE_SIZES = "(min-width: 1024px) 62vw, 100vw";
const PORTRAIT_SIZES = "(min-width: 1024px) 26vw, 60vw";

/**
 * A 4:5 portrait overlapping the lower-leading corner of a 16:9 plate, as one
 * figure with one caption.
 *
 * The failure it prevents: the treatment is arithmetic, and composing
 * `WideFrame` beside `PortraitFigure` at a call site puts that arithmetic, and
 * the de-overlap below 1024px, into every consumer. Done by hand it drifts:
 * one page overlaps 18%, the next 26%, a third forgets the reserved space below
 * and the portrait is clipped by the following section. It also splits one
 * story across two `<figure>` elements with two captions, which tells a screen
 * reader there are two unrelated images when the point of the treatment is that
 * the place and the person are one subject.
 *
 * The geometry: the plate occupies the trailing 82% of the row, the portrait
 * the leading 33%, so they overlap by 15% of the row, which is 18.3% of the
 * plate's own width. The portrait then drops `translateY(12%)` past the plate's
 * lower edge, and the row reserves `mb-[5%]` (12% of the portrait's height,
 * expressed against the row's width) so the overhang has somewhere to go.
 *
 * The hard constraint, which no code can enforce: the plate must have nothing
 * of interest in its lower-leading corner, because the portrait covers it. This
 * treatment is chosen with the photograph in hand. It is not assigned by a
 * template.
 *
 * Below 1024px the overlap is removed rather than scaled down. A 33%-wide
 * portrait at 360px is 119px, which is not a portrait of anyone. The plate
 * comes first at full width, the portrait follows at two-thirds, and both stay
 * inside the same figure so the caption never separates from either.
 */
export function OverlapComposition({
  plate,
  portrait,
  caption,
  priority = false,
  className,
}: OverlapCompositionProps) {
  const hasPortrait = Boolean(portrait);

  return (
    <figure className={cn("m-0", className)}>
      <div className={cn("relative", hasPortrait && "lg:mb-[5%]")}>
        <div
          className={cn(
            "relative aspect-[16/9] overflow-hidden rounded-panel bg-brand-mist",
            // Room on the leading edge for the portrait to hang into. Without a
            // portrait the plate simply takes the full measure.
            hasPortrait && "lg:ms-[18%]",
          )}
        >
          <RemoteImage
            src={plate.src}
            alt={plate.alt}
            sizes={PLATE_SIZES}
            priority={priority}
            fallbackLabel={plate.fallbackLabel}
          />
        </div>

        {portrait ? (
          <div
            className={cn(
              // Stacked and static by default; the overlap is a desktop-only
              // composition, not a scaled-down version of itself.
              "relative mt-6 aspect-[4/5] w-2/3 overflow-hidden rounded-panel bg-brand-mist",
              "lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:w-[33%] lg:translate-y-[12%]",
            )}
          >
            <RemoteImage
              src={portrait.src}
              alt={portrait.alt}
              sizes={PORTRAIT_SIZES}
              fallbackLabel={portrait.fallbackLabel}
              fallbackVariant={portrait.fallbackVariant ?? "monogram"}
            />
          </div>
        ) : null}
      </div>

      {caption ? (
        <figcaption
          className={cn(
            "mt-6 max-w-[52ch] text-xs leading-6 text-brand-muted",
            hasPortrait && "lg:ms-[18%]",
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
