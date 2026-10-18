# CMS reconciliation for the media-led redesign

Status: Current (audit). Repository identity verified: `new_site` @ `37db40a`.
Scope: audit only. No code was changed to produce this document.
Authority note: `docs/design_iu_examples/*.html` and `.superdesign/` are legacy and were not consulted.

Method: every field reference below was read out of the checked-out working tree. Claims are
labelled Verified (read in source) or Inferred (deduced from a pattern, not directly observed).

## 1. Field inventory per content domain

All line numbers are `types/content.ts` unless a different file is named. Verified: each entry
was read in the checked-out tree.

### 1.1 Primitives shared by every domain

| Type | Media / config fields | Line |
| --- | --- | --- |
| `HighlightStat` | `icon`, `iconImage` | :19, :21 |
| `RouteCard` | `image`, `imageAlt` | :29, :30 |
| `ContentBlock` | `image`, `imageAlt`, `videoUrl`, `videoTitle` | :44, :45, :46, :47 |

`RouteCard` and `ContentBlock` are the two highest-traffic shapes in the codebase. Every hub page
renders `related: RouteCard[]`, and `ContentPage` renders `sections: ContentBlock[]` as its entire
editorial body. Their media fields are the ones the redesign depends on most and the ones with the
weakest editor coverage (section 3).

### 1.2 SitePage family

| Type | Media / config fields | Line |
| --- | --- | --- |
| `SitePage` | `heroImage` | :57 |
| `SitePage` | `heroImageAlt` | :63 |
| `SitePage` | `heroVideoUrl` | :65 |
| `SitePage` | `heroVideoThumbnail` | :67 |
| `SitePage` | `overviewVideoUrl`, `overviewVideoTitle` | :69, :70 |
| `SitePage` | `principlesImage`, `principlesImageAlt` | :89, :90 |
| `SitePage` | `stats: HighlightStat[]`, `sections: ContentBlock[]`, `related: RouteCard[]` | :71, :72, :74 |
| `DynamicSitePage` | inherits all of the above, adds `status`, `order` | :105-:110 |
| `InitiativePage` | `accent` | :393 |
| `InitiativePage` | `heroImage` (required), `overviewImage` (required) | :395, :396 |
| `InitiativePage` | `gallery: InitiativeGalleryImage[]` | :402 |
| `InitiativePage` | `testimonials: InitiativeTestimonial[]` | :403 |
| `InitiativePage` | `partners: InitiativePartner[]` | :404 |
| `InitiativeProcessStep` | `icon`, `iconImage` | :310, :312 |
| `InitiativeGalleryImage` | `src`, `alt` | :322, :323 |
| `InitiativeTestimonial` | `avatar` | :330 |
| `InitiativePartner` | `logo` | :337 |
| `InitiativeSectionContent` | `overviewImageAlt` | :355 |

`InitiativePage extends SitePage`, so every initiative also carries `heroImageAlt`, `heroVideoUrl`,
`heroVideoThumbnail`, `sections`, `related`.

### 1.3 Homepage

The homepage content types are split: some live in `types/content.ts`, some are owned by the
components that render them and imported backwards by `lib/cms/homepage.ts:20-30`. That import
direction is a dependency inversion under constitution section 14 and is called out in section 5.

| Type | Media / config fields | File:line |
| --- | --- | --- |
| `HeroSlide` | `image` | types/content.ts:206 |
| `HeroSlide` | `overlayFrom`, `overlayTo` | types/content.ts:212, :213 |
| `HeroSlide` | `accent` | types/content.ts:220 |
| `HeroSlide` | `mediaCaption` | types/content.ts:223 |
| `DonationCampaignContent` | `image` | types/content.ts:249 |
| `JoinCtaCard` | `icon` (audience key, no longer selects an icon), `image`, `imageAlt` | types/content.ts:274, :281, :282 |
| `HomepageSection` | `variant: "light" \| "navy" \| "gold"` | types/content.ts:301 |
| `ChallengeSectionContent` | `image`, `imageAlt`, `videoUrl`, `videoTitle` | components/home/legacy-homepage-sections.tsx:11, :12, :22, :23 |
| `MissionSectionContent` | `image`, `imageAlt`, `imageLabel`, `imageCaption`, `videoUrl`, `videoTitle` | components/home/legacy-homepage-sections.tsx:31-34, :40, :41 |
| `OverviewSectionContent` | `image`, `imageAlt`, `imageLabel`, `imageCaption`, `videoUrl`, `videoTitle` | components/home/legacy-homepage-sections.tsx:53-56, :59, :60 |
| `ProgrammeShowcaseItem` | `image`, `accent`, `icon` | components/home/programme-showcase.tsx:12, :13, :14 |
| `FeaturedStoryContent` | `backgroundImage`, `videoUrl` | components/home/featured-story-video.tsx:17, :18 |
| `FloatingElementsContent` | `exitIntent.image` | components/layout/floating-elements.tsx:28 |

`HomepageSection` (types/content.ts:296) has no consumer. `grep -rn "HomepageSection"` returns only
its own declaration plus the unrelated `AdminHomepageSectionConfig` in `types/admin.ts:111`. The
homepage renders `components/home/homepage-sections.tsx`, which does not use it. Verified: this type
is dead and its `variant` discriminator is not a precedent to build on.

### 1.4 Articles and news

| Type | Media / config fields | Line |
| --- | --- | --- |
| `ArticleAuthor` | `avatar` | :420 |
| `ArticleSeo` | `ogImage` | :426 |
| `ArticleSeed` | `coverImage`, `coverAlt` | :439, :440 |
| `ArticleSeed` | `featured`, `type: ArticleDisplayType` | :443, :434 |
| `NewsHubContent` | `heroImage`, `editorialPillars: ContentBlock[]`, `routeCards: RouteCard[]` | :454, :456, :457 |
| `ArticleCategoryContent` | `heroImage` | :482 |

`coverAlt` is the only alt-text field in the article model and it is correctly paired. `ogImage` and
`avatar` carry no alt, which is correct: an OG image is not rendered inline and an author avatar is
decorative next to a visible name.

### 1.5 Training

| Type | Media / config fields | Line |
| --- | --- | --- |
| `TrainingProcessStep` | `icon`, `iconImage` | :526, :527 |
| `TrainingLandingContent` | `heroImage`, `routeCards: RouteCard[]` | :546, :548 |
| `TrainingCatalogContent` | `heroImage` | :559 |
| `TrainingEligibilityContent` | `heroImage`, `nextSteps: RouteCard[]` | :576, :579 |
| `TrainingHowItWorksContent` | `heroImage`, `nextSteps: RouteCard[]` | :598, :602 |
| `TrainingFocusCard`, `TrainingAudienceCard`, `TrainingTimelineItem`, `TrainingCohort` | none | :498, :530, :536, :503 |

Training is the thinnest domain in the model. Four page types carry a single `heroImage` each and
nothing else. Every card and timeline shape is text-only.

### 1.6 Organisations

| Type | Media / config fields | Line |
| --- | --- | --- |
| `OrganisationServiceCard` | `icon`, `iconImage`, `image`, `imageAlt` | :628, :630, :632, :633 |
| `OrganisationProcessStep` | `image`, `imageAlt`, `icon`, `iconImage` | :641, :642, :643, :645 |
| `OrganisationServicePage` | `heroImage`, `related: RouteCard[]` | :683, :693 |
| `OrganisationOverviewContent` | `heroImage`, `overviewVideoUrl`, `overviewVideoTitle`, `nextSteps: RouteCard[]` | :720, :723, :724, :727 |
| `OrganisationOverviewCard` | none | :620 |
| `OrganisationCaseStudy`, `OrganisationPackage`, `OrganisationFaq` | none | :648, :656, :664 |

### 1.7 Partnerships

| Type | Media / config fields | Line |
| --- | --- | --- |
| `PartnershipOverviewCard` | `image`, `imageAlt` | :746, :747 |
| `PartnershipFocusCard` | `icon`, `iconImage`, `image`, `imageAlt` | :753, :755, :757, :758 |
| `PartnershipProcessStep` | `icon`, `iconImage` | :766, :768 |
| `PartnershipTrackPage` | `image`, `imageAlt` (card-level), `heroImage` | :797, :798, :800 |
| `PartnershipTrackPage` | `overviewVideoUrl`, `overviewVideoTitle` | :828, :829 |
| `PartnershipOverviewContent` | `heroImage`, `overviewVideoUrl`, `overviewVideoTitle` | :836, :855, :856 |

### 1.8 What We Do overview

| Type | Media / config fields | Line |
| --- | --- | --- |
| `EcosystemCardContent` | `image`, `imageAlt` | :869, :870 |
| `WhatWeDoGalleryItem` | `type: "image" \| "video"`, `url`, `title`, `description`, `thumbnailUrl` | :889-:893 |
| `WhatWeDoOverviewContent` | `heroImage`, `galleryItems`, `nextSteps: RouteCard[]` | :900, :913, :921 |
| `PathwayCardContent` | `initiativeSlugs` (related content) | :885 |

