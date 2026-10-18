import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CapsuleShellProps = {
  /** The circular lens. */
  media: ReactNode;
  /** The text side. */
  children: ReactNode;
  /** Optional fill clipped to the shell, used by the homepage hero. */
  tone?: "dark" | "paper";
  /**
   * "hero" is the contained-lens layout: the circle sits inside a rounded
   * rectangular shell. "pageHero" is that same layout, wider and shallower,
   * for an interior page. "inline" is the leading-lobe pill.
   */
  variant?: "inline" | "hero" | "pageHero";
  /** Set false for a shell that is already on screen, e.g. a static page. */
  animateIn?: boolean;
  className?: string;
};

/**
 * The shared capsule silhouette.
 *
 * Inline capsules keep the established leading-lobe treatment. Both hero
 * variants use the contained-lens form from the concept sketch: the circular
 * media sits inside a rounded rectangular shell, and the shell is translucent
 * glass over the stage's blurred photograph, which CapsuleStage owns. The
 * leading-lobe form was never right for a hero, because its merge mask fades
 * the photograph out across the headline; the contained lens keeps the whole
 * circle intact and the text on clean glass.
 *
 * Deliberately knows nothing about slideshows. Give it static content and it is
 * a static capsule.
 */
export function CapsuleShell({
  media,
  children,
  tone = "dark",
  variant = "inline",
  animateIn = true,
  className,
}: CapsuleShellProps) {
  return (
    <div
      className={cn(
        "itfy-capsule",
        tone === "dark" ? "itfy-capsule--dark" : "itfy-capsule--paper",
        variant !== "inline" && "itfy-capsule--hero",
        variant === "pageHero" && "itfy-capsule--page",
        animateIn && "itfy-animate-capsule-in",
        className,
      )}
    >
      <div className="itfy-capsule__media">{media}</div>
      <div className="itfy-capsule__content">{children}</div>
    </div>
  );
}
