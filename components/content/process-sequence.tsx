import { cn } from "@/lib/utils/cn";

type ProcessStep = {
  number?: string;
  title: string;
  description?: string;
};

type ProcessSequenceProps = {
  steps: ProcessStep[];
  /** Identity colour for the spine and the step nodes. */
  accent?: string;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * A strict sequence rendered as a line.
 *
 * The visual metaphor is matched to the structure of the content: these steps
 * run in order and never branch, so they get a single continuous spine rather
 * than a tree, which would imply branching that is not there, or a grid, which
 * would lose the order entirely.
 *
 * Weight is carried by the numeral, the spine and the accent nodes. No icons.
 */
export function ProcessSequence({
  steps,
  accent = "var(--color-primary)",
  tone = "light",
  className,
}: ProcessSequenceProps) {
  const visible = steps.filter((step) => step.title?.trim() || step.description?.trim());
  if (!visible.length) return null;

  const isDark = tone === "dark";

  return (
    /* An ordered list is the correct semantics for a genuine sequence, so
       screen readers announce the ordering. The dot-and-line presentation is
       what is removed, not the meaning. */
    <ol className={cn("relative m-0 list-none p-0", className)}>
      {visible.map((step, index) => (
        <li
          key={`${step.title}-${index}`}
          className={cn("relative grid grid-cols-[56px_1fr] gap-5", index > 0 && "mt-10")}
        >
          {/* Connector drawn per step and omitted on the last one, so the
              spine terminates at the final node instead of running past it. */}
          {index < visible.length - 1 ? (
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-[27px] top-14 h-[calc(100%-3.5rem+2.5rem)] w-px",
                isDark ? "bg-white/15" : "bg-brand-border",
              )}
            />
          ) : null}

          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 flex size-14 items-center justify-center rounded-full border font-heading text-lg font-bold",
              isDark ? "border-white/15 bg-[#0b1220] text-white" : "border-brand-border bg-white text-brand-ink",
            )}
            style={{ borderColor: accent }}
          >
            {step.number?.trim() || String(index + 1).padStart(2, "0")}
          </span>

          <div className="pt-2.5">
            <h3
              className={cn(
                "font-heading text-xl font-bold",
                isDark ? "text-white" : "text-brand-ink",
              )}
            >
              {step.title}
            </h3>
            {step.description?.trim() ? (
              <p
                className={cn(
                  "mt-2 text-base leading-7",
                  isDark ? "text-white/75" : "text-slate-600",
                )}
              >
                {step.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