`WhatWeDoGalleryItem` is the only type in the whole model with an explicit media-kind discriminator
and a video thumbnail beside it. It is the closest existing precedent for the layout enum proposed
in section 4.

### 1.9 Impact

| Type | Media / config fields | Line |
| --- | --- | --- |
| `ImpactEvidenceCard` | `icon`, `iconImage`, `image`, `imageAlt` | :927, :929, :931, :932 |
| `ImpactFeaturedStory` | `backgroundImage`, `videoUrl` | :953, :954 |
| `ImpactStory` | `image`, `format: "written" \| "video" \| "partner"` | :968, :969 |
| `ImpactSdgGoal` | `icon`, `iconImage`, `linkedRoutes: RouteCard[]` | :976, :978, :980 |
| `ImpactOverviewContent` | `image`, `imageAlt`, `heroImage` | :987, :988, :989 |
| `ImpactReportsContent` | `heroImage`, `methodVideoUrl`, `methodVideoTitle` | :1013, :1020, :1021 |
| `ImpactTestimonialsContent` | `heroImage`, `featuredStory` | :1045, :1046 |
| `ImpactSdgsContent` | `heroImage`, `principlesVideoUrl`, `principlesVideoTitle` | :1064, :1081, :1082 |
| `ImpactReportResource` | `href`, `fileLabel` (document, not image) | :941, :942 |

### 1.10 Contact, team, partners, testimonials, settings, jobs

| Type | Media / config fields | File:line |
| --- | --- | --- |
| `ContactPageContent` | `heroImage`, `routeCards: RouteCard[]` | types/content.ts:1125, :1130 |
| `ContactEnquiryOption` | `heroVideoUrl`, `heroVideoThumbnail` | types/content.ts:1108, :1109 |
| `TeamMemberProfile` | `photo` | types/content.ts:139 |
| `DepartmentProfile` | `heroImage`, `icon`, `iconImage`, `color`, `services: ContentBlock[]` | types/content.ts:175, :176, :178, :179, :181 |
| `JobListing` | `featured` only, no media | types/content.ts:118-129 |
| `CmsTestimonial` | `avatar` | lib/cms/testimonials.ts:43 |
| `CmsPartner` | `logo` | lib/cms/partners.ts:23 |
| `CmsPublicSettings` | `defaultOgImage`, `logoUrl` | lib/cms/settings.ts:14, :15 |

`ContactEnquiryOption.heroVideoUrl` / `heroVideoThumbnail` (types/content.ts:1107-1109) are declared
on the wrong type. An enquiry option is a radio-button choice in a form; it has no hero. Inference:
these were pasted onto the nearest interface instead of onto `ContactPageContent`. No renderer reads
them. They are dead fields.

## 2. Alt-text coverage

`types/content.ts:58-62` states the rule the model is supposed to follow: hero alt text describes
what is happening in the photograph and is not a restatement of the title. Exactly one type obeys
it. `SitePage.heroImageAlt` (:63) is the only hero alt field in the entire content model.

### 2.1 Media fields that have a paired alt field

Verified paired: `RouteCard.image`/`imageAlt` (:29-30), `ContentBlock.image`/`imageAlt` (:44-45),
`SitePage.heroImage`/`heroImageAlt` (:57, :63), `SitePage.principlesImage`/`principlesImageAlt`
(:89-90), `InitiativeGalleryImage.src`/`alt` (:322-323), `JoinCtaCard.image`/`imageAlt` (:281-282),
`ArticleSeed.coverImage`/`coverAlt` (:439-440), `OrganisationServiceCard` (:632-633),
`OrganisationProcessStep` (:641-642), `PartnershipOverviewCard` (:746-747), `PartnershipFocusCard`
(:757-758), `PartnershipTrackPage.image`/`imageAlt` (:797-798), `EcosystemCardContent` (:869-870),
`ImpactEvidenceCard` (:931-932), `ImpactOverviewContent.image`/`imageAlt` (:987-988), and the three
homepage narrative types in `components/home/legacy-homepage-sections.tsx` (:11-12, :31-32, :53-54).

`InitiativePage.overviewImage` (:396) is paired, but its alt lives on a different type:
`InitiativeSectionContent.overviewImageAlt` (:355). It works, and the admin form places both inputs
next to each other (`components/admin/what-we-do-forms.tsx:514, :517`), so this is a modelling
oddity rather than a defect.

### 2.2 Missing alt fields, accessibility defects

Thirteen live types declare a `heroImage` with no alt field of any kind:

| Type | `heroImage` line | What the renderer passes as alt | Renderer file:line |
| --- | --- | --- | --- |
| `DepartmentProfile` | :175 | `department.title` | components/departments/department-detail-page.tsx:27 |
| `NewsHubContent` | :454 | hardcoded `"IT For Youth Ghana news and updates"` | components/news/news-hub-page.tsx:41 |
| `ArticleCategoryContent` | :482 | template literal on the category label | components/news/news-listing-page.tsx:36 |
| `OrganisationServicePage` | :683 | `page.title` | components/organisations/organisation-service-page.tsx:41 |
| `OrganisationOverviewContent` | :720 | hardcoded string | components/organisations/for-organisations-overview-page.tsx:35 |
| `PartnershipTrackPage` | :800 | `page.title` | components/partnerships/partnership-track-page.tsx:30 |
| `PartnershipOverviewContent` | :836 | hardcoded string | components/partnerships/partner-with-us-overview-page.tsx:35 |
| `WhatWeDoOverviewContent` | :900 | hardcoded string | components/what-we-do/what-we-do-overview-page.tsx:52 |
| `ImpactOverviewContent` | :989 | hardcoded string | components/impact/impact-overview-page.tsx:30 |
| `ImpactReportsContent` | :1013 | hardcoded string | components/impact/impact-reports-page.tsx:24 |
| `ImpactTestimonialsContent` | :1045 | hardcoded string | components/impact/impact-testimonials-page.tsx:25 |
| `ImpactSdgsContent` | :1064 | hardcoded string | components/impact/impact-sdgs-page.tsx:25 |
| `ContactPageContent` | :1125 | hardcoded string | components/contact/contact-page.tsx:47 |

Two failure classes, both worse than an empty alt:

1. **Hardcoded English describing a photo the editor can replace.** Thirteen of the seventeen. The
   organisation swaps the hero on `/our-impact` and the alt still reads "Graduates and learners
   representing IT For Youth Ghana impact". A screen-reader user is told about a photograph that is
   no longer on the page, and no admin control exists to correct it.
2. **Title-as-alt.** `department-detail-page.tsx:27`, `organisation-service-page.tsx:41`,
   `initiative-page.tsx:107`, `partnership-track-page.tsx:30` and `:98`, `content-page.tsx:48`,
   `programs-overview.tsx:35`. This repeats the heading the user has already heard. It is the exact
   antipattern `types/content.ts:59-62` was written to stop, and `content-page.tsx:48`
   (`page.heroImageAlt || page.title`) still keeps it as the fallback.

Non-hero media with no alt field:

| Type | Field | Line | Assessment |
| --- | --- | --- | --- |
| `HeroSlide` | `image` | :206 | **Defect.** The largest, first image on the site, on a rotating carousel, with no alt path at all. |
| `DonationCampaignContent` | `image` | :249 | **Defect.** Appears on `/` and `/donate`. |
| `ProgrammeShowcaseItem` | `image` | components/home/programme-showcase.tsx:12 | **Defect.** Card photo carrying programme identity. |
| `FeaturedStoryContent` | `backgroundImage` | components/home/featured-story-video.tsx:17 | **Defect.** A named person's portrait. |
| `ImpactFeaturedStory` | `backgroundImage` | :953 | **Defect.** Same, on `/our-impact/testimonials`. |
| `ImpactStory` | `image` | :968 | **Defect.** Portrait of a named alumna or alumnus. |
| `InitiativePartner` | `logo` | :337 | **Defect.** A logo carries organisation identity; `name` is adjacent but the logo is a separate visual claim. |
| `CmsPartner` | `logo` | lib/cms/partners.ts:23 | **Defect.** Same. |
| `FloatingElementsContent` | `exitIntent.image` | components/layout/floating-elements.tsx:28 | **Defect.** Inside a modal, where alt matters most. |
| `WhatWeDoGalleryItem` | `url` | :890 | **Conflated.** `title` doubles as alt; the admin labels the input "Title / alt text" (components/admin/what-we-do-forms.tsx:400). One string cannot be both a caption and a description. |
| `SitePage` | `heroVideoThumbnail` | :67 | Poster frame, no alt. Low priority, no renderer reads it today. |
| `TeamMemberProfile` | `photo` | :139 | Acceptable if the renderer emits `alt={name}, {role}`; needs verification per renderer, not a schema change. |
| `HighlightStat` | `iconImage` | :21 | Decorative. Correct answer is `alt=""` at the render site, not a schema field. |
| `InitiativeProcessStep`, `TrainingProcessStep`, `OrganisationServiceCard`, `OrganisationProcessStep`, `PartnershipFocusCard`, `PartnershipProcessStep`, `ImpactSdgGoal`, `DepartmentProfile` | `iconImage` | various | Decorative. Same answer. |
| `InitiativeTestimonial` | `avatar` | :330 | Decorative beside a visible name. Acceptable. |
| `ArticleAuthor` | `avatar` | :420 | Decorative beside a visible byline. Acceptable. |
| `ArticleSeo` | `ogImage` | :426 | Not rendered inline. Not applicable. |
| `CmsPublicSettings` | `logoUrl`, `defaultOgImage` | lib/cms/settings.ts:14-15 | Site chrome; alt belongs in the header component. |

