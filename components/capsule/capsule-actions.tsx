import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type CapsuleAction = {
  label: string;
  href: string;
};

type CapsuleActionsProps = {
  primary: CapsuleAction;
  secondary?: CapsuleAction;
  tone?: "dark" | "paper";
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-control border-[1.5px] px-6 py-3.5 text-[0.9375rem] font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/* The focus ring has to contrast with whatever the capsule sits on, so it
   follows the tone rather than assuming the dark stage. */
const focusByTone = {
  dark: "focus-visible:ring-white focus-visible:ring-offset-[#05070f]",
  paper: "focus-visible:ring-brand-accent focus-visible:ring-offset-white",
} as const;

/**
 * The action pair.
 *
 * The trailing mark on the primary action is CSS geometry rather than an icon
 * component: this design language carries weight through colour, shape, type
 * and spacing, so nothing here imports an icon set.
 */
export function CapsuleActions({
  primary,
  secondary,
  tone = "dark",
  className,
}: CapsuleActionsProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn("mt-[30px] flex flex-wrap gap-3 max-[820px]:justify-center", className)}>
      <Link
        href={primary.href}
        className={cn(base, focusByTone[tone], "border-brand-accent bg-brand-accent text-white hover:border-brand-accent-dark hover:bg-brand-accent-dark")}
      >
        {primary.label}
        <span
          aria-hidden="true"
          className="size-1.5 flex-none rotate-45 border-r-[1.6px] border-t-[1.6px] border-current"
        />
      </Link>

      {secondary ? (
        <Link
          href={secondary.href}
          className={cn(
            base,
            focusByTone[tone],
            isDark
              ? "border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10"
              : "border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white",
          )}
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}
