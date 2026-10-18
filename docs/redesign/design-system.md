# ITFYG Design System: Reconciled

**Status:** Proposed. Nothing in this document has been applied to the codebase.
**Repository identity:** `new_site` @ `37db40a`, verified before writing.
**Scope:** public site only. Admin UI is out of scope and keeps its current treatment.

Two inputs govern this document. The **code** says what exists: `app/globals.css`,
`tailwind.config.ts`, `components/capsule/*`, `components/media/*`,
`components/shared/*`, `components/content/*`, `components/ui/*`, and the ratchet
in `components/capsule/design-rules.test.ts`. The **brief** says what to build.
Where they disagree, the disagreement is named rather than silently resolved.

Every contrast figure below was computed with the WCAG 2.x formula in
`lib/utils/contrast.ts`, not judged by eye. Ratios are stated to two decimals.

---

## 0. What this system is for

IT For Youth Ghana trains young Ghanaians in digital skills and routes them into
work, further study or enterprise. The site serves three audiences that never
want the same page: learners looking for a cohort, organisations looking for a
service, and partners or funders looking for evidence.

So the site is a routing problem wearing a magazine's clothes. The design system
has to do two jobs at once: carry editorial weight, and make it obvious at every
scroll position which of the three audiences a section is talking to.

Three structural devices carry that, and they are the whole system:

1. **The orientation typology.** Programme content is wide. People are tall. The
   circle is the joint between them. This is a rule about **subject**, not about
   supply: a room full of activity is a wide subject and a person is a tall one,
   so the frame follows what is being shown. `docs/redesign/media-policy.md`
   retired the earlier justification, which fixed treatment selection to the
   orientation mix of the existing archive; the archive is now placeholder media
   and is not an input to layout. The typology survives the change because it was
   always a better rule than its old reason. What it buys: a reader can tell what
   kind of content a section holds from across the room, before reading a word.
2. **The annotation rail.** A fixed narrow column at the page's leading edge
   carrying eyebrows, captions, ordinals and statistic labels. It is what makes
   the asymmetric grid mean something instead of being decoration, and it is why
   captions are edge-anchored rather than tucked under images.
3. **The capsule.** One circular media form merging with a text block into a
   single silhouette. It is the signature, and it is spent sparingly. Section 4
   is mostly about when *not* to use it.

Everything else in this document is discipline around those three.

---

## 1. Typography

### 1.1 The faces

Two families, both already installed and imported in `app/layout.tsx`:

| Role | Family | Axis used | Why |
| --- | --- | --- | --- |
| Display and headings | Playfair Display Variable | 500–800 | High-contrast transitional serif. Its thin strokes need size to survive, which forces major statements to occupy real space rather than be set at 24px and hedged. |
| Body, UI, data | DM Sans Variable | 400–700 | Low-contrast geometric grotesque, wide apertures, tall x-height. Legible at 11px uppercase for labels and at 17px for long prose, so one family covers both and no third face is needed. |

**No third face.** A utility/mono face was considered and rejected: DM Sans
Variable ships tabular figures, and every place a mono face would have gone
(statistic labels, table columns, the rail) is served by DM Sans 600 uppercase
with `font-variant-numeric: tabular-nums`. Adding a family for that would be a
dependency with no job.

**Two corrections to how Playfair is currently set.** Both matter and neither is
cosmetic:

- `app/globals.css` sets every heading to `font-weight: 700`. Playfair's 700 at
  5rem+ thickens the stems until the thin strokes read as artefacts. Display
  sizes take **600**; only headline and below take 700.
- `letter-spacing: -0.025em` is applied at every heading size. Optical tracking is
  size-dependent: -0.025em is right around 2.5rem, too loose at 6rem and too tight
  at 1.25rem. The scale below sets tracking per step.

### 1.2 The scale

Named roles, not t-shirt sizes. Each role names the job it does, so a component
cannot pick a size for looks.

```css
:root {
  /* ── Display: for major statements that must occupy real space ─────────── */
  --type-display-xl-size:     clamp(3.25rem, 7.2vw, 6.5rem);
  --type-display-xl-weight:   600;
  --type-display-xl-tracking: -0.032em;
  --type-display-xl-leading:  0.96;
  --type-display-xl-measure:  14ch;

  --type-display-size:        clamp(2.6rem, 5.4vw, 4.5rem);
  --type-display-weight:      600;
  --type-display-tracking:    -0.028em;
  --type-display-leading:     1.02;
  --type-display-measure:     16ch;

  /* ── Headline: section openers ─────────────────────────────────────────── */
  --type-headline-size:       clamp(2rem, 3.6vw, 3rem);
  --type-headline-weight:     700;
  --type-headline-tracking:   -0.022em;
  --type-headline-leading:    1.10;
  --type-headline-measure:    20ch;

  /* ── Subhead: card titles, figure titles, h3 ───────────────────────────── */
  --type-subhead-size:        clamp(1.25rem, 1.6vw, 1.6rem);
  --type-subhead-weight:      700;
  --type-subhead-tracking:    -0.014em;
  --type-subhead-leading:     1.22;
  --type-subhead-measure:     28ch;

  /* ── Deck: the lead paragraph under a display or headline ──────────────── */
  --type-deck-size:           clamp(1.125rem, 1.5vw, 1.4rem);
  --type-deck-weight:         400;
  --type-deck-tracking:       -0.004em;
  --type-deck-leading:        1.55;
  --type-deck-measure:        56ch;

  /* ── Body: the default reading size. Generous on purpose. ──────────────── */
  --type-body-size:           1.0625rem;   /* 17px, already the body default */
  --type-body-weight:         400;
  --type-body-tracking:       0;
  --type-body-leading:        1.70;
  --type-body-measure:        68ch;

  /* ── Body-long: article and course prose ───────────────────────────────── */
  --type-body-long-size:      1.125rem;
  --type-body-long-weight:    400;
  --type-body-long-leading:   1.85;
  --type-body-long-measure:   66ch;

  /* ── Caption: sits in the rail or under a figure ───────────────────────── */
  --type-caption-size:        0.8125rem;   /* 13px */
  --type-caption-weight:      500;
  --type-caption-tracking:    0.004em;
  --type-caption-leading:     1.50;
  --type-caption-measure:     42ch;

  /* ── Label: eyebrows, rail headings, pill text, table headers ──────────── */
  --type-label-size:          0.6875rem;   /* 11px: the floor. Nothing smaller. */
  --type-label-weight:        700;
  --type-label-tracking:      0.20em;
  --type-label-leading:       1.10;
  --type-label-transform:     uppercase;

  /* ── Statistic: a figure standing on its own ───────────────────────────── */
  --type-stat-size:           clamp(2.75rem, 5vw, 4.75rem);
  --type-stat-weight:         600;
  --type-stat-tracking:       -0.030em;
  --type-stat-leading:        0.92;

  --type-stat-sm-size:        clamp(1.75rem, 2.6vw, 2.5rem);
  --type-stat-sm-weight:      600;
  --type-stat-sm-tracking:    -0.024em;
  --type-stat-sm-leading:     1.00;
}
```

Applied:

```css
.type-display-xl,
.type-display,
.type-headline,
.type-subhead,
.type-stat,
.type-stat-sm {
  font-family: var(--font-heading);
  text-wrap: balance;
}

.type-display-xl {
  font-size: var(--type-display-xl-size);
  font-weight: var(--type-display-xl-weight);
  letter-spacing: var(--type-display-xl-tracking);
  line-height: var(--type-display-xl-leading);
  max-width: var(--type-display-xl-measure);
}
/* …display, headline, subhead follow the same four-property shape… */

.type-deck,
.type-body,
.type-body-long,
.type-caption,
.type-label {
  font-family: var(--font-body);
}

.type-body,
.type-body-long,
.type-deck {
  text-wrap: pretty;
  max-width: var(--type-body-measure); /* per-role measure */
}

.type-label {
  font-size: var(--type-label-size);
  font-weight: var(--type-label-weight);
  letter-spacing: var(--type-label-tracking);
  line-height: var(--type-label-leading);
  text-transform: var(--type-label-transform);
}

.type-stat,
.type-stat-sm {
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

### 1.3 Rules the scale enforces

- **The 11px floor.** `--type-label-size` is 0.6875rem and nothing goes below it.
  Existing components use 0.6rem (`route-card-grid.tsx:44`) and 0.65rem
  (`editorial-guidance-grid.tsx:63`); both come up to 11px. A 10px tier was
  drafted for the rail's ordinals and then cut, because one type size that only
  appears in one place is an accessory, not a system.
- **One display per page.** Exactly one element on any route uses
  `--type-display-xl` or `--type-display`, and it is the `h1`. A second display
  statement makes both of them smaller.
- **Measure is a property of the role, not the container.** A body paragraph is
  68ch wide whether it sits in a 12-column span or a 6-column one. Wide columns
  get more white space, never longer lines.
- **Tracking is never inherited across a size change.** Any component that
  overrides font-size overrides letter-spacing in the same rule.
- **Uppercase always carries tracking.** DM Sans uppercase at default tracking is
  cramped; 0.20em is the label default and 0.24em is permitted for a label sitting
  alone in the rail.

---

## 2. Colour

### 2.1 What is implemented

From `app/globals.css` `:root` and `tailwind.config.ts`. These are the tokens in
the running application.

| Token | Hex | Tailwind alias |
| --- | --- | --- |
| `--color-primary` | `#1E72BA` | `brand-primary` |
| `--color-primary-dark` | `#0152BE` | `brand-primary-dark`, `brand-secondary` |
| `--color-primary-light` | `#E8F1FA` | `brand-primary-light`, `brand-mist` |
| `--color-accent` | `#D70B52` | `brand-accent` |
| `--color-accent-dark` | `#B00944` | `brand-accent-dark` |
| `--color-text` | `#1A1A1A` | `brand-text`, `brand-ink` |
| `--color-text-muted` | `#5C6672` | `brand-muted` |
| `--color-bg` | `#FFFFFF` | `brand-background`, `brand-card` |
| `--color-bg-alt` | `#F7F9FC` | (no alias) |
| `--color-border` | `#D8E5F2` | `brand-border` |
| (deep ground) | `#142850` | `brand-deep` |
| (warm tint) | `#FBE7EF` | `brand-warm` |