### 2.3 A separate and worse case: the four training pages

`TrainingLandingContent` (:542), `TrainingCatalogContent` (:555), `TrainingEligibilityContent`
(:572) and `TrainingHowItWorksContent` (:594) each declare a `heroImage` and each has no alt field,
but they are **dead types**. `grep -rn` finds them only in `types/content.ts` and
`lib/content/training-config.ts`; no reader and no renderer consumes them. The four public training
pages are rendered from `SitePage` instead
(`app/(public)/apply-for-training/page.tsx:23`, `components/training/apply-for-training-overview-page.tsx:9`).

That makes their alt situation worse, not better. `SitePage` **has** `heroImageAlt`, the admin
**does** edit it (components/admin/site-page-form.tsx:366-372), and all four renderers throw it away
in favour of a hardcoded string:

| Route | Renderer | Hardcoded alt |
| --- | --- | --- |
| `/apply-for-training` | components/training/apply-for-training-overview-page.tsx:43 | "Learners in an IT For Youth Ghana training session" |
| `/apply-for-training/courses` | components/training/training-course-listing-page.tsx:35 | "Learners exploring training pathways" |
| `/apply-for-training/who-can-apply` | components/training/training-who-can-apply-page.tsx:32 | "Learners gathering for an ITFY training session" |
| `/apply-for-training/how-it-works` | components/training/training-how-it-works-page.tsx:41 | "Learners listening during orientation and onboarding" |

Count of real defects: **10 non-hero media fields, 13 hero fields with no alt in the schema, and 4
hero fields where the schema and the editor are both correct but the renderer ignores them = 27
media slots with no working editor-controlled alt text.**

## 3. Admin editor coverage

### 3.0 What "covered" means today, and why it is not enough

`scripts/cms-coverage.mjs` traces coverage at the **route** level: for each public route it resolves
the reader, the seed, the type, the admin path and the revalidation entry (see its header comment,
`scripts/cms-coverage.mjs:1-15`, and the `editorsFor(route)` function at `:87`). `lib/cms/coverage.test.ts`
locks in five specific gaps the earlier audit found: no direct seed imports in pages (`:47`), the
donate campaign reader (`:73`), revalidation for both campaign pages (`:79`), the initiative registry
(`:87`), and the `?? []` seed-fallback bug (`:96`).

None of those checks look at **fields**. A route counts as covered when an admin path exists that
previews it. The gaps below are all routes that pass the existing coverage script while leaving
media fields with no input anywhere in the admin UI. That is the layer this section adds.

Status vocabulary used in the tables:

- **editable**: a labelled form input writes the field.
- **raw JSON**: reachable only by hand-editing a JSON blob in a `<textarea>`.
- **no editor**: the field exists in the type and is rendered publicly, but nothing in
  `components/admin/` or `app/(admin)/` writes it.
- **write-only**: the admin writes it and the reader drops it before the public page sees it.
- **not persisted**: no reader and no renderer; the field is dead.

### 3.1 The two shapes that break the redesign

| Field | Type | Reader | Admin editor | Status |
| --- | --- | --- | --- | --- |
| `image` | `ContentBlock` (:44) | `getCmsSitePage` (lib/cms/site-pages.ts:204), `getCmsWhoWeAreDynamicPageBySlug` (:321), `getCmsWhatWeDoDynamicPageBySlug` (:358) | none | **no editor** |
| `imageAlt` | `ContentBlock` (:45) | same | none | **no editor** |
| `videoUrl` | `ContentBlock` (:46) | same | none | **no editor** |
| `videoTitle` | `ContentBlock` (:47) | same | none | **no editor** |
| `image` | `RouteCard` (:29) | every hub reader | none | **no editor** |
| `imageAlt` | `RouteCard` (:30) | every hub reader | none | **no editor** |

This is the single largest finding in the audit.

`components/shared/content-page.tsx:64-129` is the redesign's editorial engine. It reads
`section.image`, `section.imageAlt`, `section.videoUrl` and `section.videoTitle` off every
`ContentBlock` and picks a wide frame, a circular figure or a story section accordingly. The section
editor in `components/admin/site-page-form.tsx:724-758` renders exactly three inputs per section:
Title (`:727`), Body (`:745`), Bullets (`:752`). There is no image input, no alt input, no video
input. Verified by reading the full JSX block.

The consequence: an administrator can add a section to `/who-we-are` or any dynamic What We Do page
and it will always render through the no-media branch at `content-page.tsx:82-94`, a big grey ordinal
number beside the prose. The redesign's core requirement, every substantive text block paired with
real media, is unreachable from the admin UI on the exact template built to satisfy it.

`RouteCard.image`/`imageAlt` is the same failure with wider blast radius. Four separate route-card
editors exist and none of them writes the media fields:

| Editor | File:line | Fields written |
| --- | --- | --- |
| `RouteCardsEditor` (what-we-do) | components/admin/what-we-do-forms.tsx:210-213 | eyebrow, title, href, description |
| `RouteCardsEditor` (news) | components/admin/news-page-form.tsx:156 | eyebrow, title, href, description |
| route-card block (contact) | components/admin/contact-page-form.tsx:331-334 | eyebrow, title, href, description |
| related-card block (site page) | components/admin/site-page-form.tsx:836-869 | eyebrow, href, title, description |

`grep -rn 'imageAlt' components/admin/` confirms `RouteCard.imageAlt` is written by none of them.

### 3.2 Three layers must change together, not one

Adding the missing inputs to `site-page-form.tsx` alone would fix nothing. The `SitePage` write and
read path drops media at two further points, both verified:

**Layer 1, validation strips it.** `lib/utils/validators.ts:303-307` defines
`sitePageSectionSchema` as `{ title, body, bullets }`. `:314-319` defines `sitePageRouteCardSchema`
as `{ href, eyebrow, title, description }`. Zod `z.object` strips unknown keys by default, so
`ContentBlock.image`, `imageAlt`, `videoUrl`, `videoTitle` and `RouteCard.image`, `imageAlt` are
discarded at the API boundary even if a client sends them.

**Layer 2, the read path drops it.** `mergeSitePage` (lib/cms/site-pages.ts:85-112) rebuilds the
page object from a fixed key list. `optionalStringFields` (`:55-79`) contains `heroImage`,
`principlesImage` and `principlesImageAlt` but **not** `heroImageAlt`, `heroVideoUrl`,
`heroVideoThumbnail`, `overviewVideoUrl` or `overviewVideoTitle`. Any value in those Firestore fields
is invisible to the public page.

**Layer 3, the form.** Covered in 3.1.

That produces three distinct broken round-trips on `SitePage`:

| Field | Admin input | Passes Zod | Reaches Firestore | Read back by `mergeSitePage` | Public consumer | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| `heroImageAlt` (:63) | yes, site-page-form.tsx:366-372 | **no**, absent from `sitePageSchema` (validators.ts:372-410) | no | no | yes, content-page.tsx:48 | **silently discarded on submit** |
| `heroVideoUrl` (:65) | yes, site-page-form.tsx:382-390 | yes (validators.ts:379) | yes | **no** (:55-79) | none | **write-only, and nothing renders it** |
| `heroVideoThumbnail` (:67) | yes, site-page-form.tsx:394-402 | yes (validators.ts:380) | yes | **no** | none | **write-only, and nothing renders it** |
| `overviewVideoUrl` (:69) | no | no | no | no | yes, who-we-are-page.tsx:117 | **no editor** |
| `overviewVideoTitle` (:70) | no | no | no | no | yes | **no editor** |
| `principlesImage` (:89) | yes, site-page-form.tsx:558-559 | yes (:398) | yes | yes (:67) | yes, who-we-are-page.tsx:193 | working |
| `principlesImageAlt` (:90) | yes, site-page-form.tsx:562-563 | yes (:399) | yes | yes (:68) | yes, who-we-are-page.tsx:194 | working |
| `heroImage` (:57) | yes, site-page-form.tsx:355-362 | yes (:378) | yes | yes (:56) | yes, content-page.tsx:47 | working |

