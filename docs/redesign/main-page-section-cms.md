# Main-page section registry and CMS handoff

Status: **Current implementation + proposed CMS persistence**  
Repository: `new_site`  
Implemented: 2026-08-26

## Outcome

The nine public main pages now render through one typed section registry:

```text
existing CMS/domain reader
        ↓
route-specific adapter in lib/content/main-page-sections.ts
        ↓
PageSection[]
        ↓
PageSectionRenderer
        ↓
shared editorial components
```

This changes the presentation boundary without changing Firestore documents. Existing CMS records remain the source of content. The adapters arrange those records into the section order and visual treatments defined by `docs/design_templates/`.

The palette decision in `design-system.md` still applies: the templates govern composition, hierarchy, media proportion and rhythm; the live blue/crimson tokens govern colour.

## Adopted pages

| Route | Reference | Current ordered blocks |
| --- | --- | --- |
| `/` | `01-homepage.html` | hero, manifesto, programmes, impact, story, involve, publication feed, newsletter closing |
| `/who-we-are` | `02-who-we-are.html` | hero, origin story, manifesto, mission/vision, principles, people, partners, closing |
| `/what-we-do` | `03-what-we-do.html` | hero, journey, five programme chapters, filmstrip, index, closing |
| `/departments` | `04-departments.html` | hero, intro, organisation map, delivery, systems, communications, people, index, closing |
| `/apply-for-training` | `05-apply-for-training.html` | hero, intro, pathway, courses, experience, eligibility, outcomes, learner story, apply |
| `/for-organisations` | `06-for-organisations.html` | hero, intro, services, engagement, evidence, graduates, volunteering, story, closing |
| `/partner-with-us` | `07-partner-with-us.html` | hero, intro, ecosystem, partner types, development, model, story, index, closing |
| `/our-impact` | `08-our-impact.html` | data hero, intro, headline figure, impact arc, reach, evidence, story, evidence routes, partners, closing |
| `/news-and-updates` | `09-news-and-updates.html` | publication hero, news desk, ideas, essay, topics, working newsletter form |

## Contract

`types/page-sections.ts` defines twelve discriminated component types:

```text
hero
editorialIntro
mediaNarrative
featureCollection
processPath
relationshipMap
metricStory
storyQuote
linkedIndex
publicationFeed
callToAction
newsletterSignup
```

Every block carries a stable `id`, `componentType`, compatible `variant`, optional `anchor`/`navLabel`, optional `theme`, and `enabled` state. Shared content shapes cover headings, actions, media, items and metrics.

`lib/page-sections/schema.ts` is the persistence validator. It rejects:

- unknown component types;
- variants that do not belong to the selected component;
- empty required content;
- invalid anchors;
- duplicate section IDs or anchors;
- more than one enabled hero.

### Safe swapping rule

Editors may switch `variant` inside one component type without migrating content. Examples:

- `mediaNarrative.split` → `mediaNarrative.capsule`;
- `processPath.arc` → `processPath.numbered`;
- `linkedIndex.rows` → `linkedIndex.tiles`.

Changing `componentType` is not inherently lossless. A `metricStory` cannot become a `storyQuote` because metrics and attribution are different contracts. The admin UI must offer an explicit conversion with a field-level preview, or require the editor to create a replacement block. It must never silently discard fields.

The `teal` and `gold` theme names remain only as persisted compatibility roles. The renderer maps them to the approved primary-dark and accent grounds. New CMS copy should label these roles by purpose, not by the old colour names.

## Proposed Firestore shape

Do not persist this until the editor, preview and migration tests ship together.

```text
pageCompositions/{pageId}
  schemaVersion: 1
  revision: number
  status: draft | published | archived
  updatedAt: Timestamp
  updatedBy: uid
  sections: PageSection[]
```

Recommended page IDs:

```text
home
who-we-are
what-we-do
departments
apply-for-training
for-organisations
partner-with-us
our-impact
news-and-updates
```

The composition document should own layout and section order. Domain collections should continue to own reusable records such as initiatives, departments, articles, partners and courses. A composition block that references a domain record should persist its stable ID, not a copied snapshot, unless an intentional editorial snapshot is required.

## Read and fallback behavior

The safe migration sequence is:

1. Keep the current adapters as the fallback composition.
2. Add a `getPageComposition(pageId)` reader that validates with `pageSectionDocumentSchema`.
3. Use a validated published composition when present.
4. Fall back to the adapter on a missing, invalid or draft document.
5. Log the fallback with `pageId`, schema version and validation issue paths. Never log submitted PII or complete private URLs.
6. Preserve the current domain readers underneath reference blocks.

An explicitly published empty `sections` array is invalid. It must not erase a public page. Disabled blocks remain in the document and can be restored.

## Admin editor requirements

The later CMS build needs:

- a component picker driven by `pageSectionCatalog`;
- drag-and-drop ordering with keyboard-accessible move controls;
- compatible variant picker;
- theme, anchor, navigation label and visibility controls;
- field editors generated from the selected discriminated schema;
- media URL, alt text, focal point, caption and credit controls;
- reference pickers for initiatives, departments, courses, articles and partners;
- draft preview using the exact public renderer;
- field-level warnings before a type conversion;
- optimistic concurrency using `revision`;
- publish audit records and rollback to a prior revision.

Do not use `z.unknown()` or a JSON textarea for persisted blocks. Server validation is authoritative even when the client form validates first.

## Known content-model gaps

The first pass deliberately uses current CMS fields. These gaps need first-class fields before editors can reproduce every reference composition without adapter copy:

| Page | Missing CMS content |
| --- | --- |
| Departments | no hub-level page record for intro, map labels, communications, people and closing copy |
| Training | main record does not own the course catalogue, detailed experience/outcome fields or a verified learner story |
| Organisations | no dedicated graduate-talent, volunteering or partnership-story blocks |
| Partner With Us | no development-alignment or collaboration-story block |
| Our Impact | no geography/reach model or featured impact story on the overview record; metrics lack required provenance/date |
| Who We Are | main record links to team/partners but does not reference selected records for its own people/partner sections |
| Homepage | partner/testimonial collections remain separate and are not part of the adopted eight-chapter template composition |

Never invent missing claims, quotes, partner identities, reach figures or geography. A metric intended for publication should eventually require `source` and `asOf` fields. A quote should require verification status and reviewer identity before publishing.

## SEO boundary

Page title, description, canonical path and share image are page metadata, not reorderable content blocks. Keep them in the page/domain record and feed them through `lib/seo/page-metadata.ts`. A hero title change must not silently overwrite the canonical SEO title.

## Verification

- `lib/page-sections/schema.test.ts` gates persisted shapes, swaps, duplicates and hero count.
- `components/page-sections/main-page-adoption.test.ts` gates route adoption, chapter order and exhaustive rendering.
- `components/home/homepage-sections.test.ts` gates homepage order and CMS data flow.
- `npm run eval:main-pages` scores all nine template mappings, registry coverage and accessibility invariants.

The CMS is ready to build when the proposed reader, reference fields, admin editor, preview, authorization tests, audit logging and migration tests are one reviewed change set.
