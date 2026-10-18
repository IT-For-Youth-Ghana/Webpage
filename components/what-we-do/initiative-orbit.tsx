"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { safeCssColor } from "@/lib/utils/css-color";

export type OrbitInitiative = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  accent?: string;
};

type InitiativeOrbitProps = {
  initiatives: OrbitInitiative[];
};

const FALLBACK_ACCENT = "#1E72BA";
/** Pointer distance at which a node stops responding at all. */
const FALLOFF = 140;
/** How close the pointer must be for a node to open. */
const OPEN_RADIUS = 90;

/**
 * The capsule idea at a small scale.
 *
 * Eight circles in a row; the one nearest the pointer opens rightwards into a
 * named capsule while its circle stays exactly where it was, so the circle
 * becomes the capsule's leading lobe rather than being swapped for one. Same
 * geometric premise as the homepage hero, a different object on screen.
 *
 * Proximity is a pointer idea, so it is gated on a fine hover-capable pointer
 * and a wide enough viewport. Everywhere else the row is a plain stack of
 * already-open capsules, which is a simpler honest version rather than a broken
 * version of the desktop one. Click and keyboard focus open a node in every
 * mode, so the interaction is never pointer-only.
 */
export function InitiativeOrbit({ initiatives }: InitiativeOrbitProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const nodeRefs = useRef<Array<HTMLElement | null>>([]);

  const canHover = useMediaQuery("(min-width: 821px) and (hover: hover)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const proximityEnabled = canHover && !prefersReducedMotion;

  const handlePointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!proximityEnabled) return;

      let nearest: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      nodeRefs.current.forEach((node, index) => {
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const centreX = rect.left + rect.width / 2;
        const centreY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centreX, event.clientY - centreY);

        const proximity = Math.max(0, 1 - distance / FALLOFF);
        node.style.transform = `scale(${(1 + proximity * 0.14).toFixed(3)})`;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      setOpenIndex(nearestDistance < OPEN_RADIUS ? nearest : null);
    },
    [proximityEnabled],
  );

  const handlePointerLeave = useCallback(() => {
    if (!proximityEnabled) return;
    nodeRefs.current.forEach((node) => {
      if (node) node.style.transform = "scale(1)";
    });
    setOpenIndex(null);
  }, [proximityEnabled]);

  if (!initiatives.length) return null;

  /* Below the pointer breakpoint every node is open, so the row must not also
     apply the shrink-to-make-room sizing. */
  const isAnyOpen = proximityEnabled && openIndex !== null;

  return (
    <div
      className="itfy-orbit"
      data-open={isAnyOpen}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {initiatives.map((initiative, index) => {
        const accent = safeCssColor(initiative.accent, FALLBACK_ACCENT);
        const isOpen = proximityEnabled ? openIndex === index : true;

        return (
          <Link
            key={initiative.slug}
            href={`/what-we-do/${initiative.slug}`}
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
            aria-expanded={isOpen}
            className="itfy-orbit__node focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white focus-visible:ring-offset-[3px]"
            style={{ ["--tw-ring-offset-color" as string]: accent }}
            onFocus={() => setOpenIndex(index)}
            onBlur={() => setOpenIndex(null)}
          >
            <span
              className="itfy-orbit__lens"
              style={{ boxShadow: `0 0 0 3px #fff, 0 0 0 5px ${accent}` }}
            >
              <Image
                src={initiative.image}
                alt=""
                fill
                sizes="(max-width: 820px) 76px, 120px"
                className="object-cover"
              />
              <span className="itfy-orbit__wash" style={{ backgroundColor: accent }} aria-hidden="true" />
            </span>

            <span className="itfy-orbit__body">
              <span className="block whitespace-nowrap font-heading text-xl font-bold text-brand-ink max-[820px]:whitespace-normal max-[820px]:text-lg">
                {initiative.name}
              </span>
              <span className="mt-1 block text-[12.5px] leading-[1.55] text-brand-muted">
                {initiative.tagline}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