`heroImageAlt` is the worst of the three. An administrator types a careful photo description, presses
save, sees a success message, and the value never leaves the browser. The seed value at
`lib/content/site-config.ts:1562`, `:1595`, `:1628` keeps rendering, or `page.title` does on a
dynamic page that has no seed.

### 3.3 Homepage

| Field | Type | Reader | Admin editor | Status |
| --- | --- | --- | --- | --- |
| `image` | `HeroSlide` (:206) | `getCmsHeroSlides` (homepage.ts:83) | hero-slides-form.tsx (`/admin/content/hero-slides`) | editable |
| `overlayFrom`, `overlayTo` | `HeroSlide` (:212-213) | same | hero-slides-form.tsx | editable |
| `accent` | `HeroSlide` (:220) | same | hero-slides-form.tsx:167-169 | editable |
| `mediaCaption` | `HeroSlide` (:223) | same | hero-slides-form.tsx | editable |
| alt text | `HeroSlide` | n/a | n/a | **field does not exist** |
| `image`, `imageAlt`, `imageLabel`, `imageCaption`, `videoUrl`, `videoTitle` | `OverviewSectionContent`, `MissionSectionContent`, `ChallengeSectionContent` | `getCmsOverviewSection` / `getCmsMissionSection` / `getCmsChallengeSection` (homepage.ts:122, :148, :135) | homepage-narrative-forms.tsx (`/admin/content/homepage`) | editable |
| `image` | `ProgrammeShowcaseItem` (programme-showcase.tsx:12) | `getCmsProgrammeShowcase` (homepage.ts:109) | programme-showcase-form.tsx:108 | editable |
| `accent`, `icon` | `ProgrammeShowcaseItem` | same | programme-showcase-form.tsx | editable |
| alt text | `ProgrammeShowcaseItem` | n/a | n/a | **field does not exist** |
| `backgroundImage`, `videoUrl` | `FeaturedStoryContent` (featured-story-video.tsx:17-18) | `getCmsFeaturedStory` (homepage.ts:174) | featured-story-form.tsx (`/admin/content/featured-story`) | editable |
| alt text | `FeaturedStoryContent` | n/a | n/a | **field does not exist** |
| `image`, `imageAlt`, `icon` | `JoinCtaCard` (:281, :282, :274) | `getCmsJoinCtaCards` (homepage.ts:187) | join-cta-cards-form.tsx | editable |
| `image` | `DonationCampaignContent` (:249) | `getCmsDonationCampaign` (homepage.ts:161) | donation-campaign-form.tsx | editable |
| alt text | `DonationCampaignContent` | n/a | n/a | **field does not exist** |
| `exitIntent.image` | `FloatingElementsContent` (floating-elements.tsx:28) | `getCmsFloatingElements` (homepage.ts:213) | floating-elements-form.tsx:163 | editable |
| alt text | `FloatingElementsContent.exitIntent` | n/a | n/a | **field does not exist** |
| `variant` | `HomepageSection` (:301) | none | none | **not persisted** (dead type, no consumer) |

The homepage is the best-covered surface in the application. Every media URL it renders has a
labelled admin input. Its whole gap is alt text: five media fields with no alt field in the schema.

### 3.4 What We Do and initiatives

| Field | Type | Reader | Admin editor | Status |
| --- | --- | --- | --- | --- |
| `heroImage` | `WhatWeDoOverviewContent` (:900) | `getCmsWhatWeDoOverview` (initiatives.ts:78) | what-we-do-forms.tsx:339 | editable |
| `image`, `imageAlt` | `EcosystemCardContent` (:869-870) | same | what-we-do-forms.tsx:358-359 | editable |
| `galleryItems` (`type`, `url`, `title`, `description`, `thumbnailUrl`) | `WhatWeDoGalleryItem` (:889-893) | same | what-we-do-forms.tsx:389-405 | editable |
| `initiativeSlugs` | `PathwayCardContent` (:885) | same | what-we-do-forms.tsx | editable |
| `heroImage` | `InitiativePage` (:395) | `getCmsInitiativeBySlug` (initiatives.ts:153) | what-we-do-forms.tsx:513 | editable |
| `overviewImage` | `InitiativePage` (:396) | same | what-we-do-forms.tsx:514 | editable |
| `overviewImageAlt` | `InitiativeSectionContent` (:355) | same | what-we-do-forms.tsx:517 | editable |
| `accent` | `InitiativePage` (:393) | same | what-we-do-forms.tsx:515 | editable |
| `src`, `alt` | `InitiativeGalleryImage` (:322-323) | same | what-we-do-forms.tsx:601-602 | editable |
| `avatar` | `InitiativeTestimonial` (:330) | same | what-we-do-forms.tsx:614 | editable |
| `logo` | `InitiativePartner` (:337) | same | what-we-do-forms.tsx:630 | editable |
| `iconImage` | `InitiativeProcessStep` (:312) | same | what-we-do-forms.tsx:578 | editable |
| `iconImage` | `HighlightStat` in `impactStats` (:21) | same | what-we-do-forms.tsx:237 | editable |
| `heroImageAlt` | `InitiativePage` via `SitePage` (:63) | same | **none** | **no editor** |
| `sections` (`ContentBlock[]`) | `InitiativePage` via `SitePage` (:72) | same | **none** | **no editor** |
| `related` image/alt | `RouteCard` (:29-30) | same | what-we-do-forms.tsx:210-213 writes text only | **no editor** |

`components/admin/what-we-do-forms.tsx` is the most complete media editor in the repository and is
the pattern the other domains should follow. Its gaps are the two inherited `SitePage` shapes.

### 3.5 Impact

| Field | Type | Reader | Admin editor | Status |
| --- | --- | --- | --- | --- |
| `heroImage` | all four `Impact*Content` (:989, :1013, :1045, :1064) | `getCmsImpactPage` (impact-pages.ts:58) | impact-page-form.tsx:553 | editable |
| `methodVideoUrl`, `methodVideoTitle` | `ImpactReportsContent` (:1020-1021) | same | impact-page-form.tsx:591-598 | editable |
| `principlesVideoUrl`, `principlesVideoTitle` | `ImpactSdgsContent` (:1081-1082) | same | impact-page-form.tsx:627-634 | editable |
| `backgroundImage`, `videoUrl` | `ImpactFeaturedStory` (:953-954) | same | impact-page-form.tsx:333 | editable |
| `image` | `ImpactStory` (:968) | same | impact-page-form.tsx:350 | editable |
| `iconImage` | `HighlightStat` (:21) | same | impact-page-form.tsx:218 | editable |
| `image`, `imageAlt` | `ImpactEvidenceCard` (:931-932) | same | **none** (impact-page-form.tsx:248-254 writes title, icon, description, bullets only) | **no editor** |
| `iconImage` | `ImpactSdgGoal` (:978) | same | **none** (impact-page-form.tsx:388 writes goal, title, icon only) | **no editor** |
| `image`, `imageAlt` | `ImpactOverviewContent` (:987-988) | same | **none** (absent from the `TextFieldKey` union, impact-page-form.tsx:34-75) | **no editor** |
| `related` / `routeCards` image, alt | `RouteCard` (:29-30) | same | **none** | **no editor** |
| `iconImage` | `HighlightStat` in impact stats | `getCmsImpactStats` (impact-stats.ts:41) | `/admin/content/impact-stats` | editable |

`ImpactEvidenceCard` is the one to notice. It is the card shape on `/our-impact` and
`/our-impact/reports`, it already has both `image` and `imageAlt` in the type, and the form offers
only `icon`. The schema is ready and the editor is not.

### 3.6 Organisations, partnerships, news, contact, departments