> **The alias trap.** `brand-accent` is crimson `#D70B52`, not an orange or a
> gold. `brand-deep` is `#142850`, not the brief's navy. `brand-ink` and
> `brand-text` are the same colour. Never infer a value from an alias name; read
> `tailwind.config.ts`.

### 2.2 What the brief names

Navy `#0C2D5A`, Deep Navy `#081D3D`, Gold `#F5A623`, Teal `#157F6B`,
Ink `#11233F`, Mist `#EEF2F8`, Border `#E3E8F0`.

These are a different palette, not a refinement of the implemented one. The
implemented system is a **blue/crimson** scheme with one accent hue. The brief is
a **navy/gold/teal** scheme with two accent hues and no crimson at all. The
neutral pair is close enough to be a rounding difference (Mist `#E8F1FA` vs
`#EEF2F8`, Border `#D8E5F2` vs `#E3E8F0`); the chromatic identity is not.

### 2.3 Measured contrast

Computed with `lib/utils/contrast.ts`. AA body = 4.5:1, AA large = 3:1 (≥24px, or
≥19px bold), non-text UI boundary = 3:1.

**Implemented palette**

| Pairing | Ratio | AA body | AA large |
| --- | --- | --- | --- |
| white on `accent` `#D70B52` | 5.17 | PASS | PASS |
| white on `accent-dark` `#B00944` | 7.07 | PASS | PASS |
| `ink` on `accent` (**banned**, fixed in 947b5fe) | 3.36 | FAIL | PASS |
| `accent` on white | 5.17 | PASS | PASS |
| `accent` on `bg-alt` `#F7F9FC` | 4.91 | PASS | PASS |
| `accent` on `mist` `#E8F1FA` | 4.53 | PASS | PASS |
| **`accent` on `warm` `#FBE7EF`** | **4.38** | **FAIL** | PASS |
| `accent-dark` on `warm` | 5.99 | PASS | PASS |
| white on `primary` `#1E72BA` | 5.03 | PASS | PASS |
| `primary` on white | 5.03 | PASS | PASS |
| **`primary` on `mist`** | **4.41** | **FAIL** | PASS |
| `primary-dark` on `mist` | 6.23 | PASS | PASS |
| `primary-dark` on white | 7.11 | PASS | PASS |
| white on `deep` `#142850` | 14.49 | PASS | PASS |
| `deep` on white | 14.49 | PASS | PASS |
| `deep` on `mist` | 12.69 | PASS | PASS |
| `ink` on white | 17.40 | PASS | PASS |
| `muted` `#5C6672` on white | 5.84 | PASS | PASS |
| `muted` on `mist` | 5.11 | PASS | PASS |
| `muted` on `warm` | 4.94 | PASS | PASS |
| **`accent` on `deep`** | **2.80** | **FAIL** | **FAIL** |
| **`primary` on `deep`** | **2.88** | **FAIL** | **FAIL** |
| **`border` `#D8E5F2` on white** | **1.28** | **FAIL** | **FAIL** |

**Brief palette**

| Pairing | Ratio | AA body | AA large |
| --- | --- | --- | --- |
| white on Navy `#0C2D5A` | 13.65 | PASS | PASS |
| white on Deep Navy `#081D3D` | 16.75 | PASS | PASS |
| Ink `#11233F` on Gold `#F5A623` | 7.76 | PASS | PASS |
| Deep Navy on Gold | 8.27 | PASS | PASS |
| Gold on Navy | 6.73 | PASS | PASS |
| Gold on Deep Navy | 8.27 | PASS | PASS |
| **white on Gold** | **2.03** | **FAIL** | **FAIL** |
| **Gold on white** | **2.03** | **FAIL** | **FAIL** |
| white on Teal `#157F6B` | 4.91 | PASS | PASS |
| Teal on white | 4.91 | PASS | PASS |
| **Teal on Mist `#EEF2F8`** | **4.37** | **FAIL** | PASS |
| **Teal on Navy** | **2.78** | **FAIL** | **FAIL** |
| Navy on white | 13.65 | PASS | PASS |
| Navy on Mist | 12.15 | PASS | PASS |
| Ink on white | 15.72 | PASS | PASS |

Three findings that hold whichever palette wins:

1. **Gold is a dark-ground-only colour.** At 2.03:1 against white it is not a
   text colour, not a link colour, not a rule the eye must follow, and not a
   focus ring on a light page. It works only as type or geometry on navy or
   deeper. Any layout that puts gold on paper is broken before it is built.
2. **Three live failures exist in the implemented palette right now.**
   `accent` on `warm` (4.38), `primary` on `mist` (4.41), and `accent`/`primary`
   on `deep` (2.80/2.88). The last is already mitigated: `app/globals.css`
   rewrites `.text-brand-accent` and `.text-brand-primary` to white inside any
   `bg-brand-deep` container. The first two are not mitigated. `.section-block-warm`
   exists in `globals.css` and `LabelPills` has a `warm` tone, so an accent-on-warm
   pairing is reachable.
3. **`brand-border` `#D8E5F2` at 1.28:1 is a decorative hairline, not a boundary.**
   WCAG 1.4.11 requires 3:1 for a component boundary the user must perceive. A card
   divider at 1.28:1 is fine; a form input border at 1.28:1 is not. Input borders
   take `muted` `#5C6672` (5.84) or `primary` `#1E72BA` (5.03).

### 2.4 PALETTE: RESOLVED, keep blue and crimson

**Decision taken. Options A, B and C below are retained as the reasoning, not as
an open question.**

The owner ruled that the implemented palette stands: primary blue `#1E72BA`,
primary dark `#0152BE`, crimson accent `#D70B52`, deep `#142850`. Gold and teal
are dropped entirely, so Option C's constrained gold and teal tokens are not
adopted.

The deciding evidence is `public/images/logo/logo.png`. The organisation's mark
is two figures, one blue and one crimson, over a crimson monitor inside a blue
roundel. The brief's gold and teal appear nowhere in it. A site in navy, gold
and teal would be out of step with the organisation's own logo.

Consequences: no retokening, no Firestore migration of `accent`, `overlayFrom`
or `overlayTo`, and every assertion in `lib/utils/contrast.ts` and its gate
tests stays valid. `947b5fe` is not invalidated.

Still outstanding from 2.3 and unaffected by this decision: the three measured
AA failures in the current palette (`accent` on `brand-warm` at 4.38:1,
`primary` on `brand-mist` at 4.41:1, and the `brand-border` hairline at 1.28:1
used as a form-control boundary). Those are defects to fix, not arguments for a
different palette.

`docs/design_templates/` is the layout reference and is drawn in navy, gold and
teal. Take its composition; recolour to the tokens above.

### 2.4.1 The reasoning, for the record

The implemented palette and the brief's palette are different design systems.
This is a Confusion Protocol stop under section 36 of the constitution: two
plausible directions, a decision that is expensive to reverse, and no evidence in
the repository saying which is authoritative. **No token in `app/globals.css` or
`tailwind.config.ts` has been changed by this document.**

Contrast history is part of the decision. Commit `947b5fe` fixed fifteen AA
failures of `#1A1A1A` on `#D70B52` across fourteen files and added
`lib/utils/contrast.ts` plus gate tests that assert the pairings the redesign
uses. Whichever option is chosen, those tests must be updated in the same commit,
because a palette change silently invalidates every assertion in them.

---

#### Option A: keep the implemented blue/crimson palette

Treat the brief's palette as a stale proposal and build the redesign on
`#1E72BA` / `#D70B52` / `#142850`.

**Work required.** Close the three live contrast failures: ban `accent` on `warm`
(use `accent-dark`, 5.99), ban `primary` on `mist` (use `primary-dark`, 6.23),
and extend the `bg-brand-deep` override in `globals.css` into a token rule rather
than a descendant-selector patch. Raise form-control borders off `brand-border`.
Add the three banned pairings to the contrast gate test. Roughly one day of work
across the token layer plus the test file. No component needs to change colour.

