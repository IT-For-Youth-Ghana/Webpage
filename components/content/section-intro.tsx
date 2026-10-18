import { cn } from "@/lib/utils/cn";

type SectionIntroProps = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  /** Identity colour for the eyebrow rule. */
  accent?: string;
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * The redesigned section opener.
 *
 * Deliberately separate from PageHeader (exported as SectionHeading) rather
 * than a change to it. PageHeader is used on around fifty pages that have not
 * been redesigned yet, and quietly restyling all of them would be an
 * uncontrolled visual change. This is used by redesigned pages only, so the two
 * treatments coexist until the rest of the site catches up.
 *
 * The difference is the eyebrow: weight comes from a short accent rule plus
 * type, rather than from colouring the text itself.
 */
export function SectionIntro({
  eyebrow,
  title,
  description,
  accent = "var(--color-accent)",
  tone = "light",
  as: Heading = "h2",
  className,
}: SectionIntroProps) {
  if (!eyebrow?.trim() && !title?.trim() && !description?.trim()) return null;

  const isDark = tone === "dark";

  return (
    <header className={cn("max-w-3xl space-y-3", className)}>
      {eyebrow?.trim() ? (
        <p
          className={cn(
            "flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.28em]",
            isDark ? "text-white" : "text-brand-ink",
          )}
        >
          <span
            aria-hidden="true"
            className="h-[2px] w-6 flex-none"
            style={{ backgroundColor: accent }}
          />
          {eyebrow}
        </p>
      ) : null}

      {title?.trim() ? (
        <Heading
          className={cn(
            "font-heading text-3xl font-bold leading-snug sm:text-4xl",
            isDark ? "text-white" : "text-brand-ink",
          )}
        >
          {title}
        </Heading>
      ) : null}

      {description?.trim() ? (
        <p className={cn("text-base leading-8", isDark ? "text-white/75" : "text-slate-600")}>
          {description}
        </p>
      ) : null}
    </header>
  );
}
