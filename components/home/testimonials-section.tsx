"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  programme?: string;
  year?: string;
  avatar?: string;
  initials: string;
  active?: boolean;
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const visibleTestimonials = testimonials.filter((item) => item.active !== false);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = visibleTestimonials.length;

  useEffect(() => {
    if (current >= total && total > 0) {
      setCurrent(0);
    }
  }, [current, total]);

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) {
        return;
      }
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const startTimer = useCallback(() => {
    if (total <= 1) {
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % total), 8000);
  }, [total]);

  useEffect(() => {
    if (total === 0) {
      return undefined;
    }

    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer, total]);

  const handleSelect = (index: number) => {
    goTo(index);
    startTimer();
  };

  if (total === 0) {
    return null;
  }

  const t = visibleTestimonials[current];

  return (
    <section className="overflow-hidden bg-brand-deep px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 rounded-panel border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:grid-cols-[0.36fr_0.64fr] lg:p-10">
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl">
                Student stories
              </h2>
              <p className="mt-5 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                The human proof behind the numbers
              </p>
              <p className="mt-4 max-w-sm text-base leading-7 text-white/70">
                One strong story can do what a long paragraph cannot. This carousel keeps the homepage grounded in lived experience.
              </p>
            </div>

            <div className="rounded-panel border border-white/10 bg-white/5 p-5">
              <div className="relative h-64 overflow-hidden rounded-panel bg-white/10">
                {t.avatar ? (
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-accent/15 font-heading text-4xl font-bold text-brand-accent">
                    {t.initials}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-1">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-base text-white/65">{t.role}</p>
                <p className="text-base text-brand-accent/90">
                  {[t.programme, t.year].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div key={t.id} className="animate-hero-in">
              <span className="font-heading text-[5rem] leading-none text-brand-accent/20 select-none">
                &ldquo;
              </span>
              <blockquote className="-mt-4 max-w-3xl font-heading text-2xl font-semibold leading-[1.6] text-white sm:text-[2rem]">
                {t.quote}
              </blockquote>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect(current - 1)}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand-accent/50 hover:text-brand-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(current + 1)}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand-accent/50 hover:text-brand-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {visibleTestimonials.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-10 bg-brand-accent"
                        : "w-5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
