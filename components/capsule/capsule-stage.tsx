import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type StageImage = {
  id: string;
  src: string;
};

type CapsuleStageProps = {
  images: StageImage[];
  activeIndex?: number;
  /** The wash over the blur. Per-slide on the homepage, fixed on a page hero. */
  overlayFrom: string;
  overlayTo: string;
  /**
   * "viewport" fills the first screen and reserves the lower controls band:
   * the homepage slideshow. "page" is the same ground at interior-page height,
   * with no controls band to reserve and no viewport minimum to fill, so the
   * hero introduces the page instead of replacing the first screen of it.
   */
  variant?: "viewport" | "page";
  className?: string;
  children: React.ReactNode;
};

/**
 * The ground a capsule sits on: a blurred photograph, with the shell inset on
 * top of it.
 *
 * The blurred duplicate belongs here rather than inside the capsule. The
 * concept sketch labels it as the hero's background, and it has to be visible
 * around the shell for that to mean anything: the same photograph reads sharp
 * inside the circular lens and soft everywhere else.
 *
 * Sizing for the whole hero, the capsule included, comes from the custom
 * properties on .itfy-hero-stage in app/globals.css. They are defined there so
 * the capsule, the breadcrumbs and the controls inherit one --hero-capsule-h
 * and cannot drift.
 */
export function CapsuleStage({
  images,
  activeIndex = 0,
  overlayFrom,
  overlayTo,
  variant = "viewport",
  className,
  children,
}: CapsuleStageProps) {
  return (
    <div
      className={cn(
        "itfy-hero-stage",
        variant === "page" && "itfy-hero-stage--page",
        "relative isolate grid place-items-center overflow-x-hidden bg-[#05070f]",
        variant === "viewport" && "min-h-[calc(100svh-65px)]",
        className,
      )}
    >
      <div className="itfy-stage__bg" aria-hidden="true">
        {images.map((image, index) => (
          <div key={image.id} className="itfy-stage__shot" data-active={index === activeIndex}>
            <Image
              src={image.src}
              alt=""
              fill
              quality={40}
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}

        <div
          className="itfy-stage__wash"
          style={{
            background: `radial-gradient(ellipse at 30% 45%, rgba(3,6,14,0.12) 0%, rgba(3,6,14,0.46) 58%, rgba(3,6,14,0.80) 100%), linear-gradient(145deg, ${overlayFrom} 0%, ${overlayTo} 48%, rgba(3,6,14,0.90) 100%)`,
          }}
        />
      </div>

      {children}
    </div>
  );
}
