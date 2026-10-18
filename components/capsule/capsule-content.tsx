import type { ReactNode } from "react";

import { splitHeading } from "@/components/capsule/split-heading";
import { cn } from "@/lib/utils/cn";

type CapsuleContentProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  /** Identity colour for the eyebrow rule. */
  accent?: string;
  /** Renders the heading as an h1. Exactly one per page should. */
  as?: "h1" | "h2";
  tone?: "dark" | "paper";
  children?: ReactNode;
};

/**
 * The text side of a capsule.
 *
 * The heading is split into two clauses and the trailing clause drops to a
 * lighter tone, which is what turns a long serif headline into an editorial
 * two-beat read rather than one dense block.
 */
export function CapsuleContent({
  eyebrow,
  heading,
  body,
  accent = "#1E72BA",
  as: Heading = "h2",
  tone = "dark",
  children,
}: CapsuleContentProps) {
  const { first, second } = splitHeading(heading);
  const isDark = tone === "dark";

  return (
    <>
      {eyebrow ? (
        <p
          className={cn(
            "flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.2em] max-[820px]:justify-center",
            isDark ? "text-white" : "text-brand-ink",
          )}
        >
          <span
            aria-hidden="true"
            className="h-[2px] w-[26px] flex-none max-[820px]:hidden"
            style={{ backgroundColor: accent }}
          />
          {eyebrow}
        </p>
      ) : null}

      <Heading
        className={cn(
          "mt-[18px] text-balance font-heading text-[clamp(2rem,3.5vw,3.35rem)]",
          isDark ? "text-white" : "text-brand-ink",
        )}
      >
        {first}
        {second ? (
          <span className={cn("block", isDark ? "text-white/60" : "text-brand-muted")}>
            {second}
          </span>
        ) : null}
      </Heading>

      {body ? (
        <p
          className={cn(
            "mt-5 max-w-[56ch] text-base leading-[1.72] max-[820px]:mx-auto",
            isDark ? "text-white/[0.82]" : "text-brand-muted",
          )}
        >
          {body}
        </p>
      ) : null}

      {children}
    </>
  );
}
