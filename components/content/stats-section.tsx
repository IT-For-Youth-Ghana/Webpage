import type { HighlightStat } from "@/types/content";

type StatsSectionProps = {
  stats: HighlightStat[];
  eyebrow?: string;
  title?: string;
  tone?: "white" | "mist" | "navy";
};

/** Editorial statistics: one connected statement rather than dashboard cards. */
export function StatsSection({ stats, eyebrow, title, tone = "mist" }: StatsSectionProps) {
  const visibleStats = stats.filter((stat) => stat.value?.trim() || stat.label?.trim());
  if (!visibleStats.length) return null;
  const isDark = tone === "navy";

  return (
    <section className={`${tone === "navy" ? "bg-brand-deep" : tone === "mist" ? "bg-brand-primary-light/45" : "bg-white"} py-section-md`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow || title ? <div className="mb-10 max-w-3xl">
          {eyebrow ? <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-brand-warm" : "text-brand-accent"}`}>{eyebrow}</p> : null}
          {title ? <h2 className={`mt-3 font-heading text-4xl font-bold sm:text-5xl ${isDark ? "text-white" : "text-brand-ink"}`}>{title}</h2> : null}
        </div> : null}
        <div className="grid divide-y divide-brand-border border-y border-brand-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {visibleStats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="px-4 py-7 sm:px-7">
              <p className={`font-heading text-5xl font-bold leading-none sm:text-6xl ${isDark ? "text-white" : "text-brand-deep"}`}>{stat.value}</p>
              <p className={`mt-3 text-base font-bold ${isDark ? "text-white" : "text-brand-ink"}`}>{stat.label}</p>
              {stat.description ? <p className={`mt-2 text-base leading-6 ${isDark ? "text-white/70" : "text-slate-600"}`}>{stat.description}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