| Field | Type | Reader | Admin editor | Status |
| --- | --- | --- | --- | --- |
| every field | `OrganisationOverviewContent` (:716) | `getCmsOrganisationOverview` (organisations.ts:12) | organisation-content-form.tsx, a single `<textarea>` (`:40`) | **raw JSON** |
| every field | `OrganisationServicePage` (:677) | `getCmsOrganisationService` (organisations.ts:37) | organisation-content-form.tsx | **raw JSON** |
| `heroImage` | `PartnershipTrackPage` (:800) | `getCmsPartnershipTrackBySlug` (partnerships.ts:47) | partnership-track-form.tsx | editable |
| `overviewVideoUrl`, `overviewVideoTitle` | `PartnershipTrackPage` (:828-829) | same | partnership-track-form.tsx:137 | editable |
| `image`, `imageAlt` (card) | `PartnershipTrackPage` (:797-798) | same | **none** | **no editor** |
| `image`, `imageAlt` | `PartnershipFocusCard` (:757-758) | same | **none** | **no editor** |
| `iconImage` | `PartnershipProcessStep` (:768) | same | **none** | **no editor** |
| `heroImage`, `overviewVideoUrl`, `overviewVideoTitle` | `PartnershipOverviewContent` (:836, :855-856) | `getCmsPartnershipOverview` (partnerships.ts:12) | partnership-overview-form.tsx | editable |
| `image`, `imageAlt` | `PartnershipOverviewCard` (:746-747) | same | **none** | **no editor** |
| `heroImage` | `NewsHubContent` (:454), `ArticleCategoryContent` (:482) | `getCmsNewsPage` (news-pages.ts:51), `getCmsArticleCategoryContent` (:75) | news-page-form.tsx:250 | editable |
| `iconImage` | `HighlightStat` (:21) | same | news-page-form.tsx:114 | editable |
| `image`, `imageAlt`, `videoUrl`, `videoTitle` | `ContentBlock` in `editorialPillars` (:456) | same | **none** (`PillarsEditor`, news-page-form.tsx:129-141, writes title, body, bullets) | **no editor** |
| `image`, `imageAlt` | `RouteCard` in `routeCards` (:457) | same | **none** (news-page-form.tsx:163-166) | **no editor** |
| `heroImage` | `ContactPageContent` (:1125) | `getCmsContactPage` (contact.ts:10) | contact-page-form.tsx | editable |
| `image`, `imageAlt` | `RouteCard` in `routeCards` (:1130) | same | **none** (contact-page-form.tsx:331-334) | **no editor** |
| `heroVideoUrl`, `heroVideoThumbnail` | `ContactEnquiryOption` (:1108-1109) | same | none | **not persisted** (no renderer; fields on the wrong type) |
| `heroImage`, `icon`, `iconImage` | `DepartmentProfile` (:175-178) | `getCmsDepartmentBySlug` (departments.ts:214) | department-form.tsx | editable |
| `image`, `imageAlt`, `videoUrl`, `videoTitle` | `ContentBlock` in `services` (:181) | same | **none** | **no editor** |

`components/admin/organisation-content-form.tsx` is the weakest editor in the application. Both
`/programmes/for-organisations` routes are edited by pasting the entire page document into one dark
`<textarea>`. Its own banner (`:37`) admits it: "Images accept URL or public-path strings only, there
is no upload field." Every media field there is technically reachable and none of it is safely
editable by a non-technical administrator. A single mistyped brace loses the page.

### 3.7 Collections

| Field | Type | Reader | Admin editor | Status |
| --- | --- | --- | --- | --- |
| `coverImage`, `coverAlt` | `ArticleSeed` (:439-440) | `getCmsArticleBySlug` (articles.ts:267) | article-form.tsx:120-121 | editable |
| `author.avatar` | `ArticleAuthor` (:420) | same | article-form.tsx:125 | editable |
| `seo.ogImage` | `ArticleSeo` (:426) | same | article-form.tsx:131 | editable |
| `photo` | `TeamMemberProfile` (:139) | `getCmsTeamMembers` (team.ts:53) | team-form.tsx | editable |
| `avatar` | `CmsTestimonial` (testimonials.ts:43) | `getCmsTestimonials` (testimonials.ts:56) | testimonial-form.tsx | editable |
| `logo` | `CmsPartner` (partners.ts:23) | `getCmsPartners` (partners.ts:38) | partner-form.tsx | editable |
| `logoUrl`, `defaultOgImage` | `CmsPublicSettings` (settings.ts:14-15) | `getCmsSettings` (settings.ts:43) | settings-form.tsx | editable |
| none | `JobListing` (:118) | `getCmsJobs` (jobs.ts:73) | job-form.tsx | no media in the type |

Collections are clean. Every media field has an input.

### 3.8 Totals

Counted mechanically from the rows of the tables in 3.1 to 3.7. A row can name more than one field
(for example "`image`, `imageAlt`"), so these are row counts, not field counts.

| Status | Rows |
| --- | --- |
| editable | 46 |
| no editor | 23 |
| field does not exist (alt text, section 2) | 5 |
| raw JSON only | 2 (`OrganisationOverviewContent`, `OrganisationServicePage`, each meaning every field on the type) |
| not persisted / dead | 2 (`HomepageSection.variant`; `ContactEnquiryOption.heroVideoUrl` and `heroVideoThumbnail`) |
| write-only or discarded | 3, all on `SitePage`: `heroImageAlt`, `heroVideoUrl`, `heroVideoThumbnail` (table in 3.2) |

Reproduce with:

```
awk '/^### 3\.1/,/^## 4\./' docs/redesign/cms-reconciliation.md | grep -c '| editable |'
```

The headline number: **23 rows of media and editorial-configuration fields are rendered on public
pages and cannot be changed from the admin UI at all**, plus two entire page types reachable only
through a JSON textarea.

## 4. Layout-variant support

### 4.1 Verified: no content type carries a layout discriminator

`grep -rn "variant\|layout\|orientation\|treatment\|mediaSide\|reverse\|fullBleed" types/*.ts`
returns two hits: a prose comment at `types/content.ts:277` and `HomepageSection.variant` at `:301`.
`HomepageSection` is dead (section 1.3) and its `variant` is a colour band, not a layout. Nothing in
`components/` accepts a `mediaSide`, `imageLeft`, `imageRight` or `flip` prop.

Layout is currently derived from **array index**:

| Renderer | Rule | File:line |
| --- | --- | --- |
| `ContentPage` | `const treatment = index % 3` picks wide frame, circular figure, or story section | components/shared/content-page.tsx:68 |
| `ContentPage` story step | `imagePosition={index % 2 === 0 ? "left" : "right"}` | components/shared/content-page.tsx:127 |
| `EditorialGuidanceGrid` | `index % 2 === 0` picks the media shape | components/shared/editorial-guidance-grid.tsx:30 |
| `WhatWeDoGallery` | `index % 4 === 0` sets the column span | components/what-we-do/what-we-do-gallery.tsx:43 |
| `InitiativeGallery` | `index % 5`, `index % 3` set the tile shape | components/what-we-do/initiative-gallery.tsx:21-23 |

The docstring at `content-page.tsx:16-30` explains the three-step rotation and why it is a rotation
rather than a two-step alternation. The reasoning is sound. The problem is the input: position in
the array, which an editor changes as a side effect of reordering content. Drag a section up one
slot and its photograph silently changes from a full-width cinema frame to a circular crop. An
editor has no way to say "this one is the wide one" and no way to see why it changed.

### 4.2 The primitives already exist

`components/media/` is a complete, documented set. Verified by reading each file header:

| Primitive | Shape | Orientation rule | File |
| --- | --- | --- | --- |
| `MediaBand` | full-bleed landscape band | wide, the default for programme content | components/media/media-band.tsx:20-25 |
| `WideFrame` | landscape frame above a text column, `ratio: "wide" \| "cinema"` | wide | components/media/wide-frame.tsx:5-14 |
| `OffsetFrames` | stacked offset landscape plates | wide, builds height from wide photography | components/media/offset-frames.tsx:17-22 |
| `CircularFigure` | circular crop, `size: "sm" \| "md" \| "lg"` | orientation-agnostic, crops cleanly from either library | components/media/circular-figure.tsx:8, :17-20 |
| `PortraitFigure` | portrait frame | reserved for people | components/media/portrait-figure.tsx:17-22 |
| `VideoCard` | thumbnail plus play affordance | landscape | components/media/video-card.tsx:15 |
| `MediaFallback` | typographic mark, `variant: "wordmark" \| "monogram"` | no photograph at all | components/media/media-fallback.tsx:9 |

The enum below is not new design work. It names the primitives that already exist and hands the
choice to the editor.

### 4.3 Proposed enum

Add one optional field to `ContentBlock`, since that is the shape every editorial body is built
from:

```ts
/**
 * How this block pairs its text with its media.
 *
 * Omitted means "let the template decide", which preserves the existing
 * index-based rotation for every document written before this field existed.
 * A set value pins the treatment so reordering sections cannot change it.
 *
 * Orientation rule (docs/addendum-media-pairing.md): the programme library is
 * roughly 30:1 landscape and the people library roughly 16:1 portrait, so
 * "portrait" is for people and everything else is wide or circular.
 */
export type MediaTreatment =
  | "wide-frame"     // WideFrame above the text column
  | "full-bleed"     // MediaBand, edge to edge
  | "offset-frames"  // OffsetFrames, stacked plates beside tall text
  | "media-left"     // StorySection, imagePosition="left"
  | "media-right"    // StorySection, imagePosition="right"
  | "circular"       // CircularFigure beside the text
  | "portrait"       // PortraitFigure, people only
  | "video-feature"  // VideoCard as the primary media
  | "data-feature";  // stats or chart in the media slot, no photograph
```

Nine values, all backed by an existing primitive, all nameable in a `<select>`. No free-form page
builder: an editor picks from a fixed list and cannot invent a layout.

### 4.4 Which types need it