**WCAG consequence.** The palette becomes clean at AA with four bans in place. It
cannot reach AAA for body text on `primary` or `accent` grounds (5.03 and 5.17
against a 7:1 bar), which is acceptable: AA is the stated requirement.

**What breaks.** Nothing. Every existing component, the fifteen call sites fixed
in `947b5fe`, the seeded CMS `accent` values on `HeroSlide` and `InitiativePage`,
and the `overlayFrom`/`overlayTo` values in Firestore all keep working.

**What it costs.** Crimson `#D70B52` is a loud, saturated hue. On a page with a
lot of photography it competes with the images rather than framing them, and it
gives every audience the same signal: there is one accent, so learners,
organisations and partners all get the same colour of button. The brief's
two-accent scheme exists precisely to separate those audiences, and Option A
gives that up.

---

#### Option B: migrate to the brief's navy/gold/teal palette

Replace the tokens wholesale: Navy `#0C2D5A`, Deep Navy `#081D3D`, Gold
`#F5A623`, Teal `#157F6B`, Ink `#11233F`, Mist `#EEF2F8`, Border `#E3E8F0`.

**Work required.** This is the expensive option and the estimate should be
believed. Every `brand-accent`, `brand-primary`, `brand-deep` and `brand-mist`
usage in `components/**` and `app/**` has to be re-decided, not find-and-replaced,
because crimson maps to gold in some places and to teal in others depending on
whether the element is an alert, an action or a category marker. The seeded
`accent` fields on `HeroSlide`, `InitiativePage` and `DepartmentProfile` and the
`overlayFrom`/`overlayTo` gradient strings live in Firestore documents and in
`lib/content/site-config.ts`; both copies need a data migration, and the Firestore
one needs a script plus a rollback. `lib/utils/contrast.ts` tests need rewriting.
Realistically several days, and it touches the CMS data layer, which Option A does
not.

**WCAG consequence.** Better on dark grounds and worse on light ones. White on
Navy is 13.65 against white on `#142850` at 14.49, which is comparable. Gold on Navy at
6.73 is a genuinely strong dark-ground accent, better than anything the current
palette has (`accent` on `deep` is 2.80 and unusable). But **gold cannot appear on
paper at all** (2.03), and Teal on Mist fails body text at 4.37, so the light
half of the site loses both accents and falls back to navy-on-white for
everything. A palette whose two accents are both unusable on the site's default
white background is a worse light-mode palette than the one it replaces.

**What breaks.** Every hardcoded hex in components (`#05070f` stage grounds,
`focus-visible:ring-offset-[#05070f]`, the `#1E72BA` default in
`capsule-media.tsx`, `capsule-content.tsx`, `capsule-page-hero.tsx` and
`slideshow-controls.tsx`), every seeded accent value, and the contrast gate tests.
The `bg-hero-grid` gradient in `tailwind.config.ts` also encodes `rgba(30,114,186,…)`
and `rgba(20,40,80,…)` literally.

---

#### Option C: reconciliation (recommended)

Keep the implemented chromatic identity and adopt the brief's *structure*: two
accents with distinct jobs, and a darker editorial ground.

Concretely, four changes and no more:

1. **Keep** `#1E72BA` primary, `#D70B52` accent, `#1A1A1A` ink, `#FFFFFF` bg,
   `#5C6672` muted. No migration, no data change, no test rewrite beyond additions.
2. **Adopt Gold `#F5A623` as a dark-ground-only third token**, `--color-gold`.
   Its measured pairings against the *existing* deep ground: gold on `#142850` is
   **7.15:1**, and `#142850` on gold is **7.15:1**. Both pass AA body comfortably.
   It is declared with a usage constraint attached: gold is legal only where the
   background is `brand-deep` or darker, and illegal on white, `bg-alt`, `mist`
   and `warm`. This gives the dark editorial bands a warm accent that crimson
   cannot provide there (crimson on deep is 2.80 and fails outright), and gives
   the site a second signal without touching the light pages.
3. **Adopt Teal `#157F6B` as a category token**, `--color-teal`, for the
   organisations and partners audiences. Teal on white is **4.91** and white on
   teal is **4.91**: both pass AA body. It is banned on `mist` (4.37) and on
   `deep` (2.78 against navy; against `#142850` it is similarly low). So teal is a
   white-ground-only token, exactly as gold is a dark-ground-only token. The two
   never appear on the same background, which is what keeps them from competing.
4. **Retire `brand-warm` `#FBE7EF`** or restrict it to a background that carries
   no accent text. It exists to tint a band pink, and the only accent that suits a
   pink band fails on it (4.38). `accent-dark` at 5.99 is the sanctioned
   replacement if the band is kept.

**Work required.** Two new tokens with documented ground constraints, two bans
added to the contrast gate test, one token retired or restricted. Half a day. No
component changes required to ship it; components adopt gold and teal as sections
are rebuilt.

**WCAG consequence.** Strictly better than today. It closes all three live
failures, adds two accents that were measured before being adopted, and the
constraint that each accent belongs to exactly one ground class makes the failing
combinations structurally unreachable rather than merely discouraged.

**What breaks.** Nothing existing. The risk is different: two extra tokens is two
more things to misuse, so the ground constraints must be enforced by a gate test
(`text-teal` may not co-occur with `bg-brand-deep`; `text-gold` may not co-occur
with `bg-white`, `bg-brand-mist`, `bg-brand-warm` or `bg-brand-background`), not
by a note in this document.

**Why this is the recommendation.** It buys the thing the brief actually wanted
(audience separation by colour and a warm accent on dark grounds) at a fraction of
Option B's cost, and it does not require migrating CMS data or invalidating the
contrast work already done in `947b5fe`.

---

**The decision required from John:** A, B or C. Everything downstream of this
document assumes C and is written so that A costs nothing to fall back to (drop
the gold and teal roles; the treatments stay). If B is chosen, sections 5, 7 and
the whole of `page-archetypes.md` still stand structurally, but every colour named
in them changes and the migration must be planned as its own piece of work.

### 2.5 Ground classes

Whichever option wins, colour is applied by ground class, never per component. A
section declares its ground and inherits a legal palette.

| Ground | Background | Body text | Heading | Accent legal here | Illegal |
| --- | --- | --- | --- | --- | --- |
| `paper` | `#FFFFFF` | `muted` 5.84 | `ink` 17.40 | `accent` 5.17, `primary-dark` 7.11, `teal` 4.91 (C) | `gold` 2.03 |
| `tint` | `bg-alt` `#F7F9FC` | `muted` 5.53 | `ink` 16.50 | `accent` 4.91, `primary-dark` | `gold`, `primary` 4.77 for body is a pass but use `primary-dark` |
| `mist` | `#E8F1FA` | `muted` 5.11 | `ink` 15.24 | `accent` 4.53, `accent-dark` 6.20, `primary-dark` 6.23 | `gold`, `teal` 4.37, `primary` 4.41 |
| `deep` | `#142850` | `rgba(255,255,255,0.82)` ≈ 10.10 | white 14.49 | `gold` 7.15 (C), `mist` 12.69 | `accent` 2.80, `primary` 2.88, `teal` |
| `stage` | `#05070f` over photography | white | white | white only | every chromatic accent |

A component never sets a text colour directly. It reads the ground it is in.

---

## 3. Spacing, containers and the asymmetric grid

### 3.1 Containers

Four widths, each named for what it holds. `1180px` is not a new number: it is
the max-width `CapsulePageHero` already uses, so the capsule and the grid share
one edge.

```css
:root {
  --measure-bleed:  100vw;      /* full-bleed bands only */
  --measure-full:   1440px;     /* widest contained composition */
  --measure-page:   1180px;     /* the default page column */
  --measure-text:   720px;      /* a text block standing alone */
  --measure-narrow: 560px;      /* forms, a single statement */

  --gutter:      clamp(1rem, 4vw, 3.5rem);
  --grid-gap:    clamp(1rem, 1.6vw, 1.5rem);
}
```

`--gutter` is the existing `px-[clamp(16px,4vw,56px)]` from
`capsule-page-hero.tsx:70`, promoted to a token so the rest of the site stops
re-deriving it.

### 3.2 Section rhythm

One uniform gap between sections produces a page that scrolls at a constant
speed, which is the opposite of magazine pacing. Three tiers:

```css
:root {
  --section-space-tight: clamp(2.5rem, 5vw, 4.5rem);   /* two sections that are one thought */
  --section-space:       clamp(4.5rem, 8vw, 8rem);     /* the default. Already implemented. */
  --section-space-loose: clamp(6rem, 11vw, 11rem);     /* a chapter break */
}
```

Rules:

- `--section-space-tight` joins a section to the one above it. It means "this
  continues the previous idea" and is used at most twice per page.
- `--section-space-loose` appears at most twice per page and marks the point where
  the page changes who it is talking to (learner → partner, story → evidence).
- A full-bleed band supplies its own rhythm. The section before a band gets no
  bottom space and the section after gets none on top; the band's own height is
  the break. Doubling them produces a hole.

### 3.3 The grid

