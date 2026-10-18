# ITFYG Page Archetypes

**Status:** Proposed. Companion to `docs/redesign/design-system.md`, which owns
the tokens, grid, capsule geometry, media treatments and component contract this
document references. Read that first.
**Repository identity:** `new_site` @ `37db40a`.
**Coverage:** 21 archetypes across every public route under `app/(public)/`.
Thirty routes are live; two more (`/programs/[category]/[courseId]` and
`/programs/course/[courseSlug]`) were deleted and permanently redirected while
this document was being written, per `docs/redesign/routing-decisions.md`. Both
are listed below so the mapping stays traceable. No route is unassigned.

---

## How to read an archetype

**Text density** is a fixed five-step scale, so "short" never means two different
things in two archetypes:

| Step | Words | Type role |
| --- | --- | --- |
| `label` | ≤ 8 | `--type-label` |
| `tight` | ≤ 40 | `--type-deck` |
| `medium` | 40–120 | `--type-body` |
| `full` | 120–400 | `--type-body` |
| `long` | 400+ | `--type-body-long` |

**Media treatment** names come from `design-system.md` §5: full-bleed band, wide
plate, portrait panel, circular crop, capsule crop, image cluster, filmstrip,
overlapping composition, statistic-with-negative-space, document plate, lockup
slot, video frame. Plus the non-photographic content-bearing forms that satisfy
the pairing law: counter capsule, data table, process spine, pathway tree.

**The rhythm rule** in every archetype is a specialisation of one global law:

> **No two adjacent sections use the same media treatment, and no treatment
> appears more than twice on a page.** Where a sequence would repeat, the second
> instance changes treatment, not content. Alternating left/right with the same
> treatment does **not** count as a change: alternation is the failure mode, not
> the fix. `components/shared/content-page.tsx` already implements this correctly
> as a three-step rotation and is the reference.

**The pairing law** applies everywhere: every substantive text block sits in a
real visual relationship with photography, video, data, a pathway, a diagram or
another content-bearing visual form. Sections below that carry no photograph name
the non-photographic form they use instead.

**Mobile collapse** is governed by two invariants that every archetype must hold:

1. **A caption never separates from its image.** At ≥1280px captions live in the
   annotation rail; below that they move inside the image's own `<figure>`. They
   never become a floating text block.
2. **A text block never separates from its media.** A two-part row collapses to
   media-then-text in DOM order, inside one wrapper, never into two independent
   full-width sections that a reader can scroll between.

---

## Consolidations

Seven of the brief's named archetypes were merged, because in each case the two
have the same section structure and the same CMS shape and differ only in
vocabulary. Merging them means one template to maintain instead of two that
drift.

| Merged into | From | Evidence |
| --- | --- | --- |
| **Portrait editorial** | portrait editorial + voices | Both are people at scale with portrait media and an attributed quote or bio. `TeamMemberProfile` (name, role, bio, photo) and `ImpactStory` (name, role, quote, image) are the same shape. |
| **Named-entity index** | organisation map + collaboration story | Both are a set of named entities with no per-entity photography. `Partner` carries only `id`, `name`, `logo`, `href`, `active`: there is no story data on that route, so a "collaboration story" cannot be built from it. See the CMS gap note in A4. |
| **Invitation** | join-the-mission + cause-and-outcome | Both convert one specific contribution: claim → evidence → aligned options → one action. Labour and money differ in currency, not in structure. |
| **Editorial index** | magazine front page + news desk + ideas | News desk and ideas are the same route (`/news-and-updates/[category]`) reading the same type (`ArticleCategoryContent`). The hub is that index plus two sections. |
| **Offer index** | institutional partnership + partnership ecosystem | `OrganisationOverviewContent` and `PartnershipOverviewContent` are field-for-field parallel: eyebrow, title, description, heroImage, stats, two card arrays, nextSteps, and the same optional section-copy suffixes. |
| **Offer detail** | organisation service + sector partnership | `OrganisationServicePage` and `PartnershipTrackPage` are parallel: slug, eyebrow, title, description, tagline, heroImage, stats, a focus-card array, howItWorks, a case-study array, faqs, contactCta, related. |
| **Editorial catalogue** / **Course detail** | editorial catalogue + course detail across three route families | `/programs`, `/programs/[category]` and `/apply-for-training/courses` all list `Course`; `/programs/[category]/[courseId]`, `/programs/course/[courseSlug]` and `/apply-for-training/courses/[slug]` all render one. See the canonical-route warning in A13. |

Two pairs were deliberately **not** merged:

- **Eligibility guide** and **Pathway** look similar and are not. Eligibility is a
  set of unordered conditions; a pathway is an ordered sequence. Rendering
  conditions as a spine would imply an order that does not exist, and rendering a
  sequence as a table would lose the order. The metaphor must match the structure.
- **Department feature** and **Programme journey** share a spine but not a
  contract. A department feature is one template applied eight times. A programme
  journey is a family: each initiative gets its own storytelling concept (A8).

---

## A1. Magazine cover

**Routes:** `/`
**Story job:** In one screen, say what this organisation does and give three
audiences their own door. The homepage is not a summary of the site; it is the
argument for reading further.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Stage capsule** (§4.4.1), 3–5 slides, blurred duplicate as the ground | `label` + `tight` per slide | `stage` |
| 2 | The claim | **Statistic with negative space**: the four organisation figures as one connected statement, not four cards | `label` per figure, `tight` provenance | `paper` |
| 3 | What we do | **Orbit capsule** (§4.4.3) across the eight initiatives | `label` + `tight` per node | `paper` |
| 4 | One story in depth | **Overlapping composition**: a place plate with a person over its lower-leading corner | `medium` | `tint` |
| 5 | Three doors | **Circular crop** per audience, three across, no cards | `label` + `tight` | `paper` |
| 6 | Evidence | **Full-bleed band** with an overlaid claim | `tight` | `deep` |
| 7 | Partners | **Lockup slot** row | `label` | `paper` |
| 8 | Closing | **Counter capsule** (donation progress) beside the newsletter form | `tight` | `deep` |

**Anti-pattern it prevents:** the NGO homepage that is a hero image, a four-card
stat strip, three identical programme cards and a donate band. Sections 2, 3 and
5 are the three places that template appears, and each uses a different form here
(a connected statement, an orbit, and circular portraits).

**Rhythm rule:** the sequence runs capsule → data → capsule → photography →
photography → photography → typography → capsule. Sections 4, 5 and 6 are all
photographic and are the page's one run of three; they are separated by changing
scale hard each time (one composition → three circles → one full-bleed frame).
Sections 3 and 8 are both capsules and are six sections apart, which satisfies the
frequency rule (§4.5) only because the stage capsule and the counter capsule are
different expressions. No two adjacent grounds repeat.

**Mobile collapse:** the stage capsule becomes the column capsule at ≤820px with
autoplay off under reduced motion. Section 2's four figures become a single
scrolling row of counter capsules, keeping each label with its figure. Section 3's
orbit becomes a stack of already-open capsules (existing behaviour). Section 4
de-overlaps: plate, then portrait at two-thirds width, one `<figure>`, one
caption. Section 7's lockups go three-up then two-up.

**CMS fields:** `HeroSlide[]` (`eyebrow`, `heading`, `body`, `image`, `accent`,
`overlayFrom`, `overlayTo`, `mediaCaption`, `cta`) · `heroStats: HighlightStat[]`
· `InitiativePage.{slug,title,tagline,heroImage,accent}` for the orbit ·
`HomepageSection[]` · `JoinCtaCard[]` (`eyebrow`, `title`, `description`, `href`,
`buttonLabel`, `image`, `imageAlt`; the `icon` field is retained in the model and
never rendered) · `Partner[]` · `DonationCampaignContent` ·
`NewsletterSignupContent`.

---

## A2. Organisation profile

