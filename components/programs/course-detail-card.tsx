import Link from "next/link";

import { LabelPills } from "@/components/content/label-pills";
import { PanelList } from "@/components/content/panel-list";
import { RemoteImage } from "@/components/media/remote-image";

import type { Course } from "@/types/course";

type CourseDetailCardProps = {
  course: Course | null;
  fallbackTitle: string;
};

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
    return "Shared after review";
  }

  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function CourseDetailCard({ course, fallbackTitle }: CourseDetailCardProps) {
  if (!course) {
    return (
      <div className="rounded-panel border border-dashed border-brand-border bg-white p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-brand-ink">{fallbackTitle}</h1>
        <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">
          This course route is active, but the course API did not return details for this slug.
          The browse catalogue remains wired for runtime requests from the configured endpoint.
        </p>
        <Link
          href="/apply-for-training/courses"
          className="mt-6 inline-flex text-sm font-semibold text-brand-deep"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const objectives = course.objectives ?? [];
  const requirements = course.requirements ?? [];
  const includedItems = course.includedItems ?? [];
  const tags = course.tags ?? [];
  const teachers = course.teachers ?? [];

  return (
    <article className="overflow-hidden rounded-panel border border-brand-border bg-white shadow-sm">
      <div className="relative min-h-[360px] bg-brand-mist">
        <RemoteImage
          src={course.image}
          alt={course.title}
          sizes="(max-width: 1023px) 100vw, 1024px"
          priority
          fallbackLabel={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-brand-deep/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
          <Link
            href="/apply-for-training/courses"
            className="mb-6 inline-flex rounded-control bg-white/90 px-4 py-2 text-sm font-semibold text-brand-deep transition hover:bg-white"
          >
            Back to courses
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-accent">
            {course.category}
          </p>
          <h1 className="mt-3 max-w-4xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/85">{course.shortDescription}</p>
          {tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-capsule border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
        <div>
          {course.descriptionHtml ? (
            <div
              className="course-prose"
              dangerouslySetInnerHTML={{ __html: course.descriptionHtml }}
            />
          ) : (
            <p className="max-w-prose text-base leading-8 text-slate-600">{course.description}</p>
          )}

          {course.previewVideoUrl && /(youtube\.com|youtu\.be|vimeo\.com)/i.test(course.previewVideoUrl) ? (
            <section className="mt-8">
              <div className="aspect-video overflow-hidden rounded-panel border border-brand-border bg-black">
                <iframe
                  src={course.previewVideoUrl.replace("watch?v=", "embed/")}
                  title={`${course.title} preview`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          {objectives.length ? (
            <section className="mt-10">
              <h2 className="font-heading text-2xl font-bold text-brand-ink">What you will learn</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {objectives.map((objective) => (
                  <div
                    key={objective}
                    className="relative rounded-panel border border-brand-border bg-brand-mist/40 py-4 pl-6 pr-4 text-sm leading-6 text-slate-600"
                  >
                    <span aria-hidden="true" className="absolute inset-y-4 left-0 w-[3px] rounded-capsule bg-brand-accent" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-panel border border-brand-border bg-brand-mist/45 p-5">
          <div className="rounded-panel bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Price
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-brand-deep">
              {formatPrice(course)}
            </p>
            <a
              href={course.applyUrl ?? "https://portal.itforyouthghana.org"}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full justify-center rounded-control bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Continue to application
            </a>
          </div>

          <dl className="mt-5 grid gap-3 text-sm">
            <div className="rounded-panel bg-white px-4 py-4">
              <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                Duration
              </dt>
              <dd className="mt-2 text-slate-600">{course.duration}</dd>
            </div>
            <div className="rounded-panel bg-white px-4 py-4">
              <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                Starts
              </dt>
              <dd className="mt-2 text-slate-600">{formatDate(course.startDate)}</dd>
            </div>
            {course.endDate ? (
              <div className="rounded-panel bg-white px-4 py-4">
                <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                  <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                  Ends
                </dt>
                <dd className="mt-2 text-slate-600">{formatDate(course.endDate)}</dd>
              </div>
            ) : null}
            <div className="rounded-panel bg-white px-4 py-4">
              <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                Level
              </dt>
              <dd className="mt-2 text-slate-600">{course.level}</dd>
            </div>
            <div className="rounded-panel bg-white px-4 py-4">
              <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                Language
              </dt>
              <dd className="mt-2 text-slate-600">{course.language ?? "English"}</dd>
            </div>
            {course.provider ? (
              <div className="rounded-panel bg-white px-4 py-4">
                <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                  <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                  Provider
                </dt>
                <dd className="mt-2 text-slate-600">{course.provider}</dd>
              </div>
            ) : null}
            {typeof course.enrollmentCount === "number" ? (
              <div className="rounded-panel bg-white px-4 py-4">
                <dt className="flex items-center gap-2.5 font-semibold text-brand-ink">
                  <span aria-hidden="true" className="h-[2px] w-3.5 flex-none bg-brand-accent" />
                  Enrolled
                </dt>
                <dd className="mt-2 text-slate-600">{course.enrollmentCount}</dd>
              </div>
            ) : null}
          </dl>

          {course.previewVideoUrl ? (
            <a
              href={course.previewVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-control border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-deep transition hover:border-brand-accent hover:text-brand-ink"
            >
              Watch preview
            </a>
          ) : null}

          {teachers.length || requirements.length || includedItems.length ? (
            <div className="mt-5 space-y-5 rounded-panel bg-white p-5">
              {/* Names and included items are short labels, so they become
                  pills. Requirements are whole sentences, so they become
                  panels. Neither is a dot-and-line list. */}
              {teachers.length ? (
                <section>
                  <h2 className="text-sm font-bold text-brand-ink">Taught by</h2>
                  <LabelPills className="mt-3" items={teachers.map((teacher) => teacher.name)} />
                </section>
              ) : null}
              {requirements.length ? (
                <section>
                  <h2 className="text-sm font-bold text-brand-ink">Requirements</h2>
                  <PanelList className="mt-3" items={requirements} tone="plain" />
                </section>
              ) : null}
              {includedItems.length ? (
                <section>
                  <h2 className="text-sm font-bold text-brand-ink">Included</h2>
                  <LabelPills className="mt-3" items={includedItems} tone="outline" />
                </section>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
