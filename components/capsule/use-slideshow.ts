"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

const TICK_MS = 50;

type UseSlideshowOptions = {
  /** Number of slides. The hook is inert when this is 1 or 0. */
  count: number;
  /** Milliseconds a slide is held before advancing. */
  interval?: number;
  /** Set false for a slideshow that only ever advances on user input. */
  autoplay?: boolean;
};

export type SlideshowState = {
  index: number;
  /** Autoplay progress through the current slide, 0 to 100. */
  progress: number;
  /** True when the viewer has explicitly stopped autoplay. */
  isPaused: boolean;
  /** False when autoplay cannot run: one slide, or reduced motion. */
  canAutoplay: boolean;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  togglePause: () => void;
  /**
   * Handlers for the element wrapping the slideshow. Spread these rather than
   * wiring pointer and focus behaviour by hand at each call site.
   */
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: (event: React.FocusEvent<HTMLElement>) => void;
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => void;
  };
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Headless slideshow controller.
 *
 * Owns sequencing, autoplay, progress, pausing and input handling, and renders
 * nothing. That separation is the point: the same controller drives the hero
 * capsule and can wrap content that is not a hero at all.
 *
 * Autoplay never starts under prefers-reduced-motion, because an
 * auto-advancing carousel is itself the motion being opted out of. Manual
 * controls stay fully functional.
 */
export function useSlideshow({
  count,
  interval = 6000,
  autoplay = true,
}: UseSlideshowOptions): SlideshowState {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);

  const elapsedRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);

  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const canAutoplay = autoplay && !prefersReducedMotion && count > 1;

  /* Recover if the slide array shrinks under us. */
  useEffect(() => {
    if (count > 0 && index >= count) {
      setIndex(0);
      elapsedRef.current = 0;
      setProgress(0);
    }
  }, [count, index]);

  const goTo = useCallback(
    (next: number) => {
      if (count <= 0) return;
      elapsedRef.current = 0;
      setProgress(0);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);

  const togglePause = useCallback(() => {
    setIsPaused((paused) => !paused);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  /*
   * A single timer drives both advancing and the progress readout. The
   * previous implementation ran two independent intervals, which drift apart
   * over a long session and let the bar disagree with the slide.
   */
  const isRunning = canAutoplay && !isPaused && !isSuspended;

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      elapsedRef.current += TICK_MS;

      if (elapsedRef.current >= interval) {
        elapsedRef.current = 0;
        setProgress(0);
        setIndex((current) => (current + 1) % count);
        return;
      }

      setProgress(Math.min(100, (elapsedRef.current / interval) * 100));
    }, TICK_MS);

    return () => clearInterval(id);
  }, [count, interval, isRunning]);

  /* Stop counting while the tab is hidden. */
  useEffect(() => {
    const onVisibility = () => setIsSuspended(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /*
   * Arrow-key navigation, preserved from the previous hero but no longer
   * hijacked from text entry: the old global listener changed slides while a
   * viewer was arrowing through an input elsewhere on the page.
   */
  useEffect(() => {
    if (count <= 1) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, next, previous]);

  const containerProps = useMemo(
    () => ({
      onMouseEnter: () => setIsSuspended(true),
      onMouseLeave: () => setIsSuspended(false),
      /* A keyboard viewer reading the panel should not have it change. */
      onFocus: () => setIsSuspended(true),
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setIsSuspended(false);
      },
      onTouchStart: (event: React.TouchEvent<HTMLElement>) => {
        touchStartRef.current = event.touches[0]?.clientX ?? null;
        setIsSuspended(true);
      },
      onTouchEnd: (event: React.TouchEvent<HTMLElement>) => {
        const start = touchStartRef.current;
        const end = event.changedTouches[0]?.clientX ?? null;
        touchStartRef.current = null;
        setIsSuspended(false);

        if (start === null || end === null) return;

        const delta = start - end;
        if (Math.abs(delta) > 50) {
          if (delta > 0) next();
          else previous();
        }
      },
    }),
    [next, previous],
  );

  return {
    index,
    progress,
    isPaused,
    canAutoplay,
    goTo,
    next,
    previous,
    togglePause,
    containerProps,
  };
}