**Routes:** `/who-we-are`, `/who-we-are/[slug]`
**Story job:** Establish that this is a real institution with a history, a
position and people, not a project. The child routes are the same archetype at
reduced scale for governance, history and policy pages.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Leading-lobe capsule** (§4.4.2), one photograph | `label` + `medium` | `mist` |
| 2 | Position | **Wide plate**, `cinema`, above a `text-offset` column | `full` | `paper` |
| 3 | How we work | **Image cluster**, 2–3 frames, beside `text-narrow` set lower than the cluster | `full` | `paper` |
| 4 | Figures | **Statistic with negative space**, two figures maximum | `label` + `tight` | `tint` |
| 5 | Principles | **Panel list** in two columns beside a **circular crop** | `medium` per panel | `paper` |
| 6 | The people | **Portrait panel**, three featured members, linking to A3 | `label` | `paper` |
| 7 | Routes onward | `RouteCardGrid` | `tight` per card | `mist` |

**Anti-pattern it prevents:** the about page that is 900 words of mission prose
with one office photograph. Sections 2, 3 and 5 break the prose into three
differently-shaped arguments, each paired with a different form.

**Rhythm rule:** no two adjacent sections share a treatment, and the two
photographic sections (2 and 3) differ in kind; one contained plate versus a
stepped cluster. Section 5's circular crop is the orientation-agnostic fallback
and is the only circle on the page. `/who-we-are/[slug]` inherits the sequence but
drops sections 4 and 6, because a child page that repeats the parent's figures and
portraits is a duplicate.

**Mobile collapse:** the capsule becomes a column capsule. The cluster's offsets
go to zero and the frames stack flush, with the text block following in DOM order
inside the same wrapper. Section 5's two panel columns become one. Section 6 goes
one-up with each caption inside its own `<figure>`.

**CMS fields:** `SitePage`: `eyebrow`, `title`, `description`, `intro`,
`heroImage`, `heroImageAlt`, `stats`, `sections: ContentBlock[]`
(`title`/`body`/`bullets`/`image`/`imageAlt`), `principlesEyebrow`,
`principlesTitle`, `principlesImage`, `principlesImageAlt`, `related`, `ctas`,
`exploreEyebrow`/`exploreTitle`/`exploreDescription`. Child pages use
`DynamicSitePage` with `parentSlug: "who-we-are"` and `status`.

---

## A3. Portrait editorial

**Routes:** `/who-we-are/team`, `/our-impact/testimonials`
**Story job:** Make individual people legible as individuals. This is the one
archetype where portrait orientation is mandatory rather than preferred, because
the subject is a person and a `4/5` frame is the honest shape for one. Per
`docs/redesign/media-policy.md` the choice is about the subject, not about what
the archive happens to hold.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Overlapping composition**: a working plate with one portrait over it | `label` + `tight` | `paper` |
| 2 | One voice in full | **Column capsule** (§4.4.4) at large scale, one subject | `medium` quote or bio | `tint` |
| 3 | The set | **Portrait panel** grid, 3-up at ≥1280px, uneven column heights via a 24px offset on every second panel | `label` name, `label` role, `tight` bio | `paper` |
| 4 | Grouping | Group headings only, no media of their own | `label` | `paper` |
| 5 | Attribution note | **Data table** where the subject list carries structured attributes (department, programme, year, theme) | `label` | `mist` |
| 6 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

