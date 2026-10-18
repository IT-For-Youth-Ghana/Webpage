"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { MediaFallback } from "@/components/media/media-fallback";
import { Button } from "@/components/ui/button";
import {
  splitTitleEmphasis,
  stripTitleEmphasis,
} from "@/lib/page-sections/title-emphasis";
import { cn } from "@/lib/utils/cn";

import type {
  HeroSection,
  SectionActionContent,
} from "@/types/page-sections";

const actionVariants = {
  gold: "primary",
  navy: "dark",
  light: "white",
  text: "white-outline",
} as const;

/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

function HeroActions({
  actions,
}: {
  actions?: SectionActionContent[];
}) {
  if (!actions?.length) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3 lg:mt-5">
      {actions.map((action, index) => (
        <Button
          key={`${action.href}-${action.label}`}
          href={action.href}
          size="lg"
          variant={
            actionVariants[
              action.style ?? (index === 0 ? "gold" : "light")
            ]
          }
          className="min-h-[50px] rounded-capsule px-7 text-[0.95rem] font-bold"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  HEADLINE                                  */
/* -------------------------------------------------------------------------- */

function HeroHeadline({
  title,
  titleAccent,
}: {
  title: string;
  titleAccent?: string;
}) {
  return (
    <h1 className="mt-5 max-w-[16ch] font-heading text-[clamp(2.8rem,4.3vw,4.75rem)] font-bold leading-[0.94] tracking-[-0.045em] text-white">
      {splitTitleEmphasis(title, titleAccent).map((segment, index) =>
        segment.accent ? (
          <em
            key={index}
            className="font-medium italic text-brand-accent-on-dark"
          >
            {segment.text}
          </em>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </h1>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   METRICS                                  */
/* -------------------------------------------------------------------------- */

function HeroMetrics({
  metrics,
}: {
  metrics: NonNullable<
    HeroSection["slides"][number]["metrics"]
  >;
}) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {metrics.slice(0, 4).map((metric, index) => (
        <div
          key={metric.id}
          className={cn(
            "flex min-h-[104px] min-w-[150px] flex-col justify-center rounded-[999px] border border-white/10 px-6 py-4",
            index === 0
              ? "bg-white text-brand-deep"
              : "bg-white/[0.06] text-white",
          )}
        >
          <strong
            className={cn(
              "font-heading text-[2rem] font-bold leading-none tracking-[-0.03em]",
              index === 0
                ? "text-brand-deep"
                : "text-white",
            )}
          >
            {metric.value}
          </strong>

          <span
            className={cn(
              "mt-2 max-w-[15ch] text-[0.7rem] font-bold uppercase leading-[1.35] tracking-[0.1em]",
              index === 0
                ? "text-brand-deep/60"
                : "text-white/55",
            )}
          >
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SLIDE NAVIGATION                              */
/* -------------------------------------------------------------------------- */

function SlideNavigation({
  section,
  activeIndex,
  onChange,
}: {
  section: HeroSection;
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  if (section.slides.length <= 1) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 rounded-capsule bg-white/10 p-2">
        {section.slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              "h-3 rounded-capsule transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              "motion-reduce:transition-none",
              index === activeIndex
                ? "w-12 bg-brand-accent-on-dark"
                : "w-3 bg-white/30 hover:bg-white/60",
            )}
            aria-label={`Show slide ${index + 1}: ${stripTitleEmphasis(
              slide.title,
            )}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <span className="font-heading text-sm font-bold tracking-[0.08em] text-white/60">
        {String(activeIndex + 1).padStart(2, "0")}
        <span className="mx-2 text-white/25">/</span>
        {String(section.slides.length).padStart(2, "0")}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               EDITORIAL HERO                               */
/* -------------------------------------------------------------------------- */

export function EditorialHero({
  section,
}: {
  section: HeroSection;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const active =
    section.slides[activeIndex] ?? section.slides[0];

  useEffect(() => {
    if (section.slides.length < 2) return;

    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex(
        (index) => (index + 1) % section.slides.length,
      );
    }, 6500);

    return () => window.clearInterval(timer);
  }, [section.slides.length]);

  if (!active) return null;

  const publication = section.variant === "publication";
  const data = section.variant === "data";
  const immersive = section.variant === "immersive";

  return (
    <section
      id={section.anchor}
      data-section-id={section.id}
      data-component-type={section.componentType}
      data-variant={section.variant}
      className={cn(
        "overflow-hidden bg-brand-warm px-3 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-5",
        section.theme === "mist" && "bg-brand-mist",
      )}
    >
      <div
        className={cn(
          "relative mx-auto min-h-[720px] max-w-[1380px] overflow-hidden rounded-[44px] bg-brand-deep lg:min-h-[clamp(560px,calc(100svh-10rem),640px)]",
          immersive && "min-h-[780px] lg:min-h-[700px]",
          publication && "lg:min-h-[680px]",
        )}
      >
        {/* ---------------------------------------------------------------- */}
        {/*                    LARGE BACKGROUND CAPSULE                      */}
        {/* ---------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="absolute -bottom-[210px] -left-[120px] h-[460px] w-[460px] rounded-full border-[80px] border-white/[0.025]"
        />

        <div
          aria-hidden="true"
          className="absolute -right-[140px] -top-[180px] h-[500px] w-[500px] rounded-full border-[90px] border-brand-accent-on-dark/[0.06]"
        />

        {/* ---------------------------------------------------------------- */}
        {/*                            COPY AREA                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative z-20 flex min-h-[670px] flex-col justify-center px-7 py-14 sm:px-11 lg:ml-auto lg:min-h-[clamp(560px,calc(100svh-10rem),640px)] lg:w-[52%] lg:px-14 lg:py-6 xl:px-16">
          {active.eyebrow ? (
            <div className="inline-flex w-fit items-center rounded-capsule bg-brand-accent-on-dark px-5 py-2.5">
              <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-brand-deep">
                {active.eyebrow}
              </span>
            </div>
          ) : null}

          <HeroHeadline
            title={active.title}
            titleAccent={active.titleAccent}
          />

          {active.body ? (
            <p className="mt-5 max-w-[46ch] text-[1rem] leading-[1.65] text-white/70 sm:text-[1.05rem]">
              {active.body}
            </p>
          ) : null}

          <HeroActions actions={active.actions} />

          {data && active.metrics?.length ? (
            <HeroMetrics metrics={active.metrics} />
          ) : null}

          <div className="mt-7">
            <SlideNavigation
              section={section}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*                         IMAGE CAPSULE                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          className={cn(
            "relative z-10 mx-5 mb-5 min-h-[520px] overflow-hidden rounded-[170px]",
            "sm:mx-8 sm:mb-8",
            "lg:absolute lg:bottom-5 lg:left-5 lg:top-5 lg:mx-0 lg:mb-0 lg:w-[49%]",
            publication && "lg:w-[55%]",
            immersive && "lg:w-[57%]",
            data && "lg:w-[47%]",
          )}
        >
          {active.media.src.trim() ? (
            <Image
              key={active.media.src}
              src={active.media.src}
              alt={active.media.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 55vw"
              className={cn(
                "object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none",

                active.media.focalPoint === "top" &&
                  "object-top",

                active.media.focalPoint === "bottom" &&
                  "object-bottom",

                active.media.focalPoint === "left" &&
                  "object-left",

                active.media.focalPoint === "right" &&
                  "object-right",
              )}
            />
          ) : (
            <MediaFallback
              tone="dark"
              label={stripTitleEmphasis(active.title)}
            />
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-deep/45 via-transparent to-transparent"
          />

          {/* image slide number */}

          {section.slides.length > 1 ? (
            <div className="absolute right-7 top-7 z-20 flex h-16 min-w-16 items-center justify-center rounded-full bg-white px-4 shadow-panel">
              <span className="font-heading text-lg font-bold text-brand-deep">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>
          ) : null}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*                           CAPTION CAPSULE                         */}
        {/* ---------------------------------------------------------------- */}

        {active.caption || active.media.caption ? (
          <div className="relative z-30 mx-6 -mt-24 mb-8 max-w-[400px] sm:mx-10 lg:absolute lg:bottom-16 lg:left-[39%] lg:mx-0 lg:mb-0 lg:mt-0 lg:w-[310px]">
            <div className="rounded-[52px] rounded-br-[18px] bg-white px-7 py-6 shadow-editorial">
              <div className="mb-3 h-2 w-10 rounded-capsule bg-brand-accent-on-dark" />

              <p className="font-heading text-[1rem] font-bold leading-[1.48] tracking-[-0.01em] text-brand-deep">
                {active.caption ??
                  active.media.caption}
              </p>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------------------------------- */}
        {/*                    SMALL DECORATIVE CAPSULE                      */}
        {/* ---------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[28%] hidden h-28 w-12 rounded-capsule bg-brand-accent-on-dark lg:block"
        />
      </div>
    </section>
  );
}