| Type | Field to add | Why |
| --- | --- | --- |
| `ContentBlock` (:39) | `treatment?: MediaTreatment` | The editorial body of `ContentPage`, `DepartmentProfile.services`, `NewsHubContent.editorialPillars`. One field covers all three. |
| `InitiativePage` (:385) | `overviewTreatment?: MediaTreatment` | The overview pairing is a fixed layout today; programme pages are where the redesign is most visible. |
| `WhatWeDoGalleryItem` (:888) | `span?: "half" \| "full"` | Replaces `index % 4` at what-we-do-gallery.tsx:43. Not the full enum: a gallery tile only needs a width. |
| `EcosystemCardContent` (:864) | `treatment?: MediaTreatment` restricted to `"portrait" \| "circular" \| "wide-frame"` | Cards, not full sections. |
| `ImpactStory` (:959) | already has `format` (:969) | `"written" \| "video" \| "partner"` is a working discriminator. Extend it rather than adding a second one. |
| `HeroSlide` (:201) | none | Hero layout is fixed by the capsule shell. |

Do **not** add it to `RouteCard`. A route card is a fixed grid tile; giving it a treatment invites
inconsistent card rows. It needs `image` and `imageAlt` to be editable (section 3.1), not a layout
choice.

### 4.5 Admin control

A `<select>` beside the section's image input, in each of the two `ContentBlock` editors that exist:
`components/admin/site-page-form.tsx:724-758` and `components/admin/news-page-form.tsx:129-141`.
Default option labelled "Automatic (rotate)" writing `undefined`, then the nine named values. This
lands in the same commit as the image and alt inputs those two editors are missing, because a
treatment picker with no image field to sit beside is useless.


### 4.6 Collision with parallel work: `types/page-sections.ts`

Observed during this audit, not part of commit `37db40a`. `types/page-sections.ts` is untracked in
the working tree (`git status`: `?? types/page-sections.ts`) and already defines a variant system
that overlaps the enum proposed above:

- `PageSectionBase<TType, TVariant>` (`:66-74`) gives every section an `id`, `componentType`,
  `variant`, `anchor`, `navLabel`, `theme`, `enabled`.
- `PAGE_SECTION_TYPES` (`:9-22`) lists twelve section types.
- `MediaNarrativeSection` (`:97-104`) carries `variant: "split" | "capsule" | "overlay" | "collage"`
  plus `media: SectionMediaContent` and `secondaryMedia`.
- `SectionMediaContent` (`:33-39`) is `{ src, alt, caption?, credit?, focalPoint? }`, which is a
  better media shape than the flat `image` / `imageAlt` pairs in `types/content.ts`: alt is
  **required**, and it carries `caption`, `credit` and `focalPoint`.

Its consumers today are `lib/cms/homepage.ts`, `lib/content/site-config.ts`, `app/(public)/page.tsx`,
`components/home/homepage-sections.tsx` and `components/admin/homepage-narrative-forms.tsx`, so it is
being wired into the homepage first.

**This is a Confusion Protocol item, not something to resolve unilaterally.** Two plausible
architectures are now in the tree for the same requirement:

1. **Extend `ContentBlock`** with `treatment?: MediaTreatment` (section 4.3). Small, additive, works
   with every existing document and every existing reader. Keeps two systems.
2. **Migrate editorial bodies onto `PageSectionType` / `PageSectionBase`.** One coherent section
   registry with required alt text, captions, credits and focal points. Larger change: needs an
   adapter for every domain reader, a new admin editor per section type, and a migration path for
   documents currently holding `ContentBlock[]`.

Option 2 is the better end state and would close G1, G2, G6 and most of G8 at once, since
`SectionMediaContent.alt` is required. Option 1 is what can ship this week without touching the
readers. The decision belongs to whoever owns the redesign sequencing, and it should be made before
anyone adds `treatment` to `ContentBlock`, because doing both creates exactly the "same conceptual
content record with different identities per layer" problem the constitution's content-source-of-truth
section warns about.

Everything else in this document is unaffected by that choice. G1's missing Zod fields, G3 and G4's
broken alt round-trip, G7's absent card inputs and G10's missing host validation are all defects in
the current system regardless of which section model wins.

## 5. The gap list

Ordered by how much each one blocks the media-led redesign. Every entry names the smallest schema
change, whether it extends an existing type or needs a new one, and the editor change that must ship
in the same commit.

### G1. Editorial sections cannot carry media

**Requirement it blocks:** every substantive text block sits in a real visual relationship with
media. This is the redesign's central rule and `ContentPage` is the template built to satisfy it.

**What is missing:** nothing in the schema. `ContentBlock.image`, `imageAlt`, `videoUrl`,
`videoTitle` already exist (:44-47) and `content-page.tsx:64-129` already renders them. The gap is
entirely in the write path.

**Change, three files, one commit:**

1. `lib/utils/validators.ts:303-307` extend `sitePageSectionSchema` with
   `image: optionalTrimmedString, imageAlt: optionalTrimmedString, videoUrl: optionalTrimmedString,
   videoTitle: optionalTrimmedString`.
2. `components/admin/site-page-form.tsx:724-758` add four inputs to the section repeater.
   `components/admin/news-page-form.tsx:129-141` (`PillarsEditor`) needs the same four.
3. No reader change: `mergeSitePage:87` passes `sections` through as an array without rebuilding it.

**Reuse note:** do not invent a `sectionImage` or `media` field. `ContentBlock.image` is the existing
concept and three renderers already read it.

### G2. Route cards cannot carry media

**Requirement it blocks:** the related-routes grid at the foot of nearly every page is currently a
wall of text tiles. `RouteCard.image` and `imageAlt` (:29-30) exist for exactly this.

**Change:**

1. `lib/utils/validators.ts:314-319` extend `sitePageRouteCardSchema` with `image` and `imageAlt`.
2. Four editors need the two inputs: `what-we-do-forms.tsx:210-213`, `news-page-form.tsx:163-166`,
   `contact-page-form.tsx:331-334`, `site-page-form.tsx:836-869`. Better: extract one shared
   `RouteCardsEditor` and delete three copies. The duplication is already a maintenance cost and
   this change would otherwise triple it.
3. Verify `RouteCardGrid` renders the image; if it does not, that is a presentation change to pair
   with this one.

### G3. Hero alt text is unreachable on 17 page types

**Requirement it blocks:** accessibility, and the ability to replace placeholder photography without
leaving a stale description behind.

**Change:** add `heroImageAlt?: string` to the thirteen types listed in 2.2, and fix the four
training renderers listed in 2.3 to read the `SitePage.heroImageAlt` they already receive.

**Prefer reuse:** `heroImageAlt` is the established name (`SitePage:63`). Do not introduce
`heroAlt`, `imageAltText` or a nested `{ src, alt }` media object; a parallel concept would leave two
alt fields on types that later gain both.

**Same commit:** add the input to `impact-page-form.tsx`, `news-page-form.tsx`,
`partnership-track-form.tsx`, `partnership-overview-form.tsx`, `contact-page-form.tsx`,
`department-form.tsx`, `what-we-do-forms.tsx`, and the corresponding Zod schemas in
`lib/utils/validators.ts:800`, `:831` and the impact/news schemas.

### G4. `heroImageAlt` is silently discarded on `SitePage`

**Requirement it blocks:** the one type that does the right thing does not work.

**Change:** add `heroImageAlt: editableCmsString` to `sitePageSchema` (lib/utils/validators.ts:378,
beside `heroImage`), and add `"heroImageAlt"` to `optionalStringFields`
(lib/cms/site-pages.ts:55-79). Two lines. Also fix the fallback at `content-page.tsx:48`:
`page.heroImageAlt || page.title` should not fall back to the title.

**Test that must ship with it:** a round-trip contract test in `lib/cms/` asserting that every
optional string field in `sitePageSchema` also appears in `optionalStringFields`. That is the
deterministic guard that stops this class of bug reopening, and it would also catch G5.

### G5. `heroVideoUrl` and `heroVideoThumbnail` are write-only and unrendered

**Change:** either add both to `optionalStringFields` and give `content-page.tsx` a video hero
branch, or delete the fields and their inputs. Half-built is worse than either. The same applies to
`ContactEnquiryOption.heroVideoUrl` / `heroVideoThumbnail` (:1108-1109), which are on the wrong type
and should be deleted or moved to `ContactPageContent`.

### G6. No editor-controlled layout variant

**Requirement it blocks:** an editor cannot choose a treatment, and reordering sections silently
changes their layout (section 4.1).

**Change:** the `MediaTreatment` enum in 4.3, added as `treatment?: MediaTreatment` on
`ContentBlock`, plus `overviewTreatment?` on `InitiativePage` and `span?` on `WhatWeDoGalleryItem`.
A `<select>` in the two `ContentBlock` editors, defaulting to "Automatic (rotate)".

**Ships with G1**, because a treatment picker with no image field beside it is useless.

### G7. Cards that already have `image`/`imageAlt` have no inputs