A twelve-column grid with a fixed leading rail. The rail is the structural device
that makes the asymmetry mean something: it is where captions, eyebrows,
statistic labels and ordinals live, permanently, at the page's leading edge.
Content never enters it and it never enters content.

```css
.editorial-grid {
  display: grid;
  column-gap: var(--grid-gap);
  row-gap: 0;
  width: 100%;
  max-width: var(--measure-page);
  margin-inline: auto;
  padding-inline: var(--gutter);
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/* The rail appears only where there is width to spare for it. */
@media (min-width: 1280px) {
  .editorial-grid {
    max-width: var(--measure-full);
    grid-template-columns: [rail-start] 148px [rail-end main-start] repeat(12, minmax(0, 1fr)) [main-end];
  }
}
```

Named spans. A component asks for a role, never for column numbers.

| Span name | ≥1280px | 1024–1279px | <1024px |
| --- | --- | --- | --- |
| `rail` | `rail-start / rail-end` | inline above its block | inline above its block |
| `text-major` | `main-start / span 7` | `1 / span 8` | `1 / -1` |
| `text-offset` | `main-start 3 / span 6` | `2 / span 10` | `1 / -1` |
| `text-narrow` | `main-start / span 5` | `1 / span 6` | `1 / -1` |
| `media-major` | `main-start 6 / span 8` | `5 / span 8` | `1 / -1` |
| `media-two-thirds` | `main-start / span 8` | `1 / span 8` | `1 / -1` |
| `media-tall` | `main-start 9 / span 4` | `8 / span 5` | `1 / -1` |
| `full` | `rail-start / main-end` | `1 / -1` | `1 / -1` |

`text-major` ends at main column 7 and `media-major` starts at main column 6.
The one-column overlap is deliberate: the two blocks interlock instead of sitting
in tidy halves, and that overlap is what stops the page reading as a two-column
template. Where both occupy the same row, the media takes `z-index: 0` and the
text block takes `z-index: 1` with its own ground colour, so the text sits over
the media's edge rather than being cut by it.

### 3.4 The asymmetries the brief asks for, made concrete

**Offset headlines.** A section heading in `text-offset` starts at main column 3,
two columns inboard of everything under it. The eyebrow for that heading sits in
the `rail`, flush to the page's leading edge. The result is a heading that hangs
in space with its label pinned far to its left, which reads as a considered
opening rather than a centred banner.

**Uneven columns.** Two-part compositions are never 6/6. The permitted splits are
7/5, 8/4 and 5/7, chosen by which side carries more weight. A 6/6 split is
disallowed because it reads as a default.

**Two-thirds media.** `media-two-thirds` spans 8 of 12 and is the standard plate
width. It leaves 4 columns of air on the trailing edge, and that air is not filled
and it is the negative space the statistic and caption treatments live in.

**Text set lower than its media.** In any row that pairs `media-major` with a text
block, the text block takes:

```css
.block-dropped {
  align-self: end;
  padding-block-end: clamp(0.75rem, 2.5vw, 2.5rem);
}
```

Its first baseline lands below the media's bottom edge by one spacing step. This
is the single most reliable way to stop a paired row reading as a card, and it
costs nothing.

**Edge-anchored captions.** A caption belongs to the `rail`, aligned to the *top*
of the media it describes, not to its bottom. Below 1280px the rail collapses and
the caption moves to directly beneath its own figure, inside the same `<figure>`
element. It never separates from its image at any breakpoint, which is the mobile
requirement in the archetype spec.

### 3.5 Vertical spacing inside a block

Six steps, and content picks the one that matches the relationship, not the one
that looks right.

| Step | Value | Relationship it expresses |
| --- | --- | --- |
| `--space-hair` | `0.375rem` | label to the thing it labels |
| `--space-tight` | `0.75rem` | caption to figure, name to role |
| `--space-close` | `1.25rem` | paragraph to paragraph |
| `--space-block` | `2rem` | heading to body, body to actions |
| `--space-group` | `3.5rem` | one block to the next inside a section |
| `--space-section` | `var(--section-space)` | section to section |

---

## 4. Capsule geometry

### 4.1 The premise, restated

A circular media form and a text block merge into one continuous silhouette so
the two read as a single object. The geometry that makes it work is already in
`app/globals.css`: the lens radius and the shell's end-arc radius are the same
value, both derived from `--capsule-h`, so the outline has no seam. The end arc is
written `calc(var(--capsule-h) / 2)` rather than `999px` because CSS Backgrounds 3
§5.5 scales *every* corner by one global factor when any edge overflows, and
`999px` on the trailing corners drove that factor to 0.23 and rendered the capsule
mirrored. `design-rules.test.ts` models that arithmetic and will fail if anyone
reintroduces it.

Two rules follow from the geometry and are not negotiable:

- **The round end is always on the leading side, where the lens is.** A capsule
  whose round end is opposite its circle is not a capsule, it is a pill with a
  photograph in it.
- **The lens is centred, never stretched.** `align-self: center` on
  `.itfy-capsule__media`. A stretched lens stops being square the moment the
  shell grows, and then it is an ellipse.

### 4.2 When the capsule is structural

Use it when **one subject** has **one dominant image** and **one short claim**,
and the image and the claim are the same fact stated twice. The circle says
"look at this one thing"; the merge says "and this sentence is about that thing."

Concretely, the content must satisfy all four:

1. Singular subject. One initiative, one person, one campaign, one page.
2. An image that survives a circular crop, meaning the subject is near the centre
   and the frame has no information in its corners.
3. A claim of at most about 40 words. The shell's exact stadium only holds while
   the content fits inside `--capsule-h`; longer copy grows the shell and the end
   degrades to a rounded corner. It degrades cleanly, but a capsule you have to
   force is the wrong form.
4. At most two actions.

### 4.3 When the capsule is wrong

| Content structure | Why the capsule fails | Use instead |
| --- | --- | --- |
| A set of peers with no focus (8 courses, 12 team members, 6 reports) | The circle claims one thing matters more; nothing does | Grid, table, or the orbit if one *can* be focused at a time |
| A strict sequence (application steps, cohort timeline) | The silhouette carries no direction, so order is lost | `ProcessSequence` spine |
| A branching structure (pathways into initiatives) | A single object cannot show a branch | `PathwayTree` |
| A body of prose (article, course description, policy) | A circle beside 900 words is a decoration on an essay | Annotation rail plus `--type-body-long` |
| A comparison (packages, eligibility bands, cohort formats) | Comparison needs aligned columns; the capsule has one column | `DataTable` (§8) |
| A quantity (statistics, report figures) | There is no photograph, and inventing one to fill the lens is a fabrication | Counter capsule (§4.4.5) or statistic-with-negative-space (§5.9) |
| Anything whose only available image is a logo, a document cover, or a chart | Circular-cropping a logo destroys it; cropping a document cover lies about the artefact | Lockup or document plate (§5.10, §5.11) |
| A named person with no portrait | Never put a stock face in a slot claiming to be a specific person | `MediaFallback variant="monogram"` inside a column capsule |

If a section fails these tests, the honest move is not to find a capsule variant
that technically fits. It is to use a different form. Choosing not to use the
capsule is part of the work.

### 4.4 Six capsule expressions

Each is a distinct object, not a size variant. Two exist in code; four are new
expressions of the same geometry.

---

**4.4.1 Stage capsule**: implemented, `.itfy-capsule--hero`

Contained lens inside a rounded rectangular shell, the shell translucent glass
over the hero's own blurred photograph. `SlideshowStage` owns the blur; the shell
samples it with `backdrop-filter: blur(18px) saturate(120%)`. Aspect 1.8:1,
height `min(max(100svh − 65px − padding − 56px, 500px), 680px)`, max-width 1240px.

*Content it fits:* the site's single largest claim, rotating across 3–5 slides,
each with an eyebrow, a two-clause headline, ≤40 words, and two actions.
*Used by:* `/` only. It is the site's front door and appears nowhere else.

---

**4.4.2 Leading-lobe capsule**: implemented, `.itfy-capsule` inline

The lens is the shell's leading end-arc, its photograph dissolving across its own
trailing flank into the panel via a `linear-gradient` mask at 100deg. Height 340
/ 400 / 460px at base / 1024 / 1280. `tone="paper"` on a `mist` band.

*Content it fits:* one named thing introduced at the top of its own page: an
initiative, a department, a service, a partnership track.
*Used by:* every interior page hero that has a single subject with a photograph.

---

**4.4.3 Orbit capsule**: implemented, `.itfy-orbit`

A row of circles where the active one grows rightward into a named capsule while
its circle stays put, so the circle becomes the capsule's leading lobe rather
than being replaced by one. Resting nodes 120px, open node 340px; the row shrinks
inactive nodes to 92px so the total width stays inside the 1100px measure in both
states. Driven by React state, not `:has()`. Proximity behaviour is gated on
`(min-width: 821px) and (hover: hover)`; below that every node renders already
open as a stack.

*Content it fits:* 6–10 peers where exactly one can be in focus at a time, each
with a photograph and a one-line description.
*Used by:* the eight initiatives on `/what-we-do`.

---

**4.4.4 Column capsule**: NEW EXPRESSION, `variant="column"`

