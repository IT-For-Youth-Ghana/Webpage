"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Heart, X } from "lucide-react";

import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";

export type FloatingElementsContent = {
  donateButton: {
    active?: boolean;
    label: string;
    href: string;
    showAfterPx?: number;
  };
  scrollToTop: {
    active?: boolean;
    showAfterPx?: number;
    ariaLabel?: string;
  };
  exitIntent: {
    id: string;
    active?: boolean;
    mode: "newsletter" | "donate" | "announcement";
    headline: string;
    description: string;
    image?: string;
    cta?: { label: string; href: string };
    delayMs?: number;
    dismissDays?: number;
    newsletterInterest?: string;
  };
};

type FloatingElementsProps = {
  content: FloatingElementsContent;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function FloatingElements({ content }: FloatingElementsProps) {
  const [scrollY, setScrollY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isExitPopupDismissed, setIsExitPopupDismissed] = useState(false);

  const dismissKey = useMemo(
    () => `itfy-exit-popup-dismissed:${content.exitIntent.id}`,
    [content.exitIntent.id],
  );

  const donateVisible =
    content.donateButton.active !== false &&
    scrollY > (content.donateButton.showAfterPx ?? 400);
  const scrollToTopVisible =
    content.scrollToTop.active !== false &&
    scrollY > (content.scrollToTop.showAfterPx ?? 600);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [showPopup]);

  useEffect(() => {
    if (content.exitIntent.active === false) {
      return;
    }

    const dismissedUntil = window.localStorage.getItem(dismissKey);
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      setIsExitPopupDismissed(true);
    }
  }, [content.exitIntent.active, dismissKey]);

  useEffect(() => {
    if (content.exitIntent.active === false || isExitPopupDismissed) {
      return undefined;
    }

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const delayMs = content.exitIntent.delayMs ?? 60_000;
    let isEligible = false;

    const eligibilityTimer = window.setTimeout(() => {
      isEligible = true;
      if (isCoarsePointer) {
        setShowPopup(true);
      }
    }, delayMs);

    const handleMouseMove = (event: MouseEvent) => {
      if (!isEligible || isCoarsePointer || showPopup) {
        return;
      }

      if (event.clientY <= 24) {
        setShowPopup(true);
      }
    };

    if (!isCoarsePointer) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.clearTimeout(eligibilityTimer);
      if (!isCoarsePointer) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [
    content.exitIntent.active,
    content.exitIntent.delayMs,
    isExitPopupDismissed,
    showPopup,
  ]);

  const dismissPopup = () => {
    const dismissDays = content.exitIntent.dismissDays ?? 7;
    window.localStorage.setItem(
      dismissKey,
      String(Date.now() + dismissDays * MS_PER_DAY),
    );
    setIsExitPopupDismissed(true);
    setShowPopup(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-8 sm:right-6">
        {donateVisible ? (
          <Link
            href={content.donateButton.href}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-brand-accent px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(245,197,24,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(245,197,24,0.45)]"
          >
            <Heart className="h-4 w-4" />
            {content.donateButton.label}
          </Link>
        ) : null}

        {scrollToTopVisible ? (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={content.scrollToTop.ariaLabel ?? "Scroll to top"}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-deep text-white shadow-[0_14px_30px_rgba(12,45,90,0.28)] transition hover:-translate-y-0.5 hover:bg-brand-ink"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      {showPopup && content.exitIntent.active !== false ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-deep/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={content.exitIntent.headline}
          onClick={dismissPopup}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.32)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismissPopup}
              aria-label="Close popup"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-[0.46fr_0.54fr]">
              <div className="relative min-h-[18rem] bg-brand-mist">
                {content.exitIntent.image ? (
                  <Image
                    src={content.exitIntent.image}
                    alt={content.exitIntent.headline}
                    fill
                    sizes="(max-width: 767px) 100vw, 40vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-hero-grid" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-deep/40 via-transparent to-brand-accent/10" />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                  {content.exitIntent.mode === "newsletter"
                    ? "Stay connected"
                    : content.exitIntent.mode === "donate"
                      ? "Support the mission"
                      : "Before you go"}
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-ink">
                  {content.exitIntent.headline}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {content.exitIntent.description}
                </p>

                <div className="mt-8">
                  {content.exitIntent.mode === "newsletter" ? (
                    <NewsletterSignupForm
                      interest={content.exitIntent.newsletterInterest ?? "exit-intent"}
                      buttonLabel="Subscribe"
                      placeholder="Enter your email address"
                    />
                  ) : content.exitIntent.cta ? (
                    <Link
                      href={content.exitIntent.cta.href}
                      onClick={dismissPopup}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {content.exitIntent.cta.label}
                    </Link>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={dismissPopup}
                  className="mt-6 inline-flex w-fit text-sm font-semibold text-slate-500 transition hover:text-brand-ink"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