`ImpactEvidenceCard` (:931-932), `PartnershipOverviewCard` (:746-747), `PartnershipFocusCard`
(:757-758), `PartnershipTrackPage.image`/`imageAlt` (:797-798), `OrganisationServiceCard` (:632-633),
`OrganisationProcessStep` (:641-642).

**Change:** no schema change at all. Add the two inputs to `impact-page-form.tsx:248-254`,
`partnership-track-form.tsx`, `partnership-overview-form.tsx`, and extend the corresponding Zod
schemas where they omit the fields. The cheapest win in the list: six card types become media-bearing
with editor changes only.

### G8. Alt text missing on ten non-hero media fields

`HeroSlide.image`, `DonationCampaignContent.image`, `ProgrammeShowcaseItem.image`,
`FeaturedStoryContent.backgroundImage`, `ImpactFeaturedStory.backgroundImage`, `ImpactStory.image`,
`InitiativePartner.logo`, `CmsPartner.logo`, `FloatingElementsContent.exitIntent.image`,
`WhatWeDoGalleryItem` (title conflated with alt).

**Change:** add a sibling alt field to each, named consistently: `imageAlt`, `backgroundImageAlt`,
`logoAlt`. For `WhatWeDoGalleryItem`, add `alt?: string` and stop labelling `title` as alt in
`what-we-do-forms.tsx:400`. `HeroSlide.imageAlt` is the highest priority: largest image on the site,
on a carousel, no alt path at all.

### G9. Organisation pages are edited as raw JSON

**Requirement it blocks:** "replaceable through the admin UI" is not satisfied by a JSON textarea for
a non-technical editor, and a malformed brace loses the whole page.

**Change:** no schema change. `components/admin/organisation-content-form.tsx` needs to become a real
form. `partnership-track-form.tsx` is the closest existing model for the same shape, and
`what-we-do-forms.tsx` is the reference for the repeater and media patterns. This is the largest
single piece of editor work in the list and the only one that is purely UI.

### G10. No host validation on any media URL input

**Requirement it blocks:** replacing placeholder photography without breaking the page.

**Change, two parts:**

1. Route every CMS media render through `RemoteImage` / `resolveImageSrc` (the ten components in
   6.4). This converts a runtime throw into a `MediaFallback`.
2. Add a shared Zod refinement in `lib/utils/validators.ts` that warns or rejects when a media string
   is an absolute URL whose host is not in `ALLOWED_REMOTE_IMAGE_HOSTS`. Import the constant from
   `lib/media/remote-image.ts` so there is one list, the way
   `lib/media/remote-image.test.ts` already keeps that list in step with `next.config.mjs`.

Part 1 is a correctness fix and should not wait. Part 2 turns a silent production failure into an
inline form error, which is what makes the field genuinely "replaceable through the admin UI".

### G11. An empty hero ships a gradient

**Change:** `components/shared/editorial-image-hero.tsx:70` should render `MediaFallback` instead of
`bg-brand-deep` plus a gradient overlay, matching the policy that
`components/media/placeholder-policy.test.ts:85` already enforces elsewhere. Optionally make
`heroImage` required in `sitePageSchema` for `status: "published"`, so a page cannot be published
without one. That is the only change in this list that would block an existing workflow, so it needs
John's call.

### G12. Dead types and one dependency inversion

Not blocking, but they make the model harder to reason about:

- `HomepageSection` (:296) has no consumer. Delete.
- `TrainingLandingContent`, `TrainingCatalogContent`, `TrainingEligibilityContent`,
  `TrainingHowItWorksContent` (:542, :555, :572, :594) and their seeds in
  `lib/content/training-config.ts` have no reader. The pages render from `SitePage`. Delete or wire up.
- `components/admin/json-editor.tsx`, `content-hub-page.tsx`, `hub-node-search.tsx`,
  `admin-placeholder.tsx` have no importers.
- `lib/cms/homepage.ts:20-30` imports six content types from `components/`
  (`Announcement`, `FloatingElementsContent`, `MarqueeTickerContent`, `ProgrammeShowcaseItem`,
  `FeaturedStoryContent`, and the three legacy section types). Data contracts owned by presentation
  code, which constitution section 14 names directly. Move them to `types/content.ts` beside
  `HeroSlide`, `JoinCtaCard` and `DonationCampaignContent`, which already live there for this reason
  (see the comments at `types/content.ts:194-200` and `:231-243`). This matters for the redesign
  because every one of those types needs an alt field added (G8), and adding content fields to a
  component file is where the inversion starts to hurt.


## 6. Fallback behaviour

### 6.1 `lib/cms/fallback.ts` is only half the story

`lib/cms/fallback.ts` is 32 lines and exports two functions:

- `resolveCmsArray<T>(value, seed)` (`:21-24`) returns the seed when the value is not an array **or
  is empty**. Its header comment (`:1-20`) records why: an inline `?? []` made `Array.isArray` pass
  on the empty case and skipped the seed, which is how the homepage join-the-movement cards
  disappeared. The rule it encodes is explicit: absent or empty means unconfigured, not deliberately
  empty; sections are hidden with `active: false` on the item, never by emptying the array.
- `resolveCmsValue<T>(value, seed)` (`:30-32`) is a plain `value ?? seed`.

Only `lib/cms/homepage.ts` imports it (`:17`). Every other reader implements its own merge. There
are four distinct strategies in the codebase, and they behave differently for a missing media field.

### 6.2 The four merge strategies

| Strategy | Implementation | Readers using it | Missing top-level media field | Media field missing from a **present** object or array item |
| --- | --- | --- | --- | --- |
| Whole-object replace | `content ?? seed` | homepage.ts:128, :141, :154, :167, :180, :206, :219 | seed value renders | **`undefined`. No seed rescue.** |
| Seed-array replace | `resolveCmsArray` | homepage.ts:89, :115, :193 | seed array renders | **`undefined` on that item.** |
| Shallow spread | `{ ...fallback, ...data }` | impact-pages.ts:55, news-pages.ts:48, partnerships.ts:9, organisations.ts:8-9, initiatives.ts:61-62, :73-74 | seed value renders | **`undefined`. Arrays replace wholesale.** |
| Keyed rebuild | `mergeSitePage` | site-pages.ts:85-112 | seed value renders **only for keys in the list** | **`undefined`, plus unlisted keys are dropped even when present** |

The consequence that matters for a media-led redesign: **the seed only rescues a field when its
entire parent object or array is absent from Firestore.** Once an administrator saves a
`measurementCards` array, an `overviewSection` object or a `heroSlides` array, the seed for every
field inside it stops applying. A card saved without an `image` renders with no image, permanently,
and no fallback path exists.

This is correct behaviour, not a bug. `resolveCmsArray`'s comment states the intent: an editor must
be able to save a deliberate state. But it means the media-completeness guarantee cannot come from
the fallback layer. It has to come from validation and from the editor UI.

### 6.3 What a public page renders when a media field is missing

Verified by reading each render path:

| Missing field | Rendered result | Evidence |
| --- | --- | --- |
| `SitePage.heroImage` | Flat `bg-brand-deep` navy block, 18rem tall, with a dark gradient overlay on top of nothing. Text panel still renders. | components/shared/editorial-image-hero.tsx:70, :84-87 |
| `ContentBlock.image` and `videoUrl` both absent | A considered typographic opening: a large translucent ordinal number beside the prose. Not a broken frame. | components/shared/content-page.tsx:80-94 |
| `ContentBlock.image` absent but `videoUrl` present | Falls through to the story-section branch with `image={section.image}` undefined; `StorySection` passes it to `ContentImage`, which renders `MediaFallback`. | content-page.tsx:117-128, components/content/story-section.tsx, components/media/content-image.tsx:48-58 |
| any `ContentImage` `src` empty | `MediaFallback`, a typographic composition at the same aspect ratio | components/media/content-image.tsx:30, :48-58 |
| `WhatWeDoGalleryItem` with no usable url | `MediaFallback label={item.title}` | components/what-we-do/what-we-do-gallery.tsx:50 |
| `RouteCard.image` | Never rendered anyway; no editor writes it (section 3.1) | - |

**The one path that ships an empty media slot to production is the hero.**
`editorial-image-hero.tsx:70` substitutes a flat navy background plus a gradient overlay when
`imageSrc` is blank. That is exactly the artefact `components/media/placeholder-policy.test.ts:85`
exists to ban ("gradients are standing in for photographs ... Render MediaFallback instead"), and it
is reachable in normal operation:

- `mergeSitePage` uses `asString` (site-pages.ts:81-83), which returns `""` for an empty string, so
  `"" ?? fallback` evaluates to `""`. An administrator who clears the hero image field ships an
  empty hero. Verified.
- `emptyDynamicWhoWeArePage` (site-pages.ts:114-141) and its What We Do counterpart initialise
  `heroImage: ""` (`:123`, `:154`). Every new dynamic page starts with no hero image.
- `sitePageSchema.heroImage` is `optionalTrimmedString` (lib/utils/validators.ts:378), so an empty
  hero passes validation.

