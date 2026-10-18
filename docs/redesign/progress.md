# Redesign progress

Coordinator-maintained. One row per unit of work, newest phase last.

Repository identity at start: `new_site` @ `37db40a`.

## Phase 0 — reconciliation

| Deliverable | Owner | Status |
| --- | --- | --- |
| `current-baseline.md` | Agent A | done, 789 lines |
| `design-system.md`, `page-archetypes.md` | Agent B | done, 21 archetypes over 30 routes |
| `cms-reconciliation.md` | Agent C | done, 1015 lines, 12 gaps |
| `routing-decisions.md` | Agent D | done, committed as `e752b19` |
| `media-policy.md` | Coordinator | done |
| `placeholder-media.json` | Coordinator | done, empty |

No asset audit is being performed. See `media-policy.md` for why.

## Phase 1 — shared foundations

| Item | Status | Evidence |
| --- | --- | --- |
| Editorial typefaces self-hosted | done | `735b33f`, `app/typography.test.ts` |
| Typographic media fallback | done | `components/media/media-fallback.tsx` |
| Gradient media substitutes removed | done | `scripts/media-pairing.mjs` reports 0 |
| Grey `placeholder.svg` deleted | done | `lib/content/placeholder-registry.test.ts` |
| One remote-image contract | done | `lib/media/remote-image.ts` + drift test |
| Placeholder registry with teeth | done | `lib/content/placeholder-registry.test.ts` |
| Colour tokens | settled | blue + crimson kept, see decision below |
| Spacing, container, grid | not started | |
| Buttons, capsule primitives | not started | |
| Navigation, footer | not started | |
| Video handling, motion, a11y foundations | not started | |

## Phase 1.5 — routing and SEO corrections

| Item | Status | Evidence |
| --- | --- | --- |
| One canonical course URL | done | `52399d8`, two routes deleted and 301'd |
| Real 404s on dynamic routes | done | `app/routes.test.ts` |
| Titles render the org name once | done | `app/metadata-titles.test.ts` |
| Redirect integrity gate | done | `app/routes.test.ts` |
| Sitemap: courses, real lastModified | done | `app/routes.test.ts` sitemap coverage |
| Metadata, canonical and OG on every public route | done | `lib/seo/page-metadata.ts`, coverage suite in `app/metadata-titles.test.ts` |
| `discover-routes.mjs` is wrong four ways | not started | route floor is 60, not 53 |

Every route under `app/(public)` now builds its metadata through
`pageMetadata()`, which supplies the canonical URL, the openGraph block and a
share image, and falls back to the logo when a page has no photograph. Four
assertions keep it that way: every public page declares metadata, every one
imports the shared contract, every static route declares its own path, and
every dynamic route canonicalises itself. The path assertion is the one that
matters most, because a copied `generateMetadata` block that keeps the path it
was copied from points two routes at one canonical URL.

## Phase 2 — editor control and primitive placement

| Item | Status | Evidence |
| --- | --- | --- |
| Sections carry their own layout, not their array index | done | `types/content.ts` `MediaTreatment`, `components/shared/content-page.tsx` |
| One media-URL verdict for form and save | done | `lib/cms/media-url.ts`, `lib/cms/media-url.test.ts` |
| Admin can set a section's image, alt, video and layout | done | `components/admin/media-fields.tsx`, `components/admin/media-fields.test.ts` |
| Open roles render as a table, not a card stack | done | `components/shared/careers-list.tsx`, `careers-list.test.ts` |
| Initiative gallery is a scroll strip, no lightbox | done | `components/what-we-do/initiative-page.tsx` |
| Every primitive has a call site | done | `components/primitive-consumers.test.ts` |
| Prose renders at the documented body size | done | `tailwind.config.ts` fontSize, `app/type-scale.test.ts` |

`components/content/quote-block.tsx` is the one primitive with no consumer. It
is recorded in the UNPLACED map in `primitive-consumers.test.ts` with the
reason, so the debt is named rather than discovered later by a dependency
graph.

