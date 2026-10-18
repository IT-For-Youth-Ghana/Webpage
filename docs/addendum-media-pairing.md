# Addendum: Media-Paired Editorial Rule

Status: **Superseded** by `docs/redesign/media-policy.md`.

The media-paired editorial rule itself still stands and is restated in the
current policy. What is superseded is everything this document says about
designing around the existing image library: the standing orientation
constraint, the discovery and inventory pass, and the gap analysis. All site
photography is now design-phase placeholder media and Unsplash fills any
orientation the library lacks. Read the current policy instead.

This is a follow-up to the ITFYG redesign brief. Apply it alongside that brief,
not instead of it. Everything in the original brief still holds: the capsule
design language, paragraphs rather than bullets, no icons, modular components,
CMS-driven content, and real assets over placeholders.

This addendum adds one rule that was missing from the original brief.

## The rule

Every substantive text block on a public page should be paired with a visual: a
photograph, a video, or a purposeful graphic form. The site should read like a
magazine feature rather than a document with occasional illustrations. A visitor
scrolling any page should never pass through a long stretch of unbroken prose
without something to look at that carries meaning of its own.

This is the organisation's founding requirement for the redesign and it takes
priority over layout convenience. If a section cannot be paired with a visual,
that is a signal the section may not deserve its own block, and merging it into
an adjacent section is usually the right answer.

## What counts as a pairing

A real photograph from `/images/randomPictures/`, `/images/people/`, or
`/images/partnerorga/` is the strongest option and should be the default. Real
video, including the existing featured story video and any programme footage, is
equally strong where it exists. A purposeful graphic form counts when it encodes
real structure rather than decorating, meaning something like the pathway tree,
an arc representing a real sequence, a data visualisation drawn from real
numbers, or a capsule interaction that reveals real content.

What does not count: abstract gradient blocks with no content, decorative shapes
that carry no meaning, stock-feeling imagery unrelated to the actual programme,
icons, or an image repeated across multiple sections to fill space.

## Discovery, before any pairing work begins

Do not start pairing sections until you know what you have and what you need.
This discovery pass depends on the route list produced under the CMS addendum,
so run that first and reuse its output rather than enumerating routes a second
time.

Inventory the available assets, recording for each file its path, its dimensions
and orientation, its rough subject matter, and where in the codebase it is
already referenced. Note any file that is very large and will need optimisation,
and any file whose name is a generic download string rather than a description.

Inventory the existing usage. For every section on every public route, record
whether it currently has paired media, what that media is, and whether the
pairing is real content or a placeholder left over from earlier work. Mark reuse
explicitly, naming any asset that appears on more than one page.

Then produce the gap analysis, which is the actual deliverable. Report the
totals: how many sections need media, how many can be served from existing
assets, and how many represent a genuine content gap the organisation must
fill. That last number is a commissioning brief for the client, not a blocker.

Discovery is automated in this repository. Run:

```bash
node scripts/discover-routes.mjs     # route list, the prerequisite
node scripts/inventory-assets.mjs    # assets, with orientation per directory
node scripts/media-pairing.mjs       # which sections are paired
node scripts/generate-audit-docs.mjs # regenerates docs/audit/
```

### Standing constraint: programme content reads wide, people content reads tall

The asset inventory established that the library is lopsided by subject, and
this is now a fixed constraint on treatment selection rather than an observation.

**Programme photography is roughly 30:1 landscape.** Programme content therefore
gets wide treatments:

- full-bleed bands
- wide capsules
- landscape media above a text column
- stacked offset landscape frames, where vertical mass is needed

**Portrait layouts are reserved for people content**, where the library runs
about 16:1 in portrait's favour and portrait is the honest shape for the
subject: team profiles, named testimonials, and graduate stories.

**The capsule is unaffected by the split.** Its circular media form crops
cleanly from either orientation, so the capsule treatment is always available
regardless of which library a section draws from.

Two consequences for how gaps are reported:

1. A section may only be escalated as a genuine content gap after a **wide**
   treatment and a **circular** treatment have both been tried and genuinely
   fail. "No suitable image exists" is not a finding until those are exhausted,
   because the wide library is large and the circular crop is
   orientation-agnostic.
2. Never reuse a programme photograph across unrelated initiatives to close a
   gap. Repetition is invisible when reviewing one page at a time and obvious to
   a visitor browsing the site, and pairing one programme's photograph with
   another programme's copy misrepresents the work.

Designing a layout that needs tall programme media and only then discovering the
library has one portrait programme photograph wastes the design. Check
orientation first; it is cheaper than redesigning.

## Applying it without making pages monotonous

The failure mode here is obvious and worth naming: forty sections that each
alternate image-left, image-right, image-left down the entire page. That
satisfies the letter of the rule and produces something exhausting to scroll.

Vary the relationship between text and media deliberately. Some sections want a
full-bleed image with text overlaid. Some want the capsule treatment where a
circular media form and its text merge into one continuous shape. Some want a
portrait image beside a short paragraph, others a wide landscape image above a
longer one. Some want a small cluster of images against one text block, or one
image spanning several related paragraphs. Some want the media to be
interactive, revealing text on hover or focus.

Rhythm matters as much as coverage. Aim for a page that changes its pacing every
few sections rather than settling into one repeated arrangement. **If two
adjacent sections would use the same treatment, change one of them.**

## Where the content model already supports this

Several content types already carry media fields, including `heroImage`,
`overviewImage`, `image`, `coverImage`, `avatar`, `logo`, and `galleryItems`
with both image and video types. The initiative pages, story sections,
testimonials, articles, partners, and team profiles are all already
media-aware.

Where a content type has text but no media field, extend the schema to add one,
update the corresponding admin editor in the same change, and provide a
sensible fallback for records where the field is empty. A missing image should
degrade to a considered typographic treatment, never to a broken image or an
empty box.

## Alt text and accessibility

Every image needs alt text describing what is actually happening in the
photograph, not a restatement of the adjacent heading. Decorative graphic forms
that duplicate adjacent text should be marked `aria-hidden` rather than given
redundant alt text. Video needs an accessible label and must not autoplay with
sound.

## Consent and representation

These are photographs of real young people, many of them minors in school
settings. Do not crop, filter, or recompose images in ways that change their
meaning. Do not pair a photograph of identifiable individuals with copy that
makes claims about those specific individuals unless the repository already
makes that connection. Where a testimonial has a named person and an avatar,
keep them together. Where a general programme photo is used beside outcome
statistics, make sure the layout does not imply the people pictured are the
subjects of those statistics.

## Verification

A page is not finished under this addendum until you can scroll it and confirm
no text block sits alone without a paired visual, no treatment repeats twice in a
row, every image resolves to a real asset that exists in the repository, every
image has meaningful alt text, and the page still holds together at mobile width
where side-by-side pairings collapse into stacks.

State explicitly which sections you could not pair and why, rather than quietly
leaving them bare.
