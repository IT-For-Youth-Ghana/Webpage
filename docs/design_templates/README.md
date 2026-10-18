# ITFYG editorial HTML concepts

Status: **Current reference for layout.** Not legacy, and not a colour reference.

Nine standalone responsive HTML concepts for the public site, plus `index.html`
as a launcher. Open any file directly in a browser.

1. `01-homepage.html` — magazine cover
2. `02-who-we-are.html` — organisation profile
3. `03-what-we-do.html` — programme portfolio
4. `04-departments.html` — organisation ecosystem
5. `05-apply-for-training.html` — pathway into opportunity
6. `06-for-organisations.html` — institutional partnership
7. `07-partner-with-us.html` — partnership ecosystem
8. `08-our-impact.html` — data story
9. `09-news-and-updates.html` — digital magazine

## What to take, and what not to

Take the layout: section sequence and rhythm, capsule geometry, the type scale,
intentional asymmetry, media proportions, and how each composition collapses at
1040px, 820px and 620px.

Do not take the colours. These concepts are drawn in the brief's navy `#0C2D5A`,
gold `#F5A623` and teal `#157F6B`. The site's palette is the logo's: blue
`#1E72BA` and crimson `#D70B52`, with deep `#142850`. The organisation's mark
uses blue and crimson and contains no gold or teal, so a composition adopted
from these files is recoloured to the implemented tokens. See
`docs/redesign/progress.md` for the decision and its evidence.

`types/page-sections.ts` arrived alongside these concepts and its
`PageSectionTheme` enum still lists `teal` and `gold`. It is reconciled with the
implemented palette during implementation, not treated as settled contract.

Photography here is temporary Unsplash placeholder media, consistent with
`docs/redesign/media-policy.md`. Copy and statistics in the concepts are
design-phase text; the real organisational figures and language are
authoritative.

Distinct from `docs/design_iu_examples/`, which is legacy and must not be used.
