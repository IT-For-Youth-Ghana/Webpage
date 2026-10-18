import Link from "next/link";

type CtaStripProps = {
  heading: string;
  subtext: string;
  cta: { label: string; href: string };
};

export function CtaStrip({ heading, subtext, cta }: CtaStripProps) {
  return (
    <div className="bg-brand-accent">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-12 lg:px-10">
        <div>
          <h2 className="font-heading text-[1.8rem] font-bold text-brand-ink leading-snug">
            {heading}
          </h2>
          <p className="mt-1.5 text-base text-brand-ink/60">{subtext}</p>
        </div>
        <Link
          href={cta.href}
          className="rounded-full bg-brand-deep px-8 py-3.5 text-[0.78rem] font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}