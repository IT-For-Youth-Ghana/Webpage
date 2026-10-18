"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useState } from "react";

import type { Course } from "@/types/course";
import { RemoteImage } from "@/components/media/remote-image";

type TrainingCourseCatalogProps = {
  courses: Course[];
};

type PriceFilter = "all" | "free" | "paid";

function formatPrice(course: Course) {
  if (course.pricing.isFree || course.pricing.amount === 0) {
    return "Free";
  }
  if (typeof course.pricing.amount === "number") {
    return `${course.pricing.currency} ${course.pricing.amount.toLocaleString()}`;
  }
  return "See details";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Dates shared after review";
  }

  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function TrainingCourseCatalog({ courses }: TrainingCourseCatalogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [level, setLevel] = useState(searchParams.get("level") ?? "all");
  const [price, setPrice] = useState<PriceFilter>(
    (searchParams.get("price") as PriceFilter | null) ?? "all",
  );
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }
    if (category !== "all") {
      params.set("category", category);
    }
    if (level !== "all") {
      params.set("level", level);
    }
    if (price !== "all") {
      params.set("price", price);
    }

    const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname;
    const currentParams = searchParams.toString();

    if (currentParams === params.toString()) {
      return;
    }

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }, [category, level, pathname, price, query, router, searchParams]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const categories = Array.from(new Set(courses.map((course) => course.category))).sort();
  const levels = Array.from(new Set(courses.map((course) => course.level))).sort();

  const filteredCourses = courses.filter((course) => {
    const matchesQuery =
      !normalizedQuery ||
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.category.toLowerCase().includes(normalizedQuery) ||
      course.level.toLowerCase().includes(normalizedQuery) ||
      course.shortDescription.toLowerCase().includes(normalizedQuery) ||
      course.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesCategory = category === "all" || course.category === category;
    const matchesLevel = level === "all" || course.level === level;
    const matchesPrice =
      price === "all" ||
      (price === "free" ? course.pricing.isFree : !course.pricing.isFree);

    return matchesQuery && matchesCategory && matchesLevel && matchesPrice;
  });

  const hasActiveFilters =
    Boolean(query.trim()) || category !== "all" || level !== "all" || price !== "all";

  return (
    <div className="space-y-8">
      <div className="sticky top-[72px] z-20 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 lg:grid-cols-[1.8fr_repeat(3,minmax(0,1fr))]">
            <label className="relative block">
              <span className="sr-only">Search courses</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses, topics, or skills"
                className="w-full rounded-control border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent"
              />
            </label>

            <label className="block">
              <span className="sr-only">Filter by category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-control border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent"
              >
                <option value="all">All categories</option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by level</span>
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-control border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent"
              >
                <option value="all">All levels</option>
                {levels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">Filter by price</span>
              <select
                value={price}
                onChange={(event) => setPrice(event.target.value as PriceFilter)}
                className="w-full rounded-control border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent"
              >
                <option value="all">Free and paid</option>
                <option value="free">Free only</option>
                <option value="paid">Paid only</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-panel border border-brand-border bg-brand-mist/45 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-base font-semibold text-brand-ink">
              {filteredCourses.length} course{filteredCourses.length === 1 ? "" : "s"} found
            </p>
            <p className="mt-1 text-base text-slate-500">
              Filter by category, level, and pricing to narrow the strongest fit.
            </p>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setLevel("all");
                setPrice("all");
              }}
              className="inline-flex w-fit items-center rounded-capsule border border-brand-border px-4 py-2 text-sm font-semibold text-brand-deep transition hover:border-brand-accent hover:text-brand-ink"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {filteredCourses.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-panel border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="relative aspect-[4/3] bg-brand-mist">
                  <RemoteImage
                    src={course.image}
                    alt={course.title}
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    fallbackLabel={course.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/35 via-transparent to-transparent" />
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-capsule bg-brand-warm px-3 py-1 text-xs font-semibold text-brand-ink">
                      {course.category}
                    </span>
                    <span className="rounded-capsule border border-brand-border px-3 py-1 text-xs font-semibold text-slate-600">
                      {course.level}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-heading text-2xl font-bold text-brand-ink">
                      {course.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-slate-600">
                      {course.shortDescription}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-panel bg-brand-mist/55 px-4 py-4">
                      <div className="flex items-center gap-2.5 text-sm font-semibold text-brand-ink">
                        <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                        Duration
                      </div>
                      <p className="mt-2 text-base text-slate-600">{course.duration}</p>
                    </div>
                    <div className="rounded-panel bg-brand-mist/55 px-4 py-4">
                      <div className="flex items-center gap-2.5 text-sm font-semibold text-brand-ink">
                        <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                        Next start
                      </div>
                      <p className="mt-2 text-base text-slate-600">{formatDate(course.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 border-t border-brand-border pt-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Price
                      </p>
                      <p className="mt-2 font-heading text-2xl font-bold text-brand-deep">
                        {formatPrice(course)}
                      </p>
                      <p className="mt-1 text-base text-slate-500">{course.deliveryMode}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Link
                        href={`/apply-for-training/courses/${course.slug}`}
                        className="text-sm font-semibold text-brand-deep transition hover:text-brand-ink"
                      >
                        View details
                      </Link>
                      <a
                        href={
                          course.applyUrl ??
                          `https://portal.itforyouthghana.org?course=${encodeURIComponent(course.slug)}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Apply now
                        <span aria-hidden="true" className="size-1.5 flex-none rotate-45 border-r-[1.6px] border-t-[1.6px] border-current" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-panel border border-dashed border-brand-border bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              No matches yet
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink">
              No courses match your current filters
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Try broadening the search or jump to the upcoming cohorts below if timing is the
              main thing you need to decide first.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setLevel("all");
                  setPrice("all");
                }}
                className="rounded-control border border-brand-border px-5 py-3 text-sm font-semibold text-brand-deep transition hover:border-brand-accent hover:text-brand-ink"
              >
                Reset filters
              </button>
              <a
                href="#cohorts"
                className="inline-flex items-center gap-2 rounded-control bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
              >
                See upcoming cohorts
                <span aria-hidden="true" className="size-1.5 flex-none rotate-45 border-r-[1.6px] border-t-[1.6px] border-current" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
