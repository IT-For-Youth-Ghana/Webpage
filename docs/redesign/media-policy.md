# Media policy for the redesign

Status: **Current**. Supersedes the orientation rule in `docs/addendum-media-pairing.md`.

## What changed

The organisation will replace the site's photography before production launch.
Every image now in the repository is therefore design-phase placeholder media
unless it is explicitly identified as final approved content.

That reverses the standing constraint recorded in the media-pairing addendum,
which fixed treatment selection to the shape of the existing library: wide
treatments for programme content because the programme library ran about 30:1
landscape, portrait reserved for people because the people library ran about
16:1 portrait. The library's orientation mix is no longer an input to layout.

Ask what image makes the composition and the story work, then build that slot
and fill it. Do not ask what image happens to be available.

## The rule that did not change

Every substantive text block on a public page sits in a real visual
relationship with photography, video, data, a pathway, a diagram, or another
content-bearing visual form. Missing photography is no longer an excuse for an
unfinished section, because a placeholder is always available.

## Filling a slot

Unsplash is sanctioned for programme and contextual imagery: young people
learning technology, coding sessions, computer laboratories, collaborative
learning, mentorship, STEM and robotics activity, entrepreneurship, community
programmes, schools, facilitators working with learners, technology workspaces,
rural and community environments, institutional meetings and events.

Prefer documentary photographs of genuine human activity over glossy staged
studio work. Prefer Ghanaian or West African context where a suitable image
exists. Do not put a laptop in every frame: mentorship, community, confidence,
collaboration and opportunity are equally the subject.

Vary the register. Close portraits, small-group activity, wide environmental
scenes, over-the-shoulder views, mentoring interactions, presentation moments,
workspace details, quiet individual concentration and large cohort moments
should all appear. Five near-identical "students at laptops" frames make the
site read as a stock catalogue.

`images.unsplash.com` is already in `next.config.mjs` `remotePatterns`. Route
every externally sourced image through `lib/media/remote-image.ts` and render it
with `components/media/remote-image.tsx`, never with a bare `<img>`.

## What may never appear in a media slot

An empty grey rectangle, a gradient standing in for a photograph, a coloured
block labelled "image", a meaningless abstract shape, a blank container, a fake
SVG illustration, a stock icon, or an unfinished slot.

`public/images/fallback/placeholder.svg`, a grey box reading "Image
placeholder" in Arial, has been deleted for this reason.
`components/media/media-fallback.tsx` is the only sanctioned empty-media
treatment: a considered typographic composition at the exact proportions the
real photograph will occupy. `scripts/media-pairing.mjs` detects gradient
substitutes and `components/media/placeholder-policy.test.ts` fails the suite
when one appears.

## Identity-sensitive slots

Never place an unrelated stock face in a slot that claims to represent a
specific named person: team members, testimonial authors, named graduates,
named beneficiaries, founders, staff profiles, speakers. Never substitute a
random logo for a named organisation or partner.

Use the real asset, or a monogram, initials, or name-led editorial typography
via `MediaFallback` with `variant="monogram"`. Design the slot around the
proportions of the portrait that will eventually arrive.

## Alt text

Describe what the photograph actually depicts in the context of the layout.
`Young people working together on laptops during a collaborative technology
training session` is right. `ITFYG Youth Academy Cohort 8` is wrong unless the
photograph genuinely depicts that cohort, and a placeholder never does.

Do not restate the adjacent heading. Mark decorative graphic forms
`aria-hidden`. Give video an accessible label. Never autoplay with sound.

## The registry

`docs/redesign/placeholder-media.json` records every externally sourced
placeholder: route, section, url, orientation, role, and a description of the
final ITFYG photograph that should replace it. It is a replacement map, not an
asset audit.

`lib/content/placeholder-registry.test.ts` fails when application source
contains an external image URL with no entry, so the map cannot drift out of
date silently.

## Explicitly out of scope

No media inventory, media gap analysis, image-reuse report, photography
commissioning analysis, orientation report, filename report or asset
optimisation inventory. `docs/audit/media-inventory.md` is retained as history
and is not to be extended.