The initiative gallery's lightbox was removed with the component. It closed on
an outside click, had no Escape handler and no focus trap, so it failed §24 of
the constitution; native scroll has no controller to get wrong.

## Phase 3 — main-page template adoption

| Item | Status | Evidence |
| --- | --- | --- |
| Typed section registry | done | `types/page-sections.ts`, `lib/page-sections/schema.ts` |
| Twelve shared section renderers | done | `components/page-sections/` |
| Nine main routes use the registry | done | `components/page-sections/main-page-adoption.test.ts` |
| Template chapter order adopted | done | `lib/content/main-page-sections.ts`, `components/home/homepage-sections.tsx` |
| Existing CMS/domain data preserved through adapters | done | `lib/content/main-page-sections.ts` |
| CMS persistence and editor handoff documented | done | `docs/redesign/main-page-section-cms.md` |
| Main-page eval | done | `npm run eval:main-pages` |

This phase changes the rendering boundary, not Firestore. The current fixed
domain records remain authoritative for content while the adapters supply an
ordered `PageSection[]`. The later CMS composition document and admin editor
must follow the migration contract in `main-page-section-cms.md`.

## Design references

`docs/design_templates/` holds nine finished HTML page concepts and is the
**current layout reference**: section rhythm, capsule geometry, type scale,
asymmetry, media proportions and responsive collapse. Its colours are not
adopted. `docs/design_iu_examples/` is legacy and must not be used.

## Open decisions

### Palette — RESOLVED: keep blue and crimson

The brief named Navy `#0C2D5A`, Deep Navy `#081D3D`, Gold `#F5A623`, Teal
`#157F6B`, Ink `#11233F`, Mist `#EEF2F8`, Border `#E3E8F0`. The implementation
uses primary blue `#1E72BA`, primary dark `#0152BE`, crimson accent `#D70B52`,
deep `#142850`, mist `#E8F1FA`, border `#D8E5F2`.

`public/images/logo/logo.png` is blue and crimson: two figures, one of each,
over a crimson monitor inside a blue roundel. The brief's gold and teal appear
nowhere in the mark. The owner ruled that the implemented palette stands and
that gold and teal are dropped.

Consequences: no retokening, and the WCAG AA work in commit `947b5fe` against
the crimson accent stays valid. The brief remains authoritative on layout,
archetypes and editorial direction; the logo and the implemented tokens are
authoritative on colour. Do not reopen this by citing the brief's colour
section.

## Known issues, not caused by the redesign

`npm run build` logs this twice during static generation and still exits 0:

```
Error: Only plain objects, and a few built-ins, can be passed to Client
Components from Server Components. Classes or null prototypes are not supported.
digest: '2616353881'
```

Next attributes it to no page, and the stack is entirely inside
`next-server/app-page.runtime.prod.js`. The likely cause is an admin page
passing a Firestore value straight into a client form: `lib/cms/applications.ts`
and `lib/cms/contact-messages.ts` both convert timestamps on read, and the
readers that do not convert are the suspects. It predates this work and sits in
the admin surface, outside the public redesign. Worth a separate investigation,
because a prop that fails to serialise is a real runtime fault, not a warning.

Three WCAG AA failures measured in the current palette and still unfixed:
`accent` on `brand-warm` 4.38:1, `primary` on `brand-mist` 4.41:1, and
`brand-border` `#D8E5F2` at 1.28:1 where it is used as a form-control boundary
rather than a hairline. See `design-system.md` §2.3.

`scripts/discover-routes.mjs` is wrong four ways and reports 53 routes where the
floor is 60. See `routing-decisions.md`.

`npm run build` can fail with "Static page generation for /news-and-updates is
still timing out after 3 attempts" when Firestore is unreachable: the read hangs
past the 60-second per-page limit instead of failing fast to seed content. It is
an offline-environment flake, not a code fault, and the same commit builds green
on a retry. A read timeout on the CMS client would remove it.

## Verification baseline

`npm run type-check`, `npm run lint`, `npm test` and `npm run build` all pass at
every commit recorded above.
