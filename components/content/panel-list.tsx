import { cn } from "@/lib/utils/cn";

type PanelListProps = {
  /** Sentences from a content array such as objectives, groups or eligibility. */
  items: string[];
  tone?: "mist" | "dark" | "plain";
  /** Identity colour for the leading rule on each panel. */
  accent?: string;
  columns?: 1 | 2;
  className?: string;
};

const toneClasses = {
  mist: "border-brand-border bg-brand-mist/55 text-slate-700",
  dark: "border-white/10 bg-white/[0.06] text-white/85",
  plain: "border-brand-border bg-white text-slate-700",
};

/**
 * Renders a content array as separated panels.
 *
 * The content model is full of arrays (objectives, groups, eligibility,
 * contributions, responsibilities, supportPoints, priorities) and the arrays
 * stay, because they keep the CMS structured and editable. What changes is the
 * presentation: these are never rendered as a dot-and-line list. Each entry is
 * a distinct visual unit with its own accent rule, so a set of sentences reads
 * as considered editorial content rather than a checklist.
 */
export function PanelList({
  items,
  tone = "mist",
  accent,
  columns = 1,
  className,
}: PanelListProps) {
  const visible = items.filter((item) => item?.trim());
  if (!visible.length) return null;

  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
    >
      {visible.map((item) => (
        <div
          key={item}
          className={cn(
            "relative overflow-hidden rounded-panel border pl-6 pr-5 py-4 text-sm leading-7",
            toneClasses[tone],
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-4 left-0 w-[3px] rounded-capsule"
            style={{ backgroundColor: accent ?? "var(--color-accent)" }}
          />
          {item}
        </div>
      ))}
    </div>
  );
}
