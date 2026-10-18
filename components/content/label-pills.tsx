import { cn } from "@/lib/utils/cn";

type LabelPillsProps = {
  /** Short labels: names, tags, skills, included items. Not sentences. */
  items: string[];
  tone?: "mist" | "warm" | "outline" | "dark";
  className?: string;
};

const toneClasses = {
  mist: "border-brand-border bg-brand-mist/70 text-brand-ink",
  warm: "border-transparent bg-brand-warm text-brand-ink",
  outline: "border-brand-border bg-white text-slate-600",
  dark: "border-white/25 bg-white/10 text-white",
};

/**
 * Short labels as pills.
 *
 * The counterpart to PanelList: arrays of whole sentences become panels, while
 * arrays of short labels become pills. Both exist so a content array never has
 * to be rendered as a dot-and-line list, and so the choice between them is
 * about what the data actually is rather than about styling.
 */
export function LabelPills({ items, tone = "mist", className }: LabelPillsProps) {
  const visible = items.filter((item) => item?.trim());
  if (!visible.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-capsule border px-3 py-1 text-xs font-semibold",
            toneClasses[tone],
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