The vertical stadium the ≤820px layout already produces, promoted to a deliberate
desktop form. Lens on top at `aspect-ratio: 1/1` and full column width; the two
top radii equal half the column width, which is exactly the lens radius, so they
are coincident at every width. Text below, overlapping upward by
`clamp(-64px, -11vw, -36px)` so the merge is preserved. Max column width 440px.

The CSS already exists inside the `max-width: 820px` block; this expression lifts
it out into a variant so it is available at any width, and the responsive rule
becomes "the column capsule is what the inline capsule *becomes* below 820px"
rather than an accident of the media query.

*Content it fits:* one subject in a column beside siblings (a team member, a
report, a testimonial) where each sibling gets equal weight and the set is small
enough (3–6) that a grid of circles does not read as a contact sheet.
*Used by:* team portraits, publication library, voices.

---

**4.4.5 Counter capsule**: NEW EXPRESSION, `CapsuleCounter`

The lens is replaced by a numeral set inside a circle of identical radius, so the
silhouette is unchanged but the leading lobe carries a figure instead of a
photograph. The circle is a hairline ring, not a fill: `box-shadow: inset 0 0 0
1.5px` in the ground's accent, matching `.itfy-lens__rim`. The numeral is
`--type-stat` in `--font-heading` with `tabular-nums`.

This is how the capsule language and the no-invented-imagery rule meet. A
statistic has no photograph, and dropping a generic stock image behind a number
is the exact failure the media policy bans. The counter capsule gives a figure the
same silhouette the photographs get, so a statistic sits in the page as an equal
citizen without a fabricated picture.

*Content it fits:* one figure with a label and a sentence of provenance:
"3000+ / Youth Trained / Across digital skills and employability pathways."
*Used by:* the data story, impact framework, and any single headline figure that
would otherwise be a card in a row of three.

---

**4.4.6 Split capsule**: NEW EXPRESSION, `variant="split"`

Two lenses, one at each end of a single shell, both ends true semicircles, the
text between them. `border-radius: calc(var(--capsule-h)/2)` on all four corners
is safe here because both edges' radii sum to exactly their edge length only when
`width ≥ --capsule-h`; below that the shell must switch to the column form. The
merge masks run inward from both ends: `100deg` on the leading lens and `280deg`
on the trailing one.

*Content it fits:* exactly two parties in one relationship, where showing one and
not the other would misrepresent it: ITFYG and a named partner, a cohort before
and after, a learner and the employer who hired them.
*Used by:* collaboration story, sector partnership. Nowhere else, because a
two-lobe object is emphatic and stops being emphatic on its third appearance.

---

### 4.5 Frequency rule

**At most one capsule expression per page, used at most twice.** The stage
capsule is the exception and appears once. A page with a leading-lobe hero does
not also get an orbit; a page with a counter capsule row does not also get a
column capsule grid. The capsule is a signature, and a signature repeated on
every line is handwriting, not a signature.

---

## 5. Media treatments

Twelve treatments. Nine are the set the brief names; three more exist because the
site has artefacts (report covers, partner logos, video) that none of the nine
can hold honestly.

**Rules that apply to all twelve.**

- `docs/redesign/media-policy.md` governs what may fill a slot. This section
  governs the shape of the slot. Where they touch, the policy wins.
- Every remote `src` routes through `resolveImageSrc()` from
  `lib/media/remote-image.ts` and renders via `components/media/remote-image.tsx`,
  never a bare `<img>`. `resolveImageSrc()` returns `null` for an unlisted host,
  and `null` means render `MediaFallback`, never a broken frame and never a grey
  box. `components/media/placeholder-policy.test.ts` fails the suite when a
  gradient substitute appears.
- Every externally sourced placeholder is recorded in
  `docs/redesign/placeholder-media.json` with the final ITFYG photograph that
  should replace it. `lib/content/placeholder-registry.test.ts` fails when an
  external URL in application source has no entry.
- An empty slot renders `MediaFallback` (`components/media/media-fallback.tsx`) at
  the treatment's exact proportions. Gradients, grey rectangles, empty bordered
  boxes and `public/images/fallback/placeholder.svg` are banned.
- `alt` describes what is happening in the photograph. It is never a restatement
  of the heading. A decorative duplicate (the blurred stage copy, the fallback)
  takes `alt=""` and `aria-hidden`.
- Unsplash (`images.unsplash.com`) is allowed for programme and contextual
  imagery and is already in `next.config.mjs` `remotePatterns`. It is never used
  for a slot naming a specific person or a specific partner organisation.
- Exactly one image per page carries `priority`, and it is above the fold.

| # | Treatment | Ratio | `sizes` | Collapse below 1024px |
| --- | --- | --- | --- | --- |
| 1 | Full-bleed band | fluid, `min-height` 20rem / 32rem | `100vw` | `min-height` 16rem; overlay text moves from a 2xl inset column to full width; scrim goes from a left-to-right gradient to a flat `rgba(20,40,80,0.72)` because a directional scrim on a narrow screen darkens the wrong half |
| 2 | Wide plate | `16/9`, or `21/9` for `ratio="cinema"` | `(min-width:1280px) 1180px, (min-width:1024px) 70vw, 100vw` | stays `16/9`; `cinema` relaxes to `16/9` because 21:9 at 360px is a 154px-tall strip |
| 3 | Portrait panel | `4/5` | `(min-width:1280px) 340px, (min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw` | two-up at 640–1023px, one-up below; caption stays inside the `<figure>` |
| 4 | Circular crop | `1/1` | `sm` 96px, `md` 160px, `lg` `(min-width:1024px) 17rem, 45vw` | `lg` steps to `md`; the crop itself never changes, which is why this treatment is the fallback when orientation is unknown |
| 5 | Capsule crop (lens) | `1/1` | `(min-width:1280px) 460px, (min-width:1024px) 400px, (min-width:821px) 340px, 100vw` | becomes the top lobe of the column capsule at full width |
| 6 | Image cluster | 2–3 frames at `16/10`, alternating `ml-10`/`mr-10` inset | `(min-width:1024px) 42vw, 100vw` | offsets drop to zero and the frames stack flush |
| 7 | Filmstrip | `3/2` frames, horizontal scroll-snap | `(min-width:1024px) 380px, 72vw` | unchanged in kind: it is already a scroll row, and the row is the honest mobile form. Snap stays `x mandatory`; the trailing gutter equals `--gutter` so the last frame can reach the leading edge |
| 8 | Overlapping composition | `16/9` plate with a `4/5` portrait overlapping its lower-leading corner by 18% of the plate's width | plate `(min-width:1024px) 62vw, 100vw`, portrait `(min-width:1024px) 26vw, 60vw` | overlap is removed entirely: plate first, portrait beneath at `4/5` two-thirds width, still inside one `<figure>` with one caption |
| 9 | Statistic with negative space | no image; occupies a `media-two-thirds` slot at `min-height: clamp(14rem, 24vw, 22rem)` with the figure on the leading edge and ~60% of the slot empty | n/a | `min-height` drops to 10rem and the negative space compresses to the trailing 25%; it is never removed, because the emptiness is the treatment |
| 10 | Document plate | `1 / 1.414` (A4) | `(min-width:1024px) 240px, 40vw` | two-up at 640–1023px, two-up below as well: a report cover at 40vw is still legible and a stack of full-width A4 pages scrolls forever |
| 11 | Lockup slot | `5/2`, `object-fit: contain`, padded 12% | `(min-width:1024px) 200px, 33vw` | three-up at 640–1023px, two-up below |
| 12 | Video frame | `16/9`, poster required | `(min-width:1024px) 62vw, 100vw` | unchanged |

### 5.1 Full-bleed band

`MediaBand`. The widest treatment and the correct default for programme content:
a cohort, a workshop or a community activation is a wide subject, and a band shows
the room rather than cropping it into a tall hole. Overlaid content
sits in a `max-w-2xl` column against a directional scrim. Used at most twice per
page, and never twice in the same third of a page.

### 5.2 Wide plate

`WideFrame`. A contained editorial plate that gives a text block something to open
against without spanning the viewport. `ratio="cinema"` (21/9) is for a plate that
opens a chapter; `16/9` is the default.

### 5.3 Portrait panel

`PortraitFigure`. Reserved for people, because a person is a tall subject and a
`4/5` frame is the honest shape for one. The name-and-role caption is part of the
component, under a 3px accent rule.

### 5.4 Circular crop

`CircularFigure`. The one treatment the orientation typology does not constrain:
it crops cleanly from a landscape or a portrait source, so it is the fallback to
try before declaring a section unpairable. The rim (`box-shadow: 0 0 0 3px bg,
0 0 0 5px accent`) is what makes the crop read as deliberate rather than as a
mistake.

### 5.5 Capsule crop

`CapsuleMedia`. The lens. `object-position: 50% 34%` by default, because a
centre-cropped circle on a standing figure cuts the head. Any source whose subject
is not near the upper-centre needs an explicit `objectPosition`.

### 5.6 Image cluster

`OffsetFrames`. The way to build vertical mass beside a tall text column out of
landscape photography. Two or three frames; four reads as a gallery and should be
a filmstrip instead.

