import Image from "next/image";
import Link from "next/link";

export type FeaturedProgram = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  href: string;
  cta: string;
  tags?: string[];
  featured?: boolean; // one card should be true
};

type FeaturedProgramsProps = {
  programs: FeaturedProgram[];
};

export function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const hero = programs.find((p) => p.featured);
  const rest = programs.filter((p) => !p.featured);

  return (
    <section className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading row */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              Featured programs
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              Built for every stage of your journey
            </h2>
          </div>
          <Link
            href="/programs"
            className="shrink-0 border-b-2 border-brand-accent pb-0.5 text-[0.78rem] font-bold text-brand-ink transition hover:text-brand-accent"
          >
            View all programs →
          </Link>
        </div>

        {/* Editorial grid */}
        <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          {/* Hero card — spans 2 rows, 2 cols */}
          {hero && (
            <Link
              href={hero.href}
              className="group relative col-span-1 overflow-hidden rounded-panel bg-brand-deep lg:col-span-2 lg:row-span-2"
            >
              {hero.image && (
                <Image
                  src={hero.image}
                  alt={hero.title}
                  fill
                  className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-50"
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/60 to-transparent" />

              <div className="relative flex h-full min-h-[380px] flex-col justify-end p-8 lg:min-h-[480px]">
                {/* Tags */}
                {hero.tags && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {hero.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                  {hero.eyebrow}
                </p>
                <h3 className="font-heading text-2xl font-bold leading-snug text-white lg:text-3xl">
                  {hero.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-[1.75] text-white/70">
                  {hero.description}
                </p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand-accent px-5 py-2.5 text-[0.78rem] font-bold text-white transition group-hover:-translate-y-0.5">
                  {hero.cta} →
                </span>
              </div>
            </Link>
          )}

          {/* Side cards */}
          {rest.slice(0, 4).map((prog) => (
            <Link
              key={prog.id}
              href={prog.href}
              className="group flex flex-col justify-between rounded-panel border border-brand-border bg-white p-7 transition duration-250 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]"
            >
              <div>
                {prog.tags && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {prog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-mist px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-deep"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mb-1.5 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-brand-accent">
                  {prog.eyebrow}
                </p>
                <h3 className="font-heading text-xl font-bold leading-snug text-brand-ink">
                  {prog.title}
                </h3>
                <p className="mt-2.5 text-base leading-[1.7] text-slate-500">
                  {prog.description}
                </p>
              </div>
              <p className="mt-5 flex items-center gap-1.5 text-sm font-bold text-brand-deep transition-[gap] group-hover:gap-2.5">
                {prog.cta} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
