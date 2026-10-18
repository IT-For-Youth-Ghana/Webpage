import { cn } from "@/lib/utils/cn";

type MediaFallbackProps = {
  /**
   * What the slot stands for. A person's name yields a monogram; anything else
   * is set as a wordmark. Empty falls back to the organisation's initials.
   */
  label?: string | null;
  variant?: "wordmark" | "monogram";
  /**
   * Which ground the slot sits on. A hero panel puts white type over its media,
   * so the stand-in there has to be dark or the panel becomes unreadable.
   */
  tone?: "light" | "dark";
  className?: string;
};

const ORGANISATION = "IT For Youth Ghana";

/** First letters of the first two words, so "Ama Boateng" reads as AB. */
function initials(value: string) {
  const parts = value
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "IT";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The considered typographic treatment that stands in for a photograph the
 * content system has not been given yet.
 *
 * The rule this exists to satisfy: a missing image must never render as a
 * gradient, a grey rectangle, or an empty bordered box. A gradient placeholder
 * is worse than an obvious hole because it looks like a design decision, so
 * nobody fixes it. This reads as deliberate typography and still occupies the
 * exact proportions the real photograph will occupy, which is what keeps the
 * layout honest while the media is outstanding.
 *
 * It is also the correct treatment for a named person with no portrait. Never
 * substitute a stock face for someone the page identifies by name.
 *
 * Decorative by definition: there is no photograph, so there is nothing for a
 * screen reader to describe. The surrounding content carries the meaning.
 */
export function MediaFallback({
  label,
  variant = "wordmark",
  tone = "light",
  className,
}: MediaFallbackProps) {
  const text = label?.trim() || ORGANISATION;
  const isMonogram = variant === "monogram";
  const onDark = tone === "dark";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center",
        onDark ? "bg-brand-deep" : "bg-brand-mist",
        className,
      )}
    >
      {isMonogram ? (
        <span
          className={cn(
            "font-heading text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-none tracking-tight",
            onDark ? "text-white/80" : "text-brand-deep/70",
          )}
        >
          {initials(text)}
        </span>
      ) : (
        <span
          className={cn(
            "font-heading text-[clamp(1.0625rem,2.2vw,1.625rem)] font-bold leading-tight tracking-tight",
            onDark ? "text-white/80" : "text-brand-deep/70",
          )}
        >
          {text}
        </span>
      )}
      <span className="block h-px w-12 bg-brand-accent" />
    </div>
  );
}
