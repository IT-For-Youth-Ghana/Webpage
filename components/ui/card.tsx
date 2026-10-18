import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "default" | "muted" | "dark";
  variant?: "surface" | "feature" | "story" | "resource" | "stat";
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const toneClasses = {
  default: "border-brand-border bg-white text-brand-ink shadow-sm",
  muted: "border-brand-border bg-brand-mist/45 text-brand-ink",
  dark: "border-brand-deep bg-brand-deep text-white shadow-panel",
};

const variantClasses = {
  surface: "",
  feature: "overflow-hidden rounded-media transition duration-300 hover:-translate-y-1 hover:shadow-editorial",
  story: "rounded-media shadow-editorial",
  resource: "rounded-media",
  stat: "rounded-none border-x-0 border-y-0 shadow-none",
};

/** Shared surface treatment for grouped content. */
export function Card({
  className,
  padding = "md",
  tone = "default",
  variant = "surface",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-media border", paddingClasses[padding], toneClasses[tone], variantClasses[variant], className)}
      {...props}
    />
  );
}
