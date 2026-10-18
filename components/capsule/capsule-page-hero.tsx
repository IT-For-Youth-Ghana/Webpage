import Link from "next/link";
import type { ReactNode } from "react";

import { CapsuleActions } from "@/components/capsule/capsule-actions";
import { CapsuleContent } from "@/components/capsule/capsule-content";
import { CapsuleMedia } from "@/components/capsule/capsule-media";
import { CapsuleShell } from "@/components/capsule/capsule-shell";
import { CapsuleStage } from "@/components/capsule/capsule-stage";
import { safeCssColor } from "@/lib/utils/css-color";

type Crumb = {
  label: string;
  href?: string;
};

type Action = {
  label: string;
  href: string;
};

type CapsulePageHeroProps = {
  eyebrow?: string;
  title: string;
  /** The lead paragraph inside the capsule. */
  description?: string;
  /** A second paragraph, set off by an accent rule. */
  supportingText?: string | null;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs?: Crumb[];
  primaryAction?: Action;
  secondaryAction?: Action;
  /** Identity colour for the eyebrow rule, the lens ring and the supporting rule. */
  accent?: string;
  children?: ReactNode;
};

const FALLBACK_ACCENT = "#1E72BA";

/* The interior hero's wash is fixed rather than per-page. The homepage takes
   overlayFrom and overlayTo from each CMS slide because slides have to differ
   from each other; interior pages have to look like each other, so identity is
   carried by the accent on the eyebrow rule, the lens ring and the primary
   action instead of by the ground. */
const STAGE_OVERLAY_FROM = "rgba(6,12,28,0.88)";
const STAGE_OVERLAY_TO = "rgba(6,12,28,0.44)";

/**
 * The standard hero for an interior page: the capsule at rest.
 *
 * This is the homepage hero's composition, minus the slideshow. The circular
 * lens sits contained inside a rounded rectangular glass shell, and the shell
 * sits on the page's own photograph, blurred across the stage behind it: the
 * same frame reads sharp in the lens and soft everywhere else, which is what
 * ties the object to its ground.
 *
 * It previously used the leading-lobe pill on a light band, and that was the
 * wrong form for a hero. The pill's merge mask exists to dissolve the
 * photograph into the shell's fill, so on paper it faded a ghost of the
 * photograph across the headline and left a visible seam where the mask ended.
 * The contained lens has no mask to fade, so the circle stays whole and the
 * text sits on clean glass.
 *
 * It still reads as a quieter object than the homepage: the shell is wider and
 * shallower, it does not move, and the ring around the lens is a closed accent
 * circle rather than a travelling autoplay arc.
 */
export function CapsulePageHero({
  eyebrow,
  title,
  description,
  supportingText,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryAction,
  secondaryAction,
  accent,
  children,
}: CapsulePageHeroProps) {
  const resolvedAccent = safeCssColor(accent, FALLBACK_ACCENT);

  return (
    <CapsuleStage
      variant="page"
      images={[{ id: imageSrc, src: imageSrc }]}
      overlayFrom={STAGE_OVERLAY_FROM}
      overlayTo={STAGE_OVERLAY_TO}
    >
      {breadcrumbs?.length ? (
        <nav aria-label="Breadcrumb" className="itfy-stage__crumbs">
          <p className="text-base text-white/65">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`}>
                {index > 0 ? (
                  <span aria-hidden="true" className="px-2 text-white/30">/</span>
                ) : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </p>
        </nav>
      ) : null}

      <CapsuleShell
        variant="pageHero"
        animateIn={false}
        media={
          <CapsuleMedia
            images={[{ id: imageSrc, src: imageSrc, alt: imageAlt }]}
            accent={resolvedAccent}
            accentRing
            priority
            sizes="(max-width: 440px) calc(100vw - 80px), (max-width: 820px) 392px, (max-width: 1280px) 40vw, 500px"
          />
        }
      >
        <CapsuleContent
          as="h1"
          eyebrow={eyebrow}
          heading={title}
          body={description}
          accent={resolvedAccent}
        >
          {supportingText?.trim() ? (
            <p
              className="mt-5 max-w-[56ch] border-l-2 pl-5 text-base leading-7 text-white/70 max-[820px]:mx-auto max-[820px]:border-l-0 max-[820px]:pl-0"
              style={{ borderColor: resolvedAccent }}
            >
              {supportingText}
            </p>
          ) : null}

          {primaryAction ? (
            <CapsuleActions primary={primaryAction} secondary={secondaryAction} />
          ) : null}

          {children}
        </CapsuleContent>
      </CapsuleShell>
    </CapsuleStage>
  );
}