### 5.7 Filmstrip (NEW)

A horizontal scroll-snap row of `3/2` frames with captions in each frame's own
`<figure>`. The form exists because a set of 5–12 photographs that are peers is
neither a cluster (too many) nor a grid (a grid of photographs with no hierarchy
is a contact sheet). A strip says "these are moments from the same thing" and
lets the reader move through them at their own pace.

Requirements: native scroll (`overflow-x: auto; scroll-snap-type: x mandatory`),
real focusable content so keyboard users can tab through frames, `scroll-padding-inline`
equal to `--gutter`, and a visible scrollbar or an edge fade that does not hide
the last frame. No autoplay, no arrows that are the only way to advance.

### 5.8 Overlapping composition (NEW)

A `4/5` portrait overlapping the lower-leading corner of a `16/9` plate. Both
images belong to one caption and one `<figure>`. It is the treatment for a story
that is simultaneously about a place and a person (a graduate and the workshop
they trained in) where showing either alone drops half the story.

The overlap is 18% of the plate's width and the portrait sits `translateY(12%)`
below the plate's lower edge, so the composition is deliberately unbalanced. It
carries a hard constraint: the plate must have no subject in its lower-leading
corner, because the portrait will cover it. This is a treatment that must be
chosen with the photograph in hand, not assigned by a template.

### 5.9 Statistic with negative space

No image. The figure sits at `--type-stat` on the leading edge of a
`media-two-thirds` slot, its label in the `rail`, and roughly 60% of the slot
stays empty. A single hairline rule runs from the figure's baseline to the slot's
trailing edge.

The emptiness is the treatment and it is what makes the figure read as evidence
rather than as decoration. Filling it with a stock photograph would say the
opposite. **Never round, recombine or re-derive a figure to make it fit the
space**: the values in the repository are the values (`3000+`, `8500+`, `40%`,
`85%` in `lib/content/site-config.ts:249–271`; per-initiative figures in the
same file). If a figure is too long for the slot, the slot changes.

### 5.10 Document plate: NEW ratio on an existing primitive

A report cover is `1/1.414`. Cropping it to `16/9` cuts its title off and lies
about what the artefact is. This is a new `aspectRatio` value on `ContentImage`
plus `fit="contain"`, not a new component. With no cover supplied it renders
`MediaFallback variant="wordmark"` carrying the report title, which is a more
honest publication-library entry than a generic PDF thumbnail.

### 5.11 Lockup slot: NEW ratio on an existing primitive

A partner logo is not a photograph. It needs `object-fit: contain` inside a `5/2`
box with 12% padding, on white or `mist`, never on a photograph and never
circular-cropped. With no logo supplied it renders `MediaFallback
variant="monogram"` carrying the organisation's name. **A random logo is never
substituted for a named partner**, and neither is a stock office photograph.

### 5.12 Video frame

A poster image is required; a video slot with no poster is an empty box. The play
affordance is CSS geometry (a triangle from three borders), not an icon
component; `components/media/video-card.tsx` currently imports `Play` from
`lucide-react` and must not, under the no-icons rule.

### 5.13 Pairing law

**Every substantive text block sits in a real visual relationship with one of:
photography, video, data, a pathway, a diagram, or another content-bearing visual
form.** A text block with none of these is not finished. The escape hatches are
real forms, not decorations: a `DataTable`, a `ProcessSequence` spine, a
`PathwayTree`, a counter capsule, or a statistic-with-negative-space all satisfy
the pairing law. A coloured background does not. A large ordinal numeral does not
on its own, though it is a legitimate secondary device beside one of the above.

---

## 6. Motion

Eight permitted animations. Anything not on this list does not ship. Every one
has a reduced-motion resting state in which the content is **fully visible and
fully usable**, never hidden and never mid-transition.

| # | Name | Spec | Reduced-motion resting state |
| --- | --- | --- | --- |
| 1 | `capsule-in` | `opacity 0→1`, `translateX(-40px)→0`, `scale(0.975)→1`, 1s `cubic-bezier(0.16,0.84,0.44,1)`, 0.1s delay | `animation: none`; `opacity: 1`; `transform: none`. Implemented in `globals.css` and asserted by `design-rules.test.ts`. |
| 2 | `rise-in` | scroll-triggered: `opacity 0→1`, `translateY(14px)→0`, 520ms, same easing, 60ms stagger, **maximum 4 staggered items** | No observer is attached at all; elements render at their final state on first paint. The IntersectionObserver must not run, because a page whose content is opacity-0 until an observer fires is a blank page if the observer never fires. |
| 3 | Slide crossfade | `opacity` 900ms `ease-out` between stacked slides | `transition: none`; instant swap. **Autoplay never starts**: `canAutoplay = autoplay && !prefersReducedMotion` in `use-slideshow.ts`, asserted by the gate test. |
| 4 | Ken Burns | `transform: scale(1.05)→1` over 10s `ease-out` on the active slide | `transform: none`; `transition: none`. |
| 5 | Orbit open | `width` 450ms `cubic-bezier(0.16,0.84,0.44,1)`, plus `background-color` and `box-shadow` 350ms | All transitions off. Below 820px every node renders already open as a stack, which is also the reduced-motion presentation at any width. |
| 6 | Hover lift | `translateY(-2px)` + shadow, 200ms | Shadow change only, no transform. Also disabled below 820px, where there is no hover: the card gets its resting shadow permanently. |
| 7 | Arrow gap grow | `gap` 8px→12px, 200ms, on a link's trailing CSS chevron | Static 12px gap. |
| 8 | Autoplay progress ring | `stroke-dashoffset` driven by the slideshow controller | Not rendered. `CapsuleMedia` hides the ring when `progress` is undefined, and the controller supplies no progress when autoplay cannot run. |

### 6.1 Rules

- **Interaction floor.** Every hover interaction also works by click and by
  focus. `initiative-orbit.tsx` already carries `onFocus` and a real `href` for
  exactly this reason, and the gate test asserts both.
- **Proximity effects are pointer-gated**, not width-gated alone:
  `@media (min-width: 821px) and (hover: hover)`. A touch device at 1024px must
  get the simple honest version, not a hover effect it can never trigger.
- **Nothing animates on page load except the hero.** One orchestrated entrance
  beats eight scattered ones.
- **No parallax, no scroll-jacking, no auto-advancing carousel without a
  keyboard-reachable pause.** WCAG 2.2.2 requires the pause; `SlideshowControls`
  provides it as a real focusable button with an `aria-pressed` state.

### 6.2 Two gaps in the current ratchet

`design-rules.test.ts` derives its reduced-motion check from `.itfy-animate-*`
class names in `globals.css`. Tailwind's `animate-*` utilities from
`tailwind.config.ts` are outside that regex and are therefore unchecked. Two are
currently unguarded:

- `animate-banner-in`: `components/layout/announcement-bar.tsx:140`. No
  `motion-reduce:` variant and no `@media (prefers-reduced-motion)` rule.
- `animate-hero-in`: `components/home/testimonials-section.tsx:112`. Same.

(`animate-marquee` in `components/home/marquee-ticker.tsx:106` *is* guarded, with
`motion-reduce:animate-none` plus `motion-reduce:overflow-x-auto` and
`motion-reduce:hidden` on the duplicate track. That is the pattern the other two
should follow.)

The fix is two `motion-reduce:animate-none` variants and an extension to the gate
test so it also enumerates `keyframes` declared in `tailwind.config.ts` and
requires each to have either a `motion-reduce:` call site or a
`prefers-reduced-motion` rule. Without that extension the ratchet will keep
missing this class of animation.

---

## 7. Buttons and interactive surfaces

### 7.1 The problem with what exists

`components/ui/button.tsx` declares **fourteen** variants: `primary`, `secondary`,
`outline`, `ghost`, `pink`, `blue`, `solid-pink`, `solid-blue`, `pink-outline`,
`blue-outline`, `white`, `white-outline`, `dark`, `danger`. Several are literal
duplicates (`primary` === `pink`, `secondary` === `blue`) and the naming mixes
role (`primary`) with colour (`pink`) with ground (`white-outline`). A second,
parallel set of the same buttons exists as `.itfy-button-*` and `.itfy-btn-*`
classes in `globals.css`. Two systems for one job.

Most of them also invert on hover: `primary` goes from crimson-on-white to
white-on-crimson. Inverting hover states are why the accent-on-warm failure
(4.38:1) is reachable; the hover state's background depends on the surface it
lands on, and the surface is not known at the time the variant is declared.

### 7.2 Five variants

Named by role and ground, never by colour. Non-inverting: hover changes value,
not figure/ground.

| Variant | Ground | Resting | Ratio | Hover | Ratio |
| --- | --- | --- | --- | --- | --- |
| `primary` | light | white on `accent` `#D70B52` | **5.17** | white on `accent-dark` `#B00944` | **7.07** |
| `secondary` | light | `primary-dark` `#0152BE` on white, 1.5px `primary` `#1E72BA` border | **7.11** text, **5.03** border | white on `primary` `#1E72BA` | **5.03** |
| `quiet` | light | `primary-dark` `#0152BE`, no fill, 2px `accent` underline at `0.25em` offset | **7.11** | underline thickens to 3px; colour unchanged | n/a |
| `on-dark` | `deep` / `stage` | `deep` `#142850` on white | **14.49** | `deep` on `mist` `#E8F1FA` | **12.69** |
| `on-dark-quiet` | `deep` / `stage` | white, 1.5px `rgba(255,255,255,0.68)` border | **14.49** on `deep` | white, 1px white border, `rgba(255,255,255,0.12)` fill | ≥12 |

