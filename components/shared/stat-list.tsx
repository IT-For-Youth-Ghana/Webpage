import type { HighlightStat } from "@/types/content";
import { Card } from "@/components/ui/card";

type StatListProps = {
  stats: HighlightStat[];
  compact?: boolean;
};

export function StatList({ stats, compact = false }: StatListProps) {
  const visibleStats = stats.filter((stat) =>
    [stat.value, stat.label, stat.description].some((value) => value?.trim()),
  );

  if (!visibleStats.length) return null;

  return (
    <div className={`grid gap-4 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3"}`}>
      {visibleStats.map((stat, index) => (
        <Card key={`${stat.label}-${index}`} className="rounded-3xl">
          {stat.value?.trim() ? <p className="font-heading text-3xl font-semibold text-brand-deep">{stat.value}</p> : null}
          {stat.label?.trim() ? <p className="mt-2 text-base font-semibold text-brand-ink">{stat.label}</p> : null}
          {stat.description?.trim() ? <p className="mt-2 text-base leading-7 text-slate-600">{stat.description}</p> : null}
        </Card>
      ))}
    </div>
  );
}
