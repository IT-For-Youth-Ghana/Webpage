# IT For Youth Ghana design system

## Product and audience

IT For Youth Ghana is a public NGO website for young Ghanaians, training applicants, partners and donors. The homepage should feel credible, warm and editorial, with real photography carrying the emotional weight.

## Brand

- Primary blue: `#1E72BA`; supporting blue: `#0152BE`; deep navy: `#142850`; stage black: `#05070F`.
- Accent crimson: `#D70B52`; dark crimson: `#B00944`.
- Light blue: `#E8F1FA`; paper: `#FFFFFF`; ink: `#1A1A1A`; muted text: `#5C6672`.
- Body text uses the configured sans family. Display headlines use the configured editorial serif.
- Keep colors restrained. Do not introduce purple, neon, pastel or gradient colors outside the existing per-slide photographic wash.

## Shape and spacing

- Named radii: controls 6px, media 12px, panels 24px, fully round elements 999px.
- The hero capsule is an inset, wide rounded rectangular shell. It never fills the whole hero viewport.
- On desktop, a circular media lens sits fully inside the left half of the shell with visible breathing room on all four sides. It must not form, replace or protrude through the shell's outer left edge.
- The text column occupies the right half. Eyebrow, heading, body and CTA pair align to one vertical axis.
- The active photograph is duplicated as a blurred full-bleed background inside the capsule shell only. The hero area outside the capsule remains the quiet deep-navy stage.
- On narrow screens, stack media above content inside one rounded panel. Keep the lens circular and contained.

## Components and interaction

- CTAs use the existing crimson solid and white-outline button treatments.
- Carousel controls stay below the capsule, centered and separate from both media and CTAs.
- Preserve keyboard labels, focus rings and the live-region announcement.
- Autoplay is disabled when reduced motion is requested. All image crossfades become immediate.

## Motion

- Entrance: one restrained fade/translate on the capsule.
- Slide change: crossfade the sharp lens image and its matching blurred shell background together.
- Avoid continuous decorative motion.

## Target capsule reference

The approved hand sketch in `docs/IMG_20260825_123945.jpg` is the structural source of truth: inset shell, contained circular media on the left, copy and CTAs on the right, blurred media inside the shell background.
