"use client";

import { cn } from "@/lib/utils/cn";

type SlideshowControlsProps = {
  index: number;
  count: number;
  isPaused: boolean;
  /** Hides the pause control when autoplay cannot run anyway. */
  canAutoplay: boolean;
  accent?: string;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onTogglePause: () => void;
  /** Accessible names for each slide, used on the pager buttons. */
  slideLabels: string[];
  className?: string;
};

const control =
  "inline-flex size-11 flex-none items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition duration-200 hover:scale-105 hover:border-white/45 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070f]";

/**
 * Slideshow controls.
 *
 * Every control is a real focusable button with an accessible name, and every
 * glyph is CSS geometry rather than an icon component. The pause control is
 * not decoration: autoplay needs a keyboard-reachable stop under WCAG 2.2.2,
 * and pausing on hover alone never gave keyboard viewers one.
 */
export function SlideshowControls({
  index,
  count,
  isPaused,
  canAutoplay,
  accent = "#1E72BA",
  onPrevious,
  onNext,
  onGoTo,
  onTogglePause,
  slideLabels,
  className,
}: SlideshowControlsProps) {
  if (count <= 1) return null;

  return (
    <div
      className={cn(
        /* The stage reserves --hero-controls-h of extra bottom padding, so these
           sit below the capsule rather than over the photograph. */
        "absolute inset-x-0 bottom-[clamp(14px,2vh,26px)] z-20 flex items-center justify-center gap-2 px-2 min-[431px]:gap-[clamp(10px,2vw,22px)] min-[431px]:px-4",
        className,
      )}
    >
      <button type="button" onClick={onPrevious} aria-label="Previous slide" className={control}>
        <span
          aria-hidden="true"
          className="size-2 -translate-x-px -translate-y-px -rotate-[135deg] border-r-[1.7px] border-t-[1.7px] border-current"
        />
      </button>

      <div className="flex items-center gap-3.5 rounded-capsule border border-white/20 bg-black/40 px-3 py-2.5 backdrop-blur-md min-[431px]:px-[18px]">
        <p className="whitespace-nowrap font-heading text-[13px] font-bold tracking-[0.06em] text-white">
          {String(index + 1).padStart(2, "0")}
          <span className="text-white/50"> / {String(count).padStart(2, "0")}</span>
        </p>

        <div className="hidden items-center gap-[7px] min-[431px]:flex">
          {slideLabels.map((label, slide) => {
            const isCurrent = slide === index;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onGoTo(slide)}
                aria-label={`Slide ${slide + 1}: ${label}`}
                aria-current={isCurrent}
                className={cn(
                  "h-[3px] rounded-capsule transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070f]",
                  isCurrent ? "w-10" : "w-[26px] bg-white/25 hover:bg-white/55",
                )}
                style={isCurrent ? { backgroundColor: accent } : undefined}
              />
            );
          })}
        </div>
      </div>

      {canAutoplay ? (
        <button
          type="button"
          onClick={onTogglePause}
          aria-pressed={isPaused}
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          className={control}
        >
          {isPaused ? (
            <span
              aria-hidden="true"
              className="ml-[3px] size-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current"
            />
          ) : (
            <span aria-hidden="true" className="flex gap-[3px]">
              <span className="block h-[11px] w-[2.5px] bg-current" />
              <span className="block h-[11px] w-[2.5px] bg-current" />
            </span>
          )}
        </button>
      ) : null}

      <button type="button" onClick={onNext} aria-label="Next slide" className={control}>
        <span
          aria-hidden="true"
          className="size-2 -translate-x-px -translate-y-px rotate-45 border-r-[1.7px] border-t-[1.7px] border-current"
        />
      </button>
    </div>
  );
}
