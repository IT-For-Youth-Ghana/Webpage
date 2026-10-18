"use client";

import {
  CapsuleActions,
  CapsuleContent,
  CapsuleMedia,
  CapsuleShell,
  CapsuleStage,
  SlideshowControls,
  useSlideshow,
} from "@/components/capsule";
import { safeCssColor } from "@/lib/utils/css-color";
import type { HeroSlide } from "@/types/content";

/* Fallbacks are existing palette values, so a slide with missing or malformed
   colours degrades to the brand look rather than to a transparent wash. */
const FALLBACK_ACCENT = "#1E72BA";
const FALLBACK_OVERLAY_FROM = "rgba(10,15,40,0.88)";
const FALLBACK_OVERLAY_TO = "rgba(10,15,40,0.35)";

type HeroCapsuleSlideshowProps = {
  slides: HeroSlide[];
  interval?: number;
};

/**
 * The homepage hero.
 *
 * Composition only. Every part is a shared primitive, so a future page can
 * take the shell with static content and no slideshow, or wrap the controller
 * around something that is not a hero.
 *
 * Advancing a slide keeps the capsule and changes what is inside it, rather
 * than re-forming or morphing the shape. The deciding constraint is fast
 * clicking: a re-forming shell strobes, and a morphing shell gets interrupted
 * mid-transition and parks in states nobody designed. A stable stadium also
 * keeps the action buttons from moving under the pointer. Slide identity is
 * carried instead by things that change without moving geometry: the blurred
 * shell background, the eyebrow rule, the active pager bar and the ring.
 */
export function HeroCapsuleSlideshow({ slides, interval = 6000 }: HeroCapsuleSlideshowProps) {
  const {
    index,
    progress,
    isPaused,
    canAutoplay,
    goTo,
    next,
    previous,
    togglePause,
    containerProps,
  } = useSlideshow({ count: slides.length, interval });

  if (!slides.length) return null;

  const slide = slides[index] ?? slides[0]!;
  const accent = safeCssColor(slide.accent, FALLBACK_ACCENT);
  const overlayFrom = safeCssColor(slide.overlayFrom, FALLBACK_OVERLAY_FROM);
  const overlayTo = safeCssColor(slide.overlayTo, FALLBACK_OVERLAY_TO);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      className="relative"
      {...containerProps}
    >
      <CapsuleStage
        images={slides.map((item) => ({ id: item.id, src: item.image }))}
        activeIndex={index}
        overlayFrom={overlayFrom}
        overlayTo={overlayTo}
      >
        <CapsuleShell
          variant="hero"
          media={
            <CapsuleMedia
              images={slides.map((item) => ({
                id: item.id,
                src: item.image,
                alt: item.heading,
              }))}
              activeIndex={index}
              progress={canAutoplay && !isPaused ? progress : undefined}
              accent={accent}
              caption={slide.mediaCaption}
              sizes="(max-width: 440px) calc(100vw - 80px), (max-width: 820px) 392px, (max-width: 1280px) 42vw, 540px"
              priority
            />
          }
        >
          <CapsuleContent
            as="h1"
            eyebrow={slide.eyebrow}
            heading={slide.heading}
            body={slide.body}
            accent={accent}
          >
            <CapsuleActions primary={slide.cta.primary} secondary={slide.cta.secondary} />
          </CapsuleContent>
        </CapsuleShell>

        <SlideshowControls
          index={index}
          count={slides.length}
          isPaused={isPaused}
          canAutoplay={canAutoplay}
          accent={accent}
          onPrevious={previous}
          onNext={next}
          onGoTo={goTo}
          onTogglePause={togglePause}
          slideLabels={slides.map((item) => item.eyebrow)}
        />

        {/* The controls use the stage's reserved lower band, separate from the
            media, text and CTA pair in the capsule. */}
      </CapsuleStage>

      {/* Announces the change without duplicating the heading on screen. */}
      <p role="status" aria-live="polite" className="sr-only">
        {`Slide ${index + 1} of ${slides.length}: ${slide.heading}`}
      </p>
    </section>
  );
}