`danger` stays as a sixth variant for the admin UI only and is out of scope for
the public site.

Under Option C, one addition: `category`: `teal` `#157F6B` on white (**4.91**)
or white on `teal` (**4.91**): reserved for the organisations and partners
audiences, and banned on `mist` (4.37) and on `deep`.

### 7.3 Sizes

Matching what `lg` already is (`px-6 py-3.5 text-[0.9375rem]`), so nothing shifts.

| Size | Padding | Font size | Min target | Where |
| --- | --- | --- | --- | --- |
| `sm` | `0.5rem 0.875rem` | `0.8125rem` | 44×44 via a transparent `::before` inset | inside cards and table rows |
| `md` | `0.6875rem 1.25rem` | `0.875rem` | 44×44 native | forms, secondary page actions |
| `lg` | `0.875rem 1.5rem` | `0.9375rem` | 48×48 native | hero and section-closing actions |

`sm` does not meet the 44px target on its own box; the transparent inset
`::before` is mandatory, not optional, and there is no smaller size.

Radius is `--radius-control` (0.375rem) for all sizes. Buttons are the one place
the design language stays rectangular: the capsule radius is reserved for the
capsule and for pills, and a fully-round button next to a capsule reads as a
small capsule and muddies the signature.

### 7.4 Focus

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--focus-offset), 0 0 0 4px var(--focus-ring);
}
```

`--focus-ring` and `--focus-offset` are set by the ground class, not by the
component. On `paper` and `tint`: ring `accent` `#D70B52` (5.17 on white, 4.91 on
`bg-alt`), offset the surface colour. On `mist`: ring `accent` (4.53), offset
`#E8F1FA`. On `deep` and `stage`: ring white (14.49), offset `#05070f`.

Every value clears the 3:1 non-text minimum in WCAG 1.4.11. The existing
`focusByTone` map in `capsule-actions.tsx:22` already does exactly this and is
the pattern to generalise.

### 7.5 Form controls

Input and select borders take `muted` `#5C6672` (**5.84** on white) or `primary`
`#1E72BA` (**5.03**). They do **not** take `brand-border` `#D8E5F2`, which is
**1.28:1** and fails the 3:1 boundary requirement. `brand-border` stays where it
belongs: decorative hairlines between cards and sections, where nothing depends
on perceiving it.

Error text takes `accent-dark` `#B00944` (7.07 on white), never `accent`, and is
never colour-only: it carries `aria-invalid`, `aria-describedby` and a text
message.

### 7.6 The rule against competing CTAs

- **One `primary` per section.** A section with two equal actions uses
  `secondary` + `quiet`, never `primary` + `primary`.
- **At most three `primary` actions per page**, and never two within one viewport
  height of each other.
- **The primary action is the same verb throughout a flow.** A button that says
  "Apply for training" leads to a page whose heading says "Apply for training".
  `CapsuleActions` already enforces the shape (one primary, one optional
  secondary); the rule extends that to the page.
- **A donate action never competes with an apply action in the same section.**
  They address different audiences and putting them side by side asks the reader
  to choose an identity before choosing an action.

---

## 8. Component contract

Every existing public primitive, with a verdict. Nothing is listed as NEW that an
existing primitive could carry after an extension. **Five components are NEW.**

Legend: **KEEP**: no change. **EXTEND**: same component, named change.
**REPLACE**: the job is right, the implementation is not. **NEW**: nothing
existing fits.

### 8.1 `components/capsule/`

| Component | Verdict | Detail |
| --- | --- | --- |
| `capsule-shell.tsx` | **EXTEND** | Add `variant: "inline" \| "hero" \| "column" \| "split"`. `column` lifts the existing `max-width: 820px` stacked geometry into a variant usable at any width (§4.4.4). `split` adds a trailing `media` slot and mirrors the end arc (§4.4.6). The existing two variants are unchanged. |
| `capsule-media.tsx` | **EXTEND** | Route `src` through `resolveImageSrc()`; on `null`, render `MediaFallback` inside the lens rather than a `next/image` that throws. Add `objectPosition` as a prop: it is currently hardcoded to `50% 34%` in CSS, which is wrong for any source whose subject is not upper-centre. |
| `capsule-content.tsx` | **EXTEND** | Replace the inline `text-[clamp(2rem,3.5vw,3.35rem)]` with the `--type-display` / `--type-headline` role classes, selected by a `scale` prop. The heading size is currently the same whether the capsule is a page hero or an orbit node. |
| `capsule-actions.tsx` | **KEEP** | Already one primary plus one optional secondary, ground-aware focus rings, and a CSS-geometry chevron. This is the pattern §7 generalises. |
| `capsule-page-hero.tsx` | **EXTEND** | Add `ground` so the surrounding band is not always `bg-brand-mist/40`. Under Option C the `mist` ground bans `primary` text (4.41), so the band's ground must be declarable. |
| `slideshow-stage.tsx` | **KEEP** | Owns the blurred duplicate and the per-slide wash, correctly. Asserted by the gate test. |
| `slideshow-controls.tsx` | **KEEP** | Real focusable buttons, accessible names, CSS-geometry glyphs, WCAG 2.2.2 pause. |
| `use-slideshow.ts` | **KEEP** | `canAutoplay = autoplay && !prefersReducedMotion` is exactly right. |
| `split-heading.ts` | **KEEP** | Pure function, tested. |
| `design-rules.test.ts` | **EXTEND** | Add: (a) Tailwind `keyframes` from `tailwind.config.ts` must each have a `motion-reduce:` call site or a `prefers-reduced-motion` rule (§6.2); (b) ground-class colour bans (`text-gold` never with a light `bg-*`, `text-teal` never with `bg-brand-deep`, `text-brand-accent` never with `bg-brand-warm`, `text-brand-primary` never with `bg-brand-mist`); (c) the 11px label floor: no `text-[0.6rem]` or smaller in redesigned files; (d) `MediaFallback` is the only empty-media branch. Add every file this redesign touches to `REDESIGNED`. |

### 8.2 `components/media/`

| Component | Verdict | Detail |
| --- | --- | --- |
| `media-fallback.tsx` | **KEEP** | The sanctioned empty-media treatment. Two variants, `aria-hidden`, occupies the real proportions. Everything below that can be empty routes to it. |
| `remote-image.tsx` | **KEEP** | The render side of the external-image contract. Every treatment in §5 that takes a CMS or API `src` goes through it. |
| `placeholder-policy.test.ts` | **EXTEND** | Already fails on gradient substitutes. Extend it to the treatments this document adds, so a new `aspectRatio` cannot ship with its own empty-state branch. |
| `content-image.tsx` | **EXTEND** | Add `aspectRatio: "document"` (`1/1.414`, §5.10) and `"lockup"` (`5/2`, §5.11); add `fit: "cover" \| "contain"` defaulting to `cover`. Route `src` through `resolveImageSrc()` so an unlisted CMS host falls to `MediaFallback` instead of throwing at runtime. These two additions are why a `DocumentPlate` and a `MonogramLockup` are **not** on the NEW list. |
| `wide-frame.tsx` | **KEEP** | Add nothing. `caption` already exists; the rail consumes it at ≥1280px. |
| `media-band.tsx` | **EXTEND** | The scrim is a fixed left-to-right gradient. Below 1024px it darkens the wrong half (§5, row 1). Add a flat `rgba(20,40,80,0.72)` under `max-width: 1023px`. |
| `offset-frames.tsx` | **KEEP** | Correct as written, including the alternating inset and its collapse. |
| `portrait-figure.tsx` | **EXTEND** | Add `fallbackLabel` so a named person with no portrait renders `MediaFallback variant="monogram"` rather than a broken frame. This is the rule about never substituting a stock face, made mechanical. |
| `circular-figure.tsx` | **KEEP** | The rim treatment is what makes the crop deliberate. |
| `video-card.tsx` | **REPLACE** | Imports `Play` from `lucide-react`, which is banned in public UI. Also renders `ContentImage` with no poster requirement, so a video with no thumbnail is an empty box. Rebuild with a CSS-triangle affordance and a required poster. |
| `filmstrip.tsx` | **NEW (1)** | Nothing existing is a horizontal scroll-snap media row. `OffsetFrames` is a vertical stack of 2–3; `RouteCardGrid` is a link grid with no media; a `<div>` of `WideFrame`s is a gallery, not a strip. §5.7. |
| `overlap-composition.tsx` | **NEW (2)** | Nothing overlaps two frames into one figure. Composing `WideFrame` + `PortraitFigure` at the call site would put the overlap arithmetic and the mobile de-overlap in every consumer. §5.8. |

### 8.3 `components/shared/`

