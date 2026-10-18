import type { HighlightStat } from "@/types/content";

type StatsBarProps = {
  stats: HighlightStat[];
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="bg-brand-deep">
      <div className="mx-auto grid max-w-4xl divide-x divide-white/10 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="px-8 py-10 text-center">
            <p className="font-heading text-[2.6rem] font-bold leading-none text-brand-accent">
              {stat.value}
            </p>
            <p className="mt-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white/55">
              {stat.label}
            </p>
            {stat.description && (
              <p className="mt-1 text-sm text-white/30">{stat.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}