`/who-we-are/team` groups by department (section 4 is the department heading, a
link to A6's detail page). `/our-impact/testimonials` groups by theme, and its
section 2 is `ImpactFeaturedStory` rather than a featured team member.

**Anti-pattern it prevents:** the contact-sheet grid of 64px circular avatars in
cards. `components/shared/team-directory.tsx` currently does exactly this and is
marked REPLACE. A 64px circle of a person's face carries no information about the
person; a `4/5` panel does.

**Rhythm rule:** section 3 is a grid of identical treatments, which the global
rule would normally forbid. It is permitted here and only here, because the
subjects genuinely are peers and any variation between them would imply a
hierarchy the organisation does not have. The 24px vertical offset on alternate
panels is what stops it reading as a spreadsheet, and it is the only decoration
allowed. Sections 1, 2 and 3 are all portrait media and are differentiated by
scale: overlapped, single large, gridded.

**Mobile collapse:** section 1 de-overlaps. Section 2's column capsule is already
its mobile form. Section 3 goes two-up at 640–1023px and one-up below, each
`<figcaption>` inside its own `<figure>`. The 24px offset is dropped below
1024px, where it would look like a mistake.

**Missing-portrait rule:** a member or storyteller with no `photo` renders
`MediaFallback variant="monogram"` at the panel's exact `4/5` proportions. Never a
stock face. Never a generic silhouette. The slot is still designed around the
eventual portrait's proportions.

**CMS fields:** `TeamMemberProfile[]`: `name`, `role`, `department`,
`departmentSlug`, `bio`, `photo`, `email`, `linkedin`, `featured`, `status`,
`order`. `ImpactTestimonialsContent`: `eyebrow`, `title`, `description`,
`heroImage`, `featuredStory: ImpactFeaturedStory`, `stories: ImpactStory[]`
(`quote`, `name`, `role`, `programme`, `year`, `theme`, `image`, `format`),
`themes`, `related`, `listSection*`.

---

## A4. Named-entity index

**Routes:** `/departments`, `/who-we-are/partners`
**Story job:** Show a set of named entities and the relationships between them,
where no entity has photography of its own. The subject is the structure, so the
structure is the visual.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Wide plate**, `cinema`, of the whole organisation at work | `label` + `medium` | `paper` |
| 2 | The map | **Diagram**: entities as typographic nodes on a grid, sized by a real attribute (`order` for departments, nothing for partners so all equal), connected by hairlines where a relationship exists in the data | `label` + `tight` per node | `tint` |
| 3 | Each entity | **Lockup slot** (partners) or **counter capsule** carrying the entity's headline figure (departments) | `label` + `tight` | `paper` |
| 4 | What the set adds up to | **Statistic with negative space** | `tight` | `mist` |
| 5 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** the grid of identical cards each led by the same
icon. `DepartmentProfile.icon` and `iconImage` exist in the model and are never
rendered; `Partner.logo` is rendered but must fall back to a monogram, never to a
substituted logo and never to an empty box.

**Rhythm rule:** sections 2, 3 and 4 are all non-photographic, which is unusual
and correct: there is no honest photography for "the partnerships department" as
an abstraction. They are differentiated by form: diagram, then lockup or capsule,
then a bare figure. Section 1 is the page's only photograph and carries the
pairing law for the whole page's opening.

**Mobile collapse:** the diagram's connecting hairlines are dropped below 1024px
(a connector across a stacked column is a line to nowhere) and the nodes become a
single-column stack retaining their size ordering. Lockups go three-up then
two-up.

**CMS gap, recorded rather than designed around:** `/who-we-are/partners` reads
`Partner` (`id`, `name`, `logo`, `href`, `active`). There is no per-partner
description, no collaboration summary and no outcome field, so the "collaboration
story" the brief asks for cannot be built from current data. Two options, both
outside this document's authority: add `summary` and `since` to the partner
record, or route the collaboration narrative through `PartnershipScenario` on the
A15 pages and keep this route as an index. **This needs a decision before A4 is
built for `/who-we-are/partners`.**

**CMS fields:** `DepartmentProfile[]`: `slug`, `eyebrow`, `title`, `summary`,
`stats`, `color`, `featured`, `status`, `order` (`icon`/`iconImage` retained,
never rendered). `Partner[]`: `id`, `name`, `logo`, `href`, `active`.

---

## A5. Invitation

**Routes:** `/who-we-are/careers`, `/donate`
**Story job:** Convert one specific contribution. Everything on the page argues
for one action, and the page ends when the reader can take it.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | The ask | **Wide plate**, `cinema`, of the work the contribution funds or staffs | `label` + `tight` | `paper` |
| 2 | Why now | **Counter capsule** carrying the live figure: donation progress against goal, or open-role count and nearest closing date | `tight` | `deep` |
| 3 | The argument | `text-major` beside an **image cluster** set lower than the frames | `full` | `paper` |
| 4 | The options | **Data table**: roles by team, location, type and closing date; or giving levels by amount and what it funds | `label` per cell | `paper` |
| 5 | What happens next | **Process spine**, 3–4 steps | `tight` per step | `tint` |
| 6 | The action | One `primary` action, alone, on a **full-bleed band** | `tight` | `deep` |

**Anti-pattern it prevents:** the donate page that is a progress bar and a grid of
amount buttons, and the careers page that is a stack of identical cards. Section 4
is a table in both cases because both are comparisons; the reader is scanning
across attributes, which is what a table is for and what a card stack destroys.

**Rhythm rule:** exactly one `primary` action on the page and it is in section 6.
Sections 1 and 3 are the only photography and are separated by the counter
capsule. Section 6's band is the page's second full-width dark ground after
section 2; they are four sections apart. No section repeats section 4's table.

**Mobile collapse:** section 3's cluster stacks flush with its text following in
the same wrapper. Section 4's table scrolls horizontally inside its own
`overflow-x: auto` container with the first column sticky; it does **not** become
a card stack, because turning a comparison into cards is what loses the
comparison. Section 6's band keeps the action at 48px minimum target.

**CMS fields:** `JobListing[]`: `title`, `summary`, `team`, `location`, `type`,
`status`, `applyUrl`, `closingDate`, `featured`. `DonationCampaignContent`:
`eyebrow`, `headline`, `description`, `image`, `currency`, `goalAmount`,
`raisedAmount`, `donorCount`, `deadline`, `supportPoints`, `primaryCta`,
`secondaryCta`, `active`. **`goalAmount`, `raisedAmount` and `donorCount` are
rendered exactly as stored. They are never rounded to fit the counter capsule and
never recombined into a derived percentage that is not in the record.**

---

## A6. Department feature

**Routes:** `/departments/[slug]`
**Story job:** Show one internal unit as a working team: what it owns, how it
works, who is in it, and how to reach it. This is the only archetype that binds a
unit to named people.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Leading-lobe capsule**, accented with the department's `color` | `label` + `medium` | `mist` |
| 2 | What it owns | **Panel list** from `responsibilities`, two columns, beside a **circular crop** | `medium` per panel | `paper` |
| 3 | Services | **Wide plate** per service, alternating with `text-offset` on a two-step rotation | `full` | `paper` |
| 4 | How it works | **Process spine** from `workflows` | `tight` per step | `tint` |
| 5 | Figures | **Statistic with negative space**, two maximum | `label` + `tight` | `paper` |
| 6 | The team | **Portrait panel**, members resolved from `teamMemberIds` | `label` name, `label` role | `paper` |
| 7 | Resources and contact | **Data table** of resources, with the contact beside it in `text-narrow` | `label` per row | `mist` |
| 8 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** the department page that is four bulleted lists
(responsibilities, services, priorities, resources) stacked under one heading.
Each of those arrays gets a different form here: panels, plates, a spine and a
table respectively.

**Rhythm rule:** `services` is variable-length and is where repetition creeps in.
Section 3 rotates on two steps (plate-above-text, then text-beside-cluster) and
never alternates left/right with the same treatment. `priorities` is folded into
section 2's panel list rather than getting a section of its own, because two
panel-list sections on one page is the repetition the rule exists to stop.

**Mobile collapse:** the capsule becomes a column capsule tinted with the
department `color`. Section 2 goes to one panel column with the circular crop
above it. Section 6 goes two-up then one-up. Section 7's table scrolls
horizontally; the contact block moves below it, still inside the same section.

**CMS fields:** `DepartmentProfile`: `slug`, `eyebrow`, `title`, `summary`,
`description`, `intro`, `mission`, `heroImage`, `color`, `responsibilities`,
`services: ContentBlock[]`, `workflows: DepartmentProcessStep[]`, `priorities`,
`stats`, `teamMemberIds`, `resources: DepartmentResource[]`,
`contact: DepartmentContact`, `ctas`, `status`, `order`.

---

## A7. Programme portfolio

**Routes:** `/what-we-do`
**Story job:** Show eight initiatives as one system rather than eight products,
and make the relationships between them visible: which feed training, which feed
community, which feed each other.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Full-bleed band** with hero stat labels overlaid | `label` + `tight` | `deep` |
| 2 | The ecosystem | **Wide plate** per ecosystem card on a three-step rotation | `medium` per card | `paper` |
| 3 | The initiatives | **Orbit capsule** across all eight | `label` + `tight` per node | `tint` |
| 4 | The pathways | **Pathway tree**, stages branching into the initiative slugs they hold | `tight` per stage | `paper` |
| 5 | In practice | **Filmstrip** from `galleryItems`, images and video frames in one row | `label` per frame | `paper` |
| 6 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** eight identical programme cards in a 4×2 grid.
Sections 3 and 4 show the same eight initiatives twice, deliberately and in two
different structures: the orbit says "here they are, one at a time" and the
pathway tree says "here is how they connect." Showing them once as cards says
neither.

**Rhythm rule:** sections 3 and 4 both render initiatives and are adjacent, which
the global rule would forbid. It is permitted here because they are structurally
different visual forms answering different questions, and the pathway tree carries
no photography at all, so the two do not read as a repeat. Section 5's filmstrip
is the page's only run of many photographs and is the last photographic section,
so the page ends on evidence.

**Mobile collapse:** the orbit becomes a stack of already-open capsules (existing
behaviour, pointer-gated at `(min-width: 821px) and (hover: hover)`). The pathway
tree's `--pathway-columns` collapses to `1fr` at ≤1023px, which the gate test
already asserts. The filmstrip stays a scroll row, which is its honest mobile
form, with `scroll-padding-inline` equal to `--gutter`.

**CMS fields:** `WhatWeDoOverviewContent`: `eyebrow`, `title`, `description`,
`heroImage`, `heroStats: WhatWeDoHeroStatLabel[]`,
`ecosystemCards: EcosystemCardContent[]` (`eyebrow`, `title`, `description`,
`image`, `imageAlt`), `pathwayCards: PathwayCardContent[]` (`title`,
`description`, `initiativeSlugs`), `galleryItems: WhatWeDoGalleryItem[]`
(`type`, `url`, `title`, `description`, `thumbnailUrl`), `nextSteps`, and the
`*SectionEyebrow`/`*SectionTitle`/`*SectionDescription` triples.

---

## A8. Programme journey

**Routes:** `/what-we-do/[slug]`: eight initiatives: `girls-in-tech`,
`youth-academy`, `entrepreneurship-hub`, `code-impact-challenge`,
`rural-tech-connect`, `community-outreach`, `advocacy`, `tech-clubs`
**Story job:** Tell one initiative as a story with a beginning, a mechanism and a
result. **This is a family, not a template.** Each initiative gets its own
storytelling concept; what follows is the shared spine and the per-initiative
variation, not eight copies of one page.

**Shared spine**: every initiative has these six beats in this order:

| # | Beat | Density | Ground |
| --- | --- | --- | --- |
| 1 | Hero: what it is | `label` + `medium` | varies by concept |
| 2 | Why it exists | `full` | `paper` |
| 3 | How it works | `tight` per step | `tint` |
| 4 | What it produces | `label` + `tight` | varies |
| 5 | Who it is for, and whether that is you | `medium` | `paper` |
| 6 | Apply or enquire | `tight` | `deep` |

**Per-initiative concept**: the media treatment of beats 1 and 4 changes, and the
`accent` colour comes from the initiative record:

| Initiative | Concept | Beat 1 | Beat 4 |
| --- | --- | --- | --- |
| `girls-in-tech` | Faces, because the barrier is representation | **Portrait panel** trio, no capsule | **Portrait panel** + attributed quote |
| `youth-academy` | A twelve-week arc, because the value is the structure | **Leading-lobe capsule** | **Process spine** with per-week deliverables |
| `entrepreneurship-hub` | Artefacts, because the output is a business | **Overlapping composition**: workspace plate with founder portrait | **Filmstrip** of ventures |
| `code-impact-challenge` | An event, because it happens on a date | **Full-bleed band** of the room | **Filmstrip** of submissions |
| `rural-tech-connect` | Place, because the point is where it reaches | **Full-bleed band**, `tall` | **Diagram**: reach as a map of named locations |
| `community-outreach` | Scale, because the number is the story | **Image cluster** | **Statistic with negative space** |
| `advocacy` | Argument, because the output is a position | **Wide plate**, `cinema`, plus a pull quote at `--type-headline` | **Document plate** row of published positions |
| `tech-clubs` | Repetition, because it is weekly and ongoing | **Filmstrip** as the hero | **Counter capsule**: clubs, schools, sessions |

**Anti-pattern it prevents:** eight pages that differ only in their photograph and
their heading. The concept column is the guard: if two initiatives would render
identically, one of them has the wrong concept.

**Rhythm rule:** within a page, beats 1 and 4 must not share a treatment; the
table above guarantees it for every initiative. Across the family, no two
initiatives share the same beat-1 treatment except `code-impact-challenge` and
`rural-tech-connect`, which are both full-bleed bands and are differentiated by
height (`short` versus `tall`) and by scrim direction.

**Mobile collapse:** capsules become column capsules. Overlapping compositions
de-overlap. Filmstrips stay scroll rows. The `rural-tech-connect` diagram becomes
a named list of locations rendered as `LabelPills`, not as a shrunken map. Beat 5's
audience and eligibility arrays render as `PanelList`, never as bullets.

**CMS fields:** `InitiativePage`: `slug`, `eyebrow`, `title`, `tagline`,
`description`, `accent`, `heroImage`, `overviewImage`, `mission`, `objectives`,
`howItWorks: InitiativeProcessStep[]`, `impactStats`,
`audience: InitiativeAudience` (`summary`, `groups`, `eligibility`),
`gallery: InitiativeGalleryImage[]`, `testimonials: InitiativeTestimonial[]`,
`partners: InitiativePartner[]`, `faqs`, `applyCta`,
`sectionContent: InitiativeSectionContent` (all section eyebrows and titles),
`quickLinks`. `InitiativeProcessStep.icon` and `iconImage` are retained and never
rendered.

---

## A9. Recruitment landing

**Routes:** `/apply-for-training`
**Story job:** The site's highest-intent page. A young person who lands here is
deciding whether to apply. Remove every reason to leave, and answer the three
questions they actually have: is it for me, when does it start, what does it cost
me.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Leading-lobe capsule**, one primary action: apply | `label` + `tight` | `mist` |
| 2 | The three questions | Three `RouteCard`s to A10, A11 and A12, each with a **circular crop** | `label` + `tight` | `paper` |
| 3 | What you learn | **Wide plate** above `text-offset`, focus areas as `PanelList` | `full` | `paper` |
| 4 | Next cohorts | **Data table**: name, start date, deadline, format, duration, location, status | `label` per cell | `tint` |
| 5 | What it takes | **Process spine** from `process` | `tight` per step | `paper` |
| 6 | Support | **Image cluster** beside `support points` as `PanelList` | `medium` | `paper` |
| 7 | Apply | One `primary` action on a **full-bleed band** | `tight` | `deep` |

**Anti-pattern it prevents:** the programme landing page that describes the
curriculum for 600 words and never states a date. Section 4 is a table with real
dates and is placed above the fold on the second scroll, not at the bottom.

**Rhythm rule:** sections 3 and 6 both pair prose with photography and are
separated by the table and the spine, neither of which is photographic. The page
has exactly two `primary` actions (sections 1 and 7) and they are six sections
apart, which satisfies §7.6.

**Mobile collapse:** section 2's three cards go one-up with the circular crop
inline above each. Section 4's cohort table scrolls horizontally with the cohort
name column sticky; status stays a text label, never a colour-only badge. Section
6's cluster stacks flush above its panels.

**CMS fields:** `TrainingLandingContent`: `eyebrow`, `title`, `description`,
`heroImage`, `stats`, `routeCards`, `focusAreas: TrainingFocusCard[]`,
`supportPoints: string[]`, `cohorts: TrainingCohort[]` (`name`, `startDate`,
`applicationDeadline`, `summary`, `format`, `duration`, `location`, `status`),
`process: TrainingProcessStep[]`.

---

## A10. Eligibility guide

**Routes:** `/apply-for-training/who-can-apply`
**Story job:** Let a reader decide in under a minute whether they qualify, and
tell the ones who do not what to do instead. Conditions are unordered, so nothing
on this page is a sequence.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Wide plate**, `cinema`, of a mixed cohort | `label` + `medium` | `paper` |
| 2 | Learner profiles | **Portrait panel** per profile, three across, each with its conditions as `PanelList` beneath | `label` + `medium` | `paper` |
| 3 | The conditions | **Data table**: condition against each profile, so a reader scans their own row | `label` per cell | `tint` |
| 4 | What helps | **Circular crop** beside readiness points as `PanelList` | `medium` | `paper` |
| 5 | In practice | **Overlapping composition** with one worked example | `medium` | `paper` |
| 6 | If this is not you | `RouteCardGrid` to the alternatives | `tight` | `mist` |

**Anti-pattern it prevents:** the eligibility page that is a bulleted checklist
under a heading. Section 3 is a table precisely because eligibility is a
comparison across profiles, and a single flat list forces every reader to read
every condition including the ones that do not apply to them. Section 6 exists so
the page has an honest answer for the reader it just excluded.

**Rhythm rule:** the page must not read as a sequence at any point. No numbered
markers, no spine, no arrows between sections. Section 2's portraits and section
5's composition are the only two photographic-people sections and are separated by
the table and the circular crop.

**Mobile collapse:** section 2 goes one-up, each profile's conditions staying
directly under its own portrait inside the same wrapper. Section 3's table scrolls
horizontally with the condition column sticky. Section 5 de-overlaps.

**CMS fields:** `TrainingEligibilityContent`: `eyebrow`, `title`, `description`,
`heroImage`, `audienceCards: TrainingAudienceCard[]` (`title`, `description`,
`bullets`), `readinessPoints: string[]`, `nextSteps: RouteCard[]`,
`practiceEyebrow`, `practiceNotes`, and the `profilesSection*`,
`readinessSection*`, `nextStepsSection*` triples. The `bullets` arrays stay in the
model and render as panels or table cells, never as dot-and-line lists.

---

## A11. Pathway

**Routes:** `/apply-for-training/how-it-works`
**Story job:** Show the ordered sequence from enquiry to enrolment, with a real
time axis, so a reader knows what happens and when. Order is the whole content, so
order is the whole visual.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Leading-lobe capsule** | `label` + `tight` | `mist` |
| 2 | Why this process | `text-narrow` beside a **circular crop** | `medium` | `paper` |
| 3 | The steps | **Process spine**, full width, one step per node | `medium` per step | `paper` |
| 4 | The timeline | **Diagram**: a horizontal time axis with the timeline items placed on it, distinct from section 3's vertical spine | `label` + `tight` per item | `tint` |
| 5 | How to prepare | **Data table**: checklist item against when it is needed | `label` per cell | `paper` |
| 6 | Start | One `primary` action on a **full-bleed band** | `tight` | `deep` |

**Anti-pattern it prevents:** the process page that renders the same steps three
times as a numbered list, then a horizontal stepper, then a FAQ. Sections 3 and 4
carry different information (3 is what happens, 4 is when), and if the CMS
supplies a `timeline` that merely restates `process`, section 4 is dropped rather
than rendered as a duplicate.

**Rhythm rule:** sections 3 and 4 are the only two sequence forms and they run on
different axes, vertical then horizontal. Section 5 is a table and breaks the
sequence deliberately, because preparation is not ordered. No section after 4 uses
a numbered marker.

**Mobile collapse:** section 3's spine is already vertical and unchanged. Section
4's horizontal axis rotates to vertical below 1024px and drops its axis labels to
the leading edge; it must not become a horizontal scroll, because a time axis the
reader can only see a third of at a time is worse than a stack. Section 5's table
scrolls horizontally.

**CMS fields:** `TrainingHowItWorksContent`: `eyebrow`, `title`, `description`,
`heroImage`, `process: TrainingProcessStep[]` (`number`, `title`, `description`),
`timeline: TrainingTimelineItem[]` (`label`, `title`, `description`),
`checklist: string[]`, `nextSteps`, `heroAsideEyebrow`, `heroAsideText`, and the
`processSection*`, `timelineSection*`, `prepareSection*` triples.

---

## A12. Editorial catalogue

**Routes:** `/apply-for-training/courses`, `/programs`, `/programs/[category]`
**Story job:** Let a reader compare courses and pick one. A catalogue is a
comparison surface, not a gallery, so the reader must be able to scan a single
attribute down the whole set.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Wide plate**, `cinema`, of a session in progress | `label` + `tight` | `paper` |
| 2 | What is on offer | Highlights as `LabelPills`, no media of their own, sitting under section 1's plate | `label` | `paper` |
| 3 | The catalogue | **Data table** at ≥1024px: course, level, duration, format, next start, fee: with a **wide plate** thumbnail in the leading cell | `label` per cell | `paper` |
| 4 | Featured course | **Overlapping composition** on the one course the CMS marks featured | `medium` | `tint` |
| 5 | Next cohorts | **Data table**, cohorts rather than courses | `label` per cell | `paper` |
| 6 | How enrolment works | **Process spine** | `tight` per step | `mist` |
| 7 | Apply | One `primary` action | `tight` | `deep` |

**Anti-pattern it prevents:** the twenty-card grid where every card has a
different-length description and the reader cannot compare anything. Section 3 is
a table with a thumbnail column, which keeps the photography and gains the
comparison. Section 4 exists so the page still has one editorial moment.

**Rhythm rule:** sections 3 and 5 are both tables and are separated by section 4,
the page's only overlapping composition. They also carry different subjects
(courses versus cohorts) and different column sets. Nothing else on the page is
tabular.

**Mobile collapse:** section 3's table scrolls horizontally inside its own
container with the course-name column sticky and the thumbnail column dropped
below 640px: a 48px thumbnail is not photography, it is noise. It does **not**
become a card stack. Section 4 de-overlaps.

**Routing note.** `/programs/[category]` previously rendered the whole catalogue
for any unmatched category, so the catalogue was indexable at unlimited URLs. It
now calls `notFound()` on a miss (`app/(public)/programs/[category]/page.tsx:31`),
which closes that hole but leaves it a second listing surface. `/programs` itself
is still open in `routing-decisions.md`: canonical alias, or permanent redirect to
`/apply-for-training/courses`. **Build this archetype once, for
`/apply-for-training/courses`**, and let the surviving `/programs/*` routes render
the same template rather than a second design.

**CMS fields:** `TrainingCatalogContent`: `eyebrow`, `title`, `description`,
`heroImage`, `highlights: string[]`, `cohorts: TrainingCohort[]`,
`process: TrainingProcessStep[]`, `cohortsSection*`, `processSection*`. Course
records come from the live API as `Course` and are merged over
`SitePage.courses`. Every course image routes through `resolveImageSrc()`, because
the API returns arbitrary hosts.

---

## A13. Course detail

**Routes:** `/apply-for-training/courses/[slug]` (canonical),
`/programs/[category]/[courseId]`, `/programs/course/[courseSlug]`
**Story job:** Answer one question, should I take this course, with the
curriculum, the commitment, the cost and the outcome, in that order.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Wide plate** with the course facts as a **data table** beneath it, not overlaid | `label` + `tight` | `paper` |
| 2 | What you will build | `text-major` beside a **filmstrip** of learner output | `full` | `paper` |
| 3 | Curriculum | **Data table**: module against duration and output | `label` per cell | `tint` |
| 4 | Who teaches it | **Portrait panel**, one or two instructors | `label` + `tight` | `paper` |
| 5 | Commitment and cost | **Statistic with negative space**, two figures: duration and fee | `label` + `tight` | `paper` |
| 6 | What happens after | **Counter capsule** carrying the progression figure, with its provenance | `tight` | `deep` |
| 7 | Apply | One `primary` action | `tight` | `deep` |

**Anti-pattern it prevents:** the course page that is a hero image, a long prose
blob and a price at the bottom. Sections 1, 3 and 5 put the facts a reader is
actually deciding on into scannable form and put them early.

**Rhythm rule:** three tabular sections (1, 3, and the facts strip) would be the
page's failure mode. Section 1's facts are a compact four-cell strip, section 3 is
a full table, and section 5 is not a table at all but two figures in negative
space. Sections 6 and 7 are both `deep` and adjacent, so they are rendered as one
band with an internal rule rather than as two stacked dark sections.

**Mobile collapse:** section 1's fact strip goes two-up. Section 2's filmstrip
stays a scroll row with its text above it. Section 3's table scrolls horizontally
with the module column sticky. Section 4 goes one-up.

**Missing-instructor rule:** `CourseInstructor` has no photo guarantee. With none,
`MediaFallback variant="monogram"` at `4/5`. Never a stock portrait for a named
instructor.

**Routing status.** Resolved in the working tree. All three routes rendered
`CourseDetailCard` from an identical prop shape, and `/programs/[category]/[courseId]`
never read `params.category`, so one course was reachable at unlimited URLs. The
two duplicate page files are now deleted and `next.config.mjs:62,67` redirects both
shapes permanently to the canonical route. **This archetype is built once, at
`/apply-for-training/courses/[slug]`.**

**CMS fields:** `Course`: `title`, `slug`, `description`, `category:
CourseCategory`, `pricing: CoursePricing`, `instructor: CourseInstructor`, plus
the live-API fields. Hub copy comes from `SitePage.courses` and
`TrainingCatalogContent` as fallback, in the order `getCourseBySlugMixed` defines.

---

## A14. Offer index

**Routes:** `/for-organisations`, `/partner-with-us`
**Story job:** Tell an institutional reader what this organisation can do with
them, and route them to the right track. The audience is a decision-maker with a
budget, not a learner.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Full-bleed band**, `short`, of a workplace collaboration | `label` + `medium` | `deep` |
| 2 | The proposition | `text-offset` beside a **video frame** where `overviewVideoUrl` is set, otherwise an **image cluster** | `full` | `paper` |
| 3 | What we bring | Value cards as **wide plates** on a two-step rotation | `medium` per card | `paper` |
| 4 | The tracks | **Data table**: track, who it suits, what it involves, typical timeframe: each row linking to A15 | `label` per cell | `tint` |
| 5 | Track detail preview | **Split capsule** (§4.4.6): ITFYG on one lens, the partner type on the other | `tight` | `paper` |
| 6 | Figures | **Statistic with negative space** | `label` + `tight` | `paper` |
| 7 | Talk to us | One `primary` action, contact email visible as text | `tight` | `deep` |

`/for-organisations` renders `valueCards` and `engagementCards`;
`/partner-with-us` renders `valueCards` and `partnerTypeCards`. Same slots,
different field names.

**Anti-pattern it prevents:** the B2B page that is four abstract value
propositions in icon cards with no evidence and no route. Section 4 turns the
tracks into something a reader can compare, and section 6 puts a figure against
the claim.

**Rhythm rule:** section 5 is the only split capsule on the site outside A15, and
these two archetypes are the only ones that use it, so a reader who sees a
two-lobe capsule knows they are in institutional territory. Sections 3 and 5 are
both plate-scale and are separated by the table.

**Mobile collapse:** the split capsule cannot hold two lenses at a narrow width;
below 820px it becomes two stacked column capsules sharing one caption, which
preserves the two-party meaning. Section 4's table scrolls horizontally with the
track column sticky.

**CMS fields:** `OrganisationOverviewContent` / `PartnershipOverviewContent`:
`eyebrow`, `title`, `description`, `heroImage`, `stats`,
`valueCards: {title, description, image?, imageAlt?}[]`,
`engagementCards` / `partnerTypeCards`, `nextSteps: RouteCard[]`,
`overviewVideoUrl`, `overviewVideoTitle`, and the `overviewSection*`,
`servicesSection*` / `tracksSection*`, `engagementSection*` /
`partnerTypesSection*`, `nextStepsSection*` triples.

---

## A15. Offer detail

**Routes:** `/for-organisations/[slug]`: `corporate-training`, `sponsorships`,
`hire-graduates`, `staff-volunteering` · `/partner-with-us/[slug]`:
`educational`, `government`, `ngo-foundations`, `international-development`,
`technology`
**Story job:** One track, argued to the point of an enquiry. The reader already
knows they are interested; this page removes the remaining unknowns.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Leading-lobe capsule** with the track's tagline | `label` + `medium` | `mist` |
| 2 | Snapshot | Four figures as a compact **data table**, not cards | `label` per cell | `paper` |
| 3 | What it covers | Focus cards as **wide plate** + `PanelList` on a two-step rotation | `full` per card | `paper` |
| 4 | How it works | **Process spine** | `tight` per step | `tint` |
| 5 | What it looked like | **Overlapping composition** per case study or scenario, at most two | `medium` | `paper` |
| 6 | Packages | **Data table**: package, price, what is included, note. `/partner-with-us` has no packages and drops this section | `label` per cell | `paper` |
| 7 | Questions | FAQ as `<details>` pairs, question at `--type-subhead`, no accordion animation | `medium` per answer | `mist` |
| 8 | Enquire | One `primary` action plus the contact email as text | `tight` | `deep` |
| 9 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** the service page whose "what's included" is a
bulleted list inside a card, repeated four times. `OrganisationServiceCard.bullets`
and `PartnershipFocusCard.bullets` render as `PanelList` beside a plate in section
3, and `OrganisationPackage.features` renders as table cells in section 6.

**Rhythm rule:** sections 3, 5 and 6 all present sets, and each uses a different
form: plates with panels, then compositions, then a table. Section 7's `<details>`
elements are the only collapsed content on the site and are open by default at
`min-width: 1024px`, because hiding an answer behind a click on a desktop page
with room to show it is a pattern borrowed from mobile.

**Mobile collapse:** the capsule becomes a column capsule. Section 3 stacks plate
then panels, in one wrapper. Section 5 de-overlaps. Sections 2 and 6's tables
scroll horizontally with the first column sticky. Section 7's `<details>` are
closed by default below 1024px.

**CMS fields:** `OrganisationServicePage` / `PartnershipTrackPage`: `slug`,
`eyebrow`, `title`, `description`, `tagline`, `heroImage`, `stats`,
`overviewCards` / `focusCards` (each with `title`, `description`, `image`,
`imageAlt`, `bullets`; `icon` and `iconImage` retained, never rendered),
`howItWorks`, `caseStudies` / `scenarios` (`title`, `organisationType` /
`partnerType`, `summary`, `outcome`, `highlight`), `packages: OrganisationPackage[]`
(organisations only), `faqs`, `contactCta`, `related`, and the full set of
`*Section*` copy fields.

---

## A16. Data story

**Routes:** `/our-impact`
**Story job:** Make the case with evidence. This is the page a funder reads, and
it is the one archetype where **the capsule is wrong throughout**: a signature
silhouette around a number reads as branding, and the whole point of this page is
that the numbers are not branding.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Statistic with negative space** at full page width, one figure, the headline as its label | `label` + `tight` | `paper` |
| 2 | The figures | Four **statistic-with-negative-space** blocks in a divided row, each with its provenance sentence | `label` + `tight` | `paper` |
| 3 | What we measure | Measurement cards as **wide plate** + `PanelList`, three-step rotation | `full` per card | `tint` |
| 4 | How we know | **Video frame** or **document plate** beside `text-narrow` on methodology | `full` | `paper` |
| 5 | One life | **Overlapping composition** with an attributed quote | `medium` | `paper` |
| 6 | Proof points | `PanelList`, two columns, beside a **circular crop** | `medium` per panel | `paper` |
| 7 | Where the detail is | `RouteCardGrid` to reports, testimonials and SDGs | `tight` | `mist` |

**Anti-pattern it prevents:** the impact page that is four big numbers in coloured
tiles above a stock photograph of smiling students. Section 2's figures each carry
a provenance sentence, and section 4 shows the method rather than asserting it.

**Figure integrity, stated as a hard rule:** the values in the repository are the
values. `3000+`, `8500+`, `40%` and `85%` at `lib/content/site-config.ts:249–271`
are rendered as stored. **No rounding to fit a layout, no deriving a fifth figure
from the other four, no recombining a per-initiative figure into an organisation
total.** If a value does not fit the slot, the slot changes.

**Rhythm rule:** sections 1 and 2 are both statistic treatments and are adjacent,
which is permitted once: section 1 is one figure at page width and section 2 is
four in a divided row, so the scale change carries the break. Nothing after
section 2 is a bare figure. Section 5 is the page's only person, deliberately,
because one named story after six sections of aggregate data is what stops the
page reading as a spreadsheet.

**Mobile collapse:** section 2's divided row becomes a single column with the
dividers switching from vertical to horizontal, each label staying with its
figure. Section 3 stacks plate then panels per card. Section 5 de-overlaps.

**CMS fields:** `ImpactOverviewContent`: `eyebrow`, `title`, `description`,
`heroImage`, `image`, `imageAlt`, `stats: HighlightStat[]`,
`measurementCards: ImpactEvidenceCard[]` (`title`, `description`, `image`,
`imageAlt`, `bullets`), `proofPoints: string[]`, `routeCards`, and the
`snapshotSection*`, `measurementSection*`, `routesSection*` triples.

---

## A17. Publication library

**Routes:** `/our-impact/reports`
**Story job:** Let a reader find, judge and download a specific document. The
artefacts are the content, so the artefacts are the visual.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Document plate** trio, the three most recent covers, overlapping slightly | `label` + `tight` | `paper` |
| 2 | The library | **Document plate** grid, one per report, `1/1.414`, each with year, title and file label | `label` + `tight` | `paper` |
| 3 | What is in them | Highlights per report as a **data table**: report against its highlight lines | `label` per cell | `tint` |
| 4 | Reading the evidence | **Video frame** where `methodVideoUrl` is set, beside methodology as `PanelList` | `full` | `paper` |
| 5 | Evidence cards | **Wide plate** + `PanelList`, two-step rotation | `full` per card | `paper` |
| 6 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** the reports page that is a bulleted list of PDF
links. A report has a cover, a year and a shape, and a `1/1.414` plate shows all
three. Cropping a cover to `16/9` cuts its title off and is why the document plate
ratio exists (`design-system.md` §5.10).

**Missing-cover rule:** a report with no cover image renders `MediaFallback
variant="wordmark"` carrying the report title at the same `1/1.414` proportions.
That is a more honest library entry than a generic PDF glyph, and it is the only
permitted empty state.

**Rhythm rule:** sections 1 and 2 are both document plates and are adjacent, which
is permitted once and only here: the subject of the page is a set of documents, and
section 1 is three overlapping at large scale while section 2 is a flat grid at
small scale. Nothing after section 2 uses a document plate. Sections 4 and 5 are
separated by their media kind, video against photography.

**Mobile collapse:** section 1's overlap is removed and the three plates go
three-up at reduced size. Section 2 goes two-up at every width below 1024px,
including below 640px, because a report cover at 40vw is still legible and a
column of full-width A4 pages scrolls forever. Section 3's table scrolls
horizontally with the report column sticky.

**Download honesty:** each entry states its `fileLabel` as visible text next to the
link, so a reader knows the format and size before clicking. The link is a real
`<a href>` to `ImpactReportResource.href`, never a script-driven download.

**CMS fields:** `ImpactReportsContent`: `eyebrow`, `title`, `description`,
`heroImage`, `stats`, `reportResources: ImpactReportResource[]` (`year`, `title`,
`summary`, `href`, `fileLabel`, `highlights`), `evidenceCards`,
`methodologyPoints`, `methodVideoUrl`, `methodVideoTitle`, `related`, and the
`reportsSection*`, `methodSection*`, `nextStepsSection*` triples.

---

## A18. Impact framework

**Routes:** `/our-impact/sdgs`
**Story job:** Show how the organisation's work maps onto an external framework.
The content is a **mapping**, so the visual is a mapping, not a card grid.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Wide plate**, `cinema` | `label` + `medium` | `paper` |
| 2 | The alignment | **Diagram**: goals on one axis, ITFYG routes on the other, connections drawn where `linkedRoutes` is non-empty | `label` per node | `tint` |
| 3 | Each goal | Per goal: the goal number at `--type-stat-sm`, title, summary, and `contributions` as `PanelList`, with a **circular crop** where the goal has photography | `medium` per goal | `paper` |
| 4 | Principles | `PanelList` beside a **video frame** where `principlesVideoUrl` is set, otherwise an **image cluster** | `full` | `paper` |
| 5 | Figures | **Statistic with negative space** | `label` + `tight` | `paper` |
| 6 | Routes onward | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** seventeen coloured tiles with the official SDG icons.
`ImpactSdgGoal.icon` and `iconImage` exist in the model and are never rendered;
the goal number set as type carries the identification without importing a
third-party icon set into a site that has banned icons.

**Rhythm rule:** section 2 is the page's only diagram and section 3 is its only
repeated per-item block. Section 3's items are peers and use one treatment, which
is permitted for the same reason as A3's portrait grid: they genuinely are peers
and varying them would imply a ranking of development goals. The circular crop is
present only for goals that have photography, so the section is deliberately
uneven rather than padded.

**Mobile collapse:** the diagram's connecting lines are dropped below 1024px and
it becomes, per goal, the goal number followed by its linked routes as
`LabelPills`: the mapping survives as adjacency instead of as lines. Section 3
goes one-up with each circular crop above its own text.

**CMS fields:** `ImpactSdgsContent`: `eyebrow`, `title`, `description`,
`heroImage`, `stats`, `goals: ImpactSdgGoal[]` (`goal`, `title`, `summary`,
`contributions: string[]`, `linkedRoutes: RouteCard[]`),
`alignmentPrinciples: string[]`, `principlesVideoUrl`, `principlesVideoTitle`,
`related`, and the `goalsSection*`, `principlesSection*` triples.

---

## A19. Editorial index

**Routes:** `/news-and-updates`, `/news-and-updates/[category]` (`news`, `blogs`)
**Story job:** Present published writing so a reader can find the piece worth
their time. The hub is the category index plus two sections; news and blogs are
the same index with different weighting.

| # | Section | Media treatment | Density | Ground | Scope |
| --- | --- | --- | --- | --- | --- |
| 1 | Masthead | **Full-bleed band**, `short` | `label` + `tight` | `deep` | both |
| 2 | The lead | **Overlapping composition** on the featured article, headline at `--type-display` | `tight` excerpt | `paper` | both |
| 3 | Editorial pillars | **Wide plate** + `PanelList` per pillar, three-step rotation | `full` per pillar | `paper` | hub only |
| 4 | Browse | `RouteCardGrid` to the two categories | `tight` | `mist` | hub only |
| 5 | The archive | Article grid: **wide plate** `16/9` per item, three-up, uneven baselines via a 24px offset on every second item | `label` date, `tight` excerpt | `paper` | both |
| 6 | Topics | Tags as `LabelPills` beside a **circular crop** | `label` | `paper` | both |
| 7 | Subscribe | Newsletter form beside a **statistic with negative space** carrying the publication cadence | `tight` | `deep` | both |

`news` weights section 5 by `publishedAt` descending and shows the date
prominently. `blogs` weights section 2 more heavily (the argument matters more
than the recency) and shows `readTimeMinutes` in place of the date.

**Anti-pattern it prevents:** the blog index that is twelve identical cards with
the same excerpt length and a "Read more" on each. Section 2 gives one piece real
scale, and section 5's alternating offset plus variable excerpt length stops the
grid reading as a table of rows.

**Rhythm rule:** sections 2 and 5 both present articles and are separated by
sections 3 and 4 on the hub. On the category route, where 3 and 4 are absent,
sections 2 and 5 are adjacent and are differentiated by scale: one composition at
`text-major` width against a three-up grid. Section 6's circular crop is the
page's only circle.

**Mobile collapse:** section 2 de-overlaps. Section 5 goes two-up at 640–1023px
and one-up below, each excerpt inside the same wrapper as its plate, offsets
dropped below 1024px. Section 7 stacks the form above the figure.

**Missing-cover rule:** an article with no `coverImage` renders `MediaFallback
variant="wordmark"` carrying the article title at `16/9`. It is never given a
generic stock image, because a stock image on a news item implies a photograph
was taken.

**CMS fields:** `NewsHubContent`: `eyebrow`, `title`, `description`, `heroImage`,
`stats`, `editorialPillars: ContentBlock[]`, `routeCards`, `heroCtas`, and the
`featuredSection*`, `browseSection*`, `editorialSection*`, `latestSection*`,
`subscribeSection*` triples. `ArticleCategoryContent`: `category`, `eyebrow`,
`title`, `description`, `heroImage`, `emptyState`, `heroCtaLabel`, and the
`leadSection*`, `archiveSection*`, `topicsSection*` triples plus
`latestSignalEyebrow` and `latestSignalCtaLabel`. Articles are `ArticleSeed[]`
filtered to `status: "published"`.

---

## A20. Long-form article

**Routes:** `/news-and-updates/[category]/[slug]`
**Story job:** Sustain reading. Everything on this page serves the sentence the
reader is currently on. **The capsule is wrong here throughout**: a signature
silhouette beside 1,200 words is a decoration on an essay.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Masthead | **Wide plate**, `cinema`, full bleed to `--measure-full`, headline at `--type-display` below it in `text-offset` | `label` + `tight` | `paper` |
| 2 | Byline and metadata | Rail: author, role, date, read time. No avatar unless `ArticleAuthor.avatar` is a real portrait | `label` | `paper` |
| 3 | Body | `--type-body-long` in `text-major`, measure 66ch, with the annotation rail carrying pull quotes and figure captions | `long` | `paper` |
| 4 | In-body media | **Wide plate**, **image cluster** or **filmstrip**, inserted at editor-placed points, each with its caption in the rail | `label` caption | `paper` |
| 5 | Pull quote | `--type-headline` in `text-offset`, accent rule at the leading edge, no quotation-mark graphic | `tight` | `paper` |
| 6 | Tags | `LabelPills` | `label` | `paper` |
| 7 | Read next | Three articles as **wide plates** with headlines, no excerpts | `label` | `mist` |

**Anti-pattern it prevents:** the article page that is 1,200 words in a narrow
column with no visual relationship to anything and a sidebar of unrelated widgets.
The rail is the fix: it holds the captions, the pull quotes and the byline at the
page's leading edge, so the reading column stays clean and the page still has
structure.

**The prose exception, stated explicitly:** `contentHtml` from the CMS may contain
`<ul>` and `<ol>`. The no-bullet-list rule governs **rendered page furniture that
this design system controls**: CMS array fields rendered as dot-and-line lists.
It does not govern an author's own prose inside a published article, where a list
may be the correct thing the author wrote. `.article-prose ul` and
`.article-prose ol` in `app/globals.css` stay, and `design-rules.test.ts` must not
be extended to cover article body rendering. This is the one exception on the
site and it is deliberate.

**Rhythm rule:** in-body media may not appear twice within 300 words, and two
consecutive in-body media must not share a treatment. Section 7's three plates are
identical by design and are the page's only repeated treatment, placed after the
article ends.

**Mobile collapse:** the rail collapses and every caption moves inside its own
`<figure>`, directly beneath its image. Pull quotes move inline into the reading
column at `--type-subhead` rather than `--type-headline`, because a headline-sized
pull quote at 360px eats the screen. The byline moves above the body. Measure
stays governed by the role, so the column simply gets narrower with the viewport.

**CMS fields:** `ArticleSeed`: `slug`, `category`, `status`, `type`, `title`,
`excerpt`, `publishedAt`, `updatedAt`, `coverImage`, `coverAlt`, `tags`,
`author: ArticleAuthor` (`name`, `role`, `avatar`), `featured`, `seo: ArticleSeo`
(`title`, `description`, `ogImage`), `readTimeMinutes`, `content: string[]`,
`contentHtml`. Stored HTML is untrusted and is sanitised before storage and before
rendering; that is a security requirement, not a design one, and it is not
relaxed by anything in this document.

---

## A21. Human connection

**Routes:** `/contact`
**Story job:** Get a message to the right person, and set an honest expectation
about the reply. The form is the content; everything else supports it.

| # | Section | Media treatment | Density | Ground |
| --- | --- | --- | --- | --- |
| 1 | Hero | **Wide plate**, `cinema`, of the actual space, not a stock call centre | `label` + `tight` | `paper` |
| 2 | Channels | **Data table**: channel, value, what it is for: with real `tel:` and `mailto:` links | `label` per cell | `paper` |
| 3 | The form | `text-narrow` form at `--measure-narrow`, enquiry type as a real `<select>` or radio group, never a card grid | `medium` | `paper` |
| 4 | What happens next | **Process spine** from `responseSteps` | `tight` per step | `tint` |
| 5 | Response figures | **Statistic with negative space**: the stated response window and working days | `label` + `tight` | `paper` |
| 6 | Where else to go | `RouteCardGrid` | `tight` | `mist` |

**Anti-pattern it prevents:** the contact page that is a full-width map iframe, a
form with placeholder-only labels, and no statement of when anyone will reply.
Section 5 exists because an unanswered expectation is the actual failure of most
contact pages.

**Rhythm rule:** the page has one photograph (section 1) and everything after it is
a non-photographic content-bearing form: table, form, spine, figures, cards. That
is correct: a contact page padded with stock imagery reads as evasive. Section 1
carries the pairing law for the page's opening and nothing else needs a picture.

**Mobile collapse:** section 2's table scrolls horizontally with the channel
column sticky; every `tel:` and `mailto:` stays a real link at 48px minimum
target. Section 3's form is single-column at every width, which it already should
be. Section 4's spine is already vertical.

**Form requirements** (product requirements, not polish): every control has a
visible `<label>` bound with `htmlFor`; errors carry `aria-invalid` and
`aria-describedby` and are never colour-only; the submit state is announced with
`aria-live="polite"`; input borders clear 3:1 per `design-system.md` §7.5, which
means they may not use `brand-border` at 1.28:1. The privacy note is visible
before submission, not after.

**CMS fields:** `ContactPageContent`: `eyebrow`, `title`, `description`,
`heroImage`, `stats`, `channels: ContactChannel[]` (`label`, `value`,
`description`, `href`), `enquiryOptions: ContactEnquiryOption[]` (`value`,
`label`, `description`), `responseSteps: ContactResponseStep[]`, `routeCards`,
`privacyNote`, and the `channels*`, `form*`, `message*`, `routes*` copy fields.

---

## Route coverage

All 32 public routes under `app/(public)/`, each assigned to exactly one
archetype.

| # | Route | Archetype |
| --- | --- | --- |
| 1 | `/` | A1 Magazine cover |
| 2 | `/who-we-are` | A2 Organisation profile |
| 3 | `/who-we-are/[slug]` | A2 Organisation profile (reduced) |
| 4 | `/who-we-are/team` | A3 Portrait editorial |
| 5 | `/our-impact/testimonials` | A3 Portrait editorial (`voices` mode) |
| 6 | `/departments` | A4 Named-entity index (`unit`) |
| 7 | `/who-we-are/partners` | A4 Named-entity index (`organisation`) |
| 8 | `/who-we-are/careers` | A5 Invitation (`labour`) |
| 9 | `/donate` | A5 Invitation (`money`) |
| 10 | `/departments/[slug]` | A6 Department feature |
| 11 | `/what-we-do` | A7 Programme portfolio |
| 12 | `/what-we-do/[slug]` | A8 Programme journey (8 concepts) |
| 13 | `/apply-for-training` | A9 Recruitment landing |
| 14 | `/apply-for-training/who-can-apply` | A10 Eligibility guide |
| 15 | `/apply-for-training/how-it-works` | A11 Pathway |
| 16 | `/apply-for-training/courses` | A12 Editorial catalogue (canonical) |
| 17 | `/programs` | A12 Editorial catalogue (routing decision pending) |
| 18 | `/programs/[category]` | A12 Editorial catalogue (now 404s on an unknown category) |
| 19 | `/apply-for-training/courses/[slug]` | A13 Course detail (canonical) |
| 20 | `/programs/[category]/[courseId]` | RETIRED. Deleted; 301 to route 19 |
| 21 | `/programs/course/[courseSlug]` | RETIRED. Deleted; 301 to route 19 |
| 22 | `/for-organisations` | A14 Offer index |
| 23 | `/partner-with-us` | A14 Offer index |
| 24 | `/for-organisations/[slug]` | A15 Offer detail |
| 25 | `/partner-with-us/[slug]` | A15 Offer detail |
| 26 | `/our-impact` | A16 Data story |
| 27 | `/our-impact/reports` | A17 Publication library |
| 28 | `/our-impact/sdgs` | A18 Impact framework |
| 29 | `/news-and-updates` | A19 Editorial index (`hub`) |
| 30 | `/news-and-updates/[category]` | A19 Editorial index (`category`) |
| 31 | `/news-and-updates/[category]/[slug]` | A20 Long-form article |
| 32 | `/contact` | A21 Human connection |

**Build count.** 21 archetypes, **21 templates**, **30 live routes**. A12 and A13
are each built once: the two retired `/programs/*` detail shapes redirect into A13,
and `/programs` plus `/programs/[category]` render A12's template rather than a
second design. A8 is one spine with eight concept variations, which is one template
plus eight configurations, not eight templates.

## Where the capsule is deliberately absent

Recorded so its absence reads as a decision rather than an omission:

| Archetype | Why |
| --- | --- |
| A16 Data story | A signature silhouette around a number turns evidence into branding, which is the opposite of the page's job |
| A17 Publication library | The subject is documents; a circular crop of a report cover destroys it |
| A18 Impact framework | The content is a mapping between two sets; a capsule holds one thing |
| A20 Long-form article | A capsule beside 1,200 words is a decoration on an essay |
| A21 Human connection | The form is the content; a capsule above it competes with the only thing that matters |
| A12 Editorial catalogue | A catalogue is a comparison; the capsule has one column |
| A10 Eligibility guide | Conditions are unordered peers; the capsule claims one matters most |

Seven of twenty-one archetypes use no capsule at all. That is the intended ratio.

## Open decisions this document depends on

1. **The palette conflict** (`design-system.md` §2.4). Every colour named here
   assumes Option C. Under Option A, drop the gold and teal roles; the treatments
   are unchanged. Under Option B, every colour changes and the CMS `accent` and
   `overlayFrom`/`overlayTo` values need a data migration.
2. **`/who-we-are/partners` content model** (A4). There is no per-partner story
   data. Either extend the `Partner` record or accept the route as an index.
3. **`/programs`** (A12). Canonical alias or permanent redirect, per
   `routing-decisions.md`. This is a product question about whether "Programs
   Portal" is a deliberate external entry point. The two duplicate course-detail
   shapes are already resolved; only the listing route is open.