| Component | Verdict | Detail |
| --- | --- | --- |
| `editorial-image-hero.tsx` | **KEEP** | The non-capsule page hero. Correctly strips empty optional content rather than leaving decorative boxes. Every archetype that should not use a capsule uses this. |
| `section-heading.tsx` | **REPLACE** | A one-line re-export of `PageHeader`. Pure indirection with two names for one component. Delete the alias; call sites use `SectionIntro` (redesigned) or `PageHeader` (legacy) explicitly. |
| `stat-list.tsx` | **REPLACE** → `components/content/figure-statistic.tsx` | Renders `HighlightStat[]` as a three-up grid of `Card`s at `rounded-3xl` (an arbitrary radius the gate test bans in redesigned files) with no media relationship at all, which fails the pairing law. The replacement is the statistic-with-negative-space treatment (§5.9) plus a `counter` mode that emits a counter capsule (§4.4.5). Note `components/content/stats-section.tsx` is the *good* existing statistic treatment, a divided row with no cards, and is **KEEP**; `StatList` is its weaker duplicate. |
| `spotlight-card.tsx` | **EXTEND** | `rounded-[18px]` is an arbitrary radius; use `--radius-panel`. The 6px accent bar is a real device and stays. |
| `route-card-grid.tsx` | **KEEP** | Already icon-free, CSS-geometry arrow, accent rule instead of a glyph. Raise the `text-[0.6rem]` eyebrow to the 11px floor. |
| `team-directory.tsx` | **REPLACE** | Imports `Mail` and `Linkedin` from `lucide-react`; uses `rounded-[26px]`; renders people as 64px circular avatars in cards, which is a contact sheet, not portrait editorial. The brief's portrait archetype needs `4/5` panels at column-capsule scale. Rebuild against `PortraitFigure` and the column capsule. |
| `partner-directory.tsx` | **REPLACE** | Renders a logo or, failing that, an ad-hoc pill of the partner's name. Needs the lockup slot (`5/2`, `contain`) with `MediaFallback variant="monogram"`, and `rounded-[26px]` removed. |
| `careers-list.tsx` | **EXTEND** | The wide-plate-not-portrait reasoning is right and stays. Replace the `Card` stack with the data-table treatment: role, team, location, type and closing date are five aligned attributes across N rows, which is a table. |
| `content-page.tsx` | **KEEP** | The three-step treatment rotation is the correct answer to alternation fatigue. Extend only its treatment set once the new media treatments exist. |
| `editorial-guidance-grid.tsx` | **KEEP** | Deliberately gives its two columns different treatments so they read as one composition. Raise the `text-[0.65rem]` eyebrow to the 11px floor. |
| `newsletter-signup-form.tsx` | **EXTEND** | Input border must clear 3:1 (§7.5); `TextInput` currently inherits `border-brand-border` at 1.28:1. |

### 8.4 `components/content/`

| Component | Verdict | Detail |
| --- | --- | --- |
| `panel-list.tsx` | **KEEP** | The sanctioned rendering for arrays of sentences. No bullets, no markers. |
| `label-pills.tsx` | **EXTEND** | The sanctioned rendering for arrays of short labels. Remove or re-ground the `warm` tone: `accent` on `#FBE7EF` is 4.38:1 and fails (§2.3). |
| `process-sequence.tsx` | **KEEP** | `<ol>` with `list-none`: correct semantics, no dot-and-line presentation. The spine matched to a non-branching sequence is exactly the "match the metaphor to the structure" rule. |
| `quote-block.tsx` | **EXTEND** | Uses `ContentImage aspectRatio="square"` with a `rounded-full` class rather than `CircularFigure`, so it misses the rim treatment. Swap to `CircularFigure`. |
| `section-intro.tsx` | **KEEP** | The redesigned section opener. Weight from a short accent rule plus type. |
| `feature-card.tsx` | **EXTEND** | Renders a literal `→` character as the link affordance. Replace with the CSS-geometry chevron `RouteCardGrid` already uses, so it inherits colour and animates with the card. |
| `stats-section.tsx` | **KEEP** | The good statistic treatment: a divided row, not dashboard cards. Under Option C its `navy` tone's `text-brand-warm` eyebrow becomes `gold` (7.15 on `#142850`). |
| `story-section.tsx` | **EXTEND** | Imports `ArrowRight` from `lucide-react`, banned in public UI. Also hardcodes `imagePosition` alternation at the call site; add a `treatment` prop so it can take a wide plate, a cluster or an overlap instead of always a `4/3` `ContentImage`. |
| `figure-statistic.tsx` | (see `stat-list` above) | The replacement file, not a NEW component. |
| `data-table.tsx` | **NEW (3)** | The third rendering for a content array, after `PanelList` (sentences) and `LabelPills` (short labels): a **comparison**, where several records share the same attributes and the reader's job is to scan across them. `OrganisationPackage[]`, `TrainingCohort[]`, `TrainingAudienceCard[]` and `JobListing[]` are all this shape and are currently either bullet lists or card stacks. A real `<table>` with `<caption>`, `<th scope>`, and a horizontal-scroll wrapper. This is the no-bullet-list rule's missing third answer. |

### 8.5 `components/ui/`

| Component | Verdict | Detail |
| --- | --- | --- |
| `button.tsx` | **EXTEND** | Collapse fourteen variants to the five in §7.2 plus `danger` (admin only) and, under Option C, `category`. The removed names stay as deprecated aliases mapping onto the five, so admin call sites keep compiling while public call sites migrate. Remove the inverting hover states. Retire the parallel `.itfy-button-*` and `.itfy-btn-*` blocks in `globals.css` in the same change; two systems for one job is the actual defect. |
| `card.tsx` | **KEEP** | Tone and variant split is sound. Public pages should reach for it less; that is a usage rule, not a component defect. |
| `form-field.tsx` | **EXTEND** | `border-brand-border` at 1.28:1 fails the 3:1 boundary requirement (§7.5); `rounded-2xl` is not a radius token; error text is `text-rose-600`, outside the palette. Fix all three. |
| `state-message.tsx` | **EXTEND** | `rounded-[28px]` → `--radius-panel`. |

### 8.6 `components/layout/`

| Component | Verdict | Detail |
| --- | --- | --- |
| `page-container.tsx` | **EXTEND** | `max-w-7xl px-4 sm:px-6 lg:px-8` predates the token set. Point it at `--measure-page` and `--gutter` so one definition of the page edge exists. |
| `page-header.tsx` | **KEEP** | Legacy, used on roughly fifty un-redesigned pages. Leave it; redesigned pages use `SectionIntro`. Retire it when the last legacy page is converted, not before. |
| `announcement-bar.tsx` | **EXTEND** | `animate-banner-in` has no reduced-motion fallback (§6.2). Add `motion-reduce:animate-none`. |
| `floating-elements.tsx` | **EXTEND** | Imports `ArrowUp`, `Heart` and `X` from `lucide-react`. The scroll-to-top and close controls are the strongest remaining case for real icons anywhere on the site, and they still lose: all three are drawable as CSS geometry, and the no-icons rule has no exception. |
| `site-header.tsx`, `site-footer.tsx` | **EXTEND** | Out of scope for this document beyond the token migration; navigation IA is settled and not being redesigned. |
| `editorial-grid.tsx` | **NEW (4)** | The twelve-column grid with the annotation rail (§3.3). `PageContainer` is `max-width` plus padding and nothing else; there is no component in the repository that owns column spans, and without one the named spans in §3.3 become arbitrary Tailwind strings repeated across thirty routes. Exposes a `rail` slot and a `span` prop taking the eight names. |

### 8.7 `components/capsule/` addition

| Component | Verdict | Detail |
| --- | --- | --- |
| `capsule-counter.tsx` | **NEW (5)** | The numeral lens (§4.4.5). `CapsuleMedia` is entirely image machinery: a `LensImage[]` contract, crossfade state, a progress ring and a `next/image` fill. Adding a numeral mode would put two unrelated components behind one name. This is ~40 lines that reuse `CapsuleShell` and the existing rim shadow. |

### 8.8 `lib/`

| Module | Verdict | Detail |
| --- | --- | --- |
| `lib/media/remote-image.ts` | **KEEP** | The single contract for external image URLs. Every treatment in §5 routes through `resolveImageSrc()`. |
| `lib/utils/contrast.ts` | **EXTEND** | Add the new pairings and bans from §2 to its test file, in whichever commit changes the palette. |
| `lib/utils/css-color.ts` | **KEEP** | `safeCssColor` already guards CMS-supplied accents. |

### 8.9 NEW component count

**Five.** `filmstrip.tsx`, `overlap-composition.tsx`, `data-table.tsx`,
`editorial-grid.tsx`, `capsule-counter.tsx`.

Four more were drafted and then removed after checking what exists:

- `document-plate` and `monogram-lockup` → two `aspectRatio` values plus a `fit`
  prop on `ContentImage`, now that `MediaFallback` exists.
- `annotation-rail` → a slot on `EditorialGrid`, not a component. A rail that can
  be placed independently of its grid is a rail that will drift out of alignment.
- `figure-statistic` → the replacement for `StatList`, counted as a REPLACE.

