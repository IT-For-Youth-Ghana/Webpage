import Image from "next/image";
import Link from "next/link";

import { safeCssColor } from "@/lib/utils/css-color";
import type { InitiativePage, PathwayCardContent } from "@/types/content";

type PathwayTreeProps = {
  stages: PathwayCardContent[];
  initiatives: InitiativePage[];
};

const FALLBACK_ACCENT = "#1E72BA";

/**
 * The pathway as a real tree, with its asymmetry intact.
 *
 * The portfolio genuinely branches and it branches unevenly: three initiatives
 * bring learners in, two build capability, two put it to work, one carries the
 * argument outward. Column widths follow that distribution, so the shape of the
 * portfolio is the layout rather than something the layout hides. Four equal
 * cards would claim the stages are the same size, which is false.
 *
 * The branches are small labelled pills rather than capsules on purpose. Eight
 * more capsules directly beneath the orbit would be a rerun; the tree earns a
 * different form, and choosing not to use the capsule is part of the system.
 */
export function PathwayTree({ stages, initiatives }: PathwayTreeProps) {
  const bySlug = new Map(initiatives.map((initiative) => [initiative.slug, initiative]));

  const resolved = stages.map((stage) => ({
    ...stage,
    branches: (stage.initiativeSlugs ?? [])
      .map((slug) => bySlug.get(slug))
      .filter((initiative): initiative is InitiativePage => Boolean(initiative)),
  }));

  if (!resolved.length) return null;

  /* Weight each column by how many initiatives it actually holds, so the
     asymmetry survives instead of being averaged away. A stage with no
     branches still gets a single share rather than collapsing. */
  const columns = resolved.map((stage) => `${Math.max(1, stage.branches.length)}fr`).join(" ");

  return (
    <div className="itfy-pathway" style={{ ["--pathway-columns" as string]: columns }}>
      {resolved.map((stage, index) => {
        const stageAccent = safeCssColor(stage.branches[0]?.accent, FALLBACK_ACCENT);

        return (
          <div key={stage.title}>
            <div className="border-t-2 pt-[18px]" style={{ borderColor: stageAccent }}>
              <p className="font-heading text-xs font-bold tracking-[0.16em] text-brand-muted">
                STAGE {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-heading text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold text-brand-ink">
                {stage.title}
              </h3>
              {stage.branches.length ? (
                <span className="mt-2.5 inline-block rounded-capsule border border-brand-border bg-[var(--color-bg-alt)] px-3 py-0.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-brand-muted">
                  {stage.branches.length} {stage.branches.length === 1 ? "initiative" : "initiatives"}
                </span>
              ) : null}
              <p className="mt-4 text-[14.5px] leading-[1.7] text-brand-muted">{stage.description}</p>
            </div>

            {stage.branches.length ? (
              <div className="mt-[22px] grid gap-2.5">
                {stage.branches.map((initiative) => {
                  const accent = safeCssColor(initiative.accent, FALLBACK_ACCENT);

                  return (
                    <Link
                      key={initiative.slug}
                      href={`/what-we-do/${initiative.slug}`}
                      className="group flex items-center gap-3 rounded-capsule border border-brand-border bg-white py-2.5 pl-2.5 pr-4 transition duration-200 hover:translate-x-1 hover:border-transparent hover:shadow-lg focus-visible:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ ["--tw-ring-color" as string]: accent }}
                    >
                      <span
                        className="relative size-[34px] flex-none overflow-hidden rounded-full"
                        style={{ backgroundColor: accent }}
                      >
                        <Image
                          src={initiative.heroImage}
                          alt=""
                          fill
                          sizes="34px"
                          className="object-cover opacity-60 transition duration-300 group-hover:opacity-80"
                        />
                      </span>
                      <span className="text-sm font-semibold leading-tight text-brand-ink">
                        {initiative.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