A new What We Do page can therefore be created, published and served with a flat navy hero, and
nothing in the pipeline objects.

### 6.4 `resolveImageSrc` and the host allowlist

`lib/media/remote-image.ts` is new in the working tree. `resolveImageSrc(value)` (`:39-53`) returns:

- the value unchanged for a repository-relative path (`:44`),
- `null` for a non-`https` protocol (`:48`),
- the value if `url.hostname` is in `ALLOWED_REMOTE_IMAGE_HOSTS` (`:17-27`), otherwise `null` (`:49`),
- `null` on any parse failure (`:50-52`).

`components/media/remote-image.tsx:40-44` turns that `null` into `MediaFallback`. The docstring at
`:22-27` is explicit about why: an unlisted host used to look like missing content rather than a
configuration gap, and `next/image` refuses an unlisted host with a **runtime throw**, so the
failure reaches a visitor and nobody else.

**The protection is not yet on the CMS paths.** Verified:
`grep -rln "RemoteImage" components app` returns exactly two consumers,
`components/programs/course-detail-card.tsx` and `components/training/training-course-catalog.tsx`,
both course-API surfaces. Every media primitive that renders CMS content calls `next/image`
directly and never consults the allowlist:

| Component | Renders CMS media | Uses `resolveImageSrc` |
| --- | --- | --- |
| components/shared/editorial-image-hero.tsx:74-82 | every `heroImage` on the site | no |
| components/media/content-image.tsx:48-56 | every `ContentBlock` image, via `StorySection` | no |
| components/media/wide-frame.tsx | `ContentPage` treatment 0 | no |
| components/media/circular-figure.tsx | `ContentPage` treatment 1, `JoinCtaCard` | no |
| components/media/portrait-figure.tsx | people content | no |
| components/media/media-band.tsx | full-bleed bands | no |
| components/media/offset-frames.tsx | training overview | no |
| components/shared/partner-directory.tsx | `CmsPartner.logo` | no |
| components/shared/team-directory.tsx | `TeamMemberProfile.photo` | no |
| components/shared/spotlight-card.tsx | spotlight media | no |

So the current behaviour for a CMS image on an unlisted host is the **old** behaviour: a runtime
throw from `next/image` on the public page, not a `MediaFallback`. The new helper fixes the two
course components and leaves every CMS path exposed.

### 6.5 The authoring trap

Every media input in the admin UI is a free-text `<input>` that accepts any string. There is no
upload, no picker, and no host validation. `components/admin/organisation-content-form.tsx:37` states
it outright: "Images accept URL or public-path strings only, there is no upload field."

The allowlist has nine hosts (`lib/media/remote-image.ts:17-27`):
`files.itforyouthghana.org`, `images.unsplash.com`, `firebasestorage.googleapis.com`,
`storage.googleapis.com`, `images.pexels.com`, `tse2.mm.bing.net`, `imarticus.org`,
`img.freepik.com`, `photos.fife.usercontent.google.com`.

An administrator who pastes a URL from anywhere else, a Google Drive share link, a WordPress media
library, a Dropbox link, their own domain, gets:

- a green "saved" confirmation in the admin,
- a passing Zod validation, because every media field is `optionalTrimmedString` with no URL or host
  check anywhere in `lib/utils/validators.ts`,
- a public page that throws at request time on any of the ten components in 6.4.

Every text-input media field listed in section 3 is an instance of this trap. The two highest-risk
ones are `SitePage.heroImage` (site-page-form.tsx:355-362) and `ImpactFeaturedStory.backgroundImage`
(impact-page-form.tsx:333), because both feed `editorial-image-hero.tsx` or a full-bleed background
where the throw takes the whole page down rather than one card.

Also worth naming: `images.unsplash.com` is on the allowlist, which is what makes the design-phase
placeholder photography work. When the organisation replaces those photographs, the replacements
must land on `files.itforyouthghana.org` or `firebasestorage.googleapis.com`, or they will not render.
Nothing in the admin UI communicates that.


## 7. Migration safety

Every proposed addition is an optional field with a sensible absent-value behaviour. No existing
Firestore document becomes invalid and no reader starts throwing. The table states the degradation
path for each.

| Gap | Field(s) added | Optional | Behaviour for a document written before the change | Backfill needed |
| --- | --- | --- | --- | --- |
| G1 | `ContentBlock.image`, `imageAlt`, `videoUrl`, `videoTitle` | yes | `content-page.tsx:82-94` already handles both absent: renders the typographic ordinal opening. This is the current behaviour of every document. | no |
| G2 | `RouteCard.image`, `imageAlt` | yes | `RouteCardGrid` renders text-only tiles, exactly as today. | no |
| G3 | `heroImageAlt` on 13 types | yes | Renderers keep their current hardcoded or title-derived alt as the `??` fallback until an editor sets a value. | no, but see below |
| G4 | `sitePageSchema.heroImageAlt`, `optionalStringFields` entry | yes | Documents have no `heroImageAlt` today because Zod has been stripping it. Reads resolve to the seed, which is the current behaviour. | no |
| G5 | none (wire up or delete) | n/a | Deleting is safe: `merge: true` writes leave orphan fields in Firestore that no reader touches. | no |
| G6 | `ContentBlock.treatment`, `InitiativePage.overviewTreatment`, `WhatWeDoGalleryItem.span` | yes | `undefined` means "let the template decide", so the existing `index % 3` rotation stays the default. Every current document keeps its exact present layout. | no |
| G7 | none | n/a | Fields already exist in the types; only Zod schemas and forms change. | no |
| G8 | `imageAlt` / `backgroundImageAlt` / `logoAlt` on 10 types, `WhatWeDoGalleryItem.alt` | yes | Renderers fall back to the current value: `alt=""`, or `title` for the gallery item. | no |
| G9 | none | n/a | Pure UI replacement of a JSON textarea. Same endpoints, same documents. | no |
| G10 part 1 | none | n/a | `resolveImageSrc` returns repository-relative paths unchanged (`lib/media/remote-image.ts:44`), so `/images/...` values are unaffected. Allowlisted hosts pass through. Only URLs that already throw change behaviour, and they change from a throw to a `MediaFallback`. Strictly an improvement. | no |
| G10 part 2 | Zod refinement | n/a | **This one can reject existing content.** See below. | possibly |
| G11 | `MediaFallback` in the hero | n/a | Pages that currently show a navy gradient start showing a typographic mark. Visible change, no data change. | no |
| G12 | deletions | n/a | Removing dead types and unused components touches no persisted data. Moving types from `components/` to `types/content.ts` is an import-path change only. | no |

### 7.1 The two cases that need care

**G10 part 2, host validation on save.** A refinement that rejects an off-allowlist host will fail
on save for any existing document that already contains one. Before shipping it, run a read-only
audit script over the Firestore collections that extracts every media-field value and reports which
hosts appear. If the report is clean, ship the refinement as a hard error. If it is not, ship it as a
warning first, fix the offending documents, then tighten. Do not ship a hard rejection blind: an
editor discovering it on an unrelated save is the worst way to learn about it.

That audit is deterministic work and belongs in a script, not in a model reply. It also gives the
allowlist a maintenance signal: if a host appears repeatedly in real content, it should probably be
added to `next.config.mjs` and `ALLOWED_REMOTE_IMAGE_HOSTS` rather than fought.

**G3, alt text on 13 types.** No backfill is technically required, because each renderer keeps its
current fallback string. But the current fallback strings are wrong (section 2.2): they describe
photographs that may already have been replaced. The field addition makes the problem *fixable*; it
does not fix it. A content pass writing real alt text for every live hero should be tracked as
editorial work alongside the photography replacement, not silently marked done when the schema lands.

### 7.2 Fields that would need a backfill and are deliberately not proposed

Making `heroImage` required on published pages (mentioned in G11) would invalidate any published
document with an empty hero, including anything created through
`emptyDynamicWhoWeArePage` (lib/cms/site-pages.ts:114-141, `heroImage: ""`) and never filled in. That
needs a survey of live documents first and is flagged as John's decision, not an assumed change.

Making `ContentBlock.image` required would invalidate every existing section. Not proposed: the
typographic opening at `content-page.tsx:80-94` is a deliberate, designed state, and the header
comment says so. An unpaired section should be rare and reviewable, not impossible.

### 7.3 The test that should ship with all of this

One deterministic gate test closes the class of bug behind G4 and G5 permanently:

> For every optional string key in `sitePageSchema` (lib/utils/validators.ts:372), assert the key
> also appears in `optionalStringFields` (lib/cms/site-pages.ts:55). For every media field in
> `types/content.ts`, assert a paired alt field exists or the field is on a documented
> decorative-media allowlist.

Both halves read source, run in milliseconds and need no Firebase, which puts them in the same fast
lane as `lib/cms/coverage.test.ts`. They extend the existing coverage contract from the route level
down to the field level, which is the gap section 3.0 identifies.

