# IT For Youth Ghana — Website Redesign & Architectural Restructure

## Master Prompt

I want to redesign and restructure the entire IT For Youth Ghana Next.js website based on the client's latest design direction.

This is not just a cosmetic CSS update.

Treat this as a full frontend design-system and component-architecture refactor, while preserving existing functionality, content, routing, API integrations, authentication, and business logic.

The visual direction should be inspired by the storytelling and editorial structure of the CAMFED Women's Leadership page:

https://camfed.org/why-girls-education/womens-leadership/

Do not copy CAMFED's code, proprietary assets, exact layouts, or branding.

Use it only as design inspiration for visual language, storytelling structure, spacing, typography hierarchy, image usage, video usage, and content presentation.

---

# 1. Core Design Direction

The current website feels too:

- Text-heavy
- Card-heavy
- Repetitive
- Small in typography
- Dependent on text-only sections
- Visually flat
- Overly pill-shaped
- Inconsistent between pages

The new website should feel:

**Editorial + Human + Modern + NGO/Impact-focused + Visual + Premium + Accessible**

The website should tell stories through:

> Text + Photography + Video + Statistics + Color + Layout

rather than:

> Text + Card + Text + Card + Text

---

# 2. Audit the Entire Website

Do not redesign only the page currently being viewed.

Audit every page in the project.

For every page, identify:

- Hero section
- Introduction section
- Statistics
- Feature sections
- Cards
- Testimonials
- Quotes
- Service areas
- Programs
- Impact sections
- Calls to action
- Videos
- Images
- Resource sections
- News/blog sections
- Forms
- Navigation
- Footer

Determine how each section can be transformed into the new visual system.

---

# 3. Visual Storytelling

The client specifically wants:

> "inserting pictures, video links across part of each page elements beside texts"

Therefore, text should no longer dominate the page.

Whenever a section contains meaningful content, consider whether it should have:

- An image
- A video
- A video thumbnail
- An image collage
- A portrait
- An illustration
- A statistic visualization
- A decorative image

The general principle should be:

**TEXT + VISUAL**

rather than:

**TEXT + TEXT + TEXT**

---

# 4. Every Major Card Should Have Visual Content

The client specifically requested:

> "let every card have an image"

Audit every card component.

Text-only cards should generally be converted into an image-led structure:

```text
┌─────────────────────────────┐
│                             │
│           IMAGE             │
│                             │
├─────────────────────────────┤
│ CATEGORY                    │
│                             │
│ Large editorial heading     │
│                             │
│ Short description           │
│                             │
│ [ READ MORE ]               │
└─────────────────────────────┘
```

However, do not force images into places where an image would make the content worse.

For genuinely informational UI such as statistics, filters, forms, navigation, and compact data displays, use appropriate UI patterns.

---

# 5. Alternating Storytelling Sections

Introduce a reusable section pattern for storytelling.

For example:

```text
┌─────────────────────┬─────────────────────┐
│                     │                     │
│       IMAGE         │       TEXT          │
│                     │                     │
│                     │       HEADING       │
│                     │                     │
│                     │       PARAGRAPH     │
│                     │                     │
│                     │       BUTTON        │
└─────────────────────┴─────────────────────┘
```

Then alternate:

```text
IMAGE | TEXT
TEXT  | IMAGE
IMAGE | TEXT
TEXT  | IMAGE
```

Create a reusable component such as:

```tsx
<StorySection
  image="..."
  eyebrow="..."
  title="..."
  description="..."
  action="..."
  imagePosition="left"
/>
```

or:

```tsx
<StorySection imagePosition="right" />
```

This should become one of the primary storytelling components throughout the site.

---

# 6. Hero Sections

Hero sections should become much more visual.

Avoid:

```text
Large heading
Large paragraph
Three buttons
Empty space
```

Prefer:

```text
┌──────────────────────────────────────────────┐
│                                              │
│  TEXT                         IMAGE / VIDEO   │
│                                              │
│  EYEBROW                                     │
│  Large heading                               │
│  Supporting text                             │
│                                              │
│  [PRIMARY CTA] [SECONDARY CTA]               │
│                                              │
└──────────────────────────────────────────────┘
```

Possible hero media:

- Photography
- Video
- Video thumbnail
- Image collage
- Circular portrait
- Organizational activity photograph

Hero media should have strong visual impact.

---

# 7. Redesign the Current Stats Section

Using the current page as an example:

The current structure places the introduction text beside four statistics cards.

The client wants the statistics moved lower in the storytelling sequence, with the space currently occupied by the statistics becoming visual content.

Restructure the section conceptually as:

```text
┌──────────────────────────────────────────────┐
│                                              │
│ TEXT                         VIDEO / IMAGE    │
│                                              │
│ Heading                                      │
│ Paragraph                                    │
│                                              │
│ [CTA]                                        │
│                                              │
└──────────────────────────────────────────────┘


┌──────────────────────────────────────────────┐
│                                              │
│                 STATISTICS                   │
│                                              │
│  3000+       8500+       40%       85%       │
│                                              │
└──────────────────────────────────────────────┘
```

The statistics should feel like part of the story rather than a dashboard.

---

# 8. Stats Should Not Feel Like Dashboard Cards

The current statistics look too much like four independent dashboard cards.

Instead, explore a stronger editorial presentation:

```text
3,000+
Youth trained

8,500+
Students reached

40%
Female participation

85%
Employment rate
```

Use spacing, typography, subtle dividers, background blocks, or a shared statistic layout.

The numbers should be visually dominant.

---

# 9. Convert Bullet Lists Into Paragraphs

The client explicitly said:

> "All these bullets needs to become one paragraph"

Where the current design contains statements such as:

- Introductions can be framed around role fit and learning trajectory.
- Useful for teams willing to invest in emerging talent potential.
- Supports a more relational approach to hiring conversations.

Convert them into a coherent paragraph.

Do not simply remove the bullet symbols.

Rewrite the presentation so it reads naturally while preserving the original meaning.

Do not invent new claims.

---

# 10. Make Section Content More Editorial

For sections such as "Talent introduction", instead of:

```text
Title

Paragraph

Bullet card
Bullet card
Bullet card
```

use:

```text
IMAGE / VIDEO

CATEGORY

Talent introduction

Large supporting paragraph describing the service.

[Learn more]
```

Then use supporting imagery or a secondary visual block.

---

# 11. Employer Need Alignment

The current:

```text
Title
Paragraph
Three bullet cards
```

should become a stronger storytelling section.

For example:

```text
┌──────────────────────┬──────────────────────┐
│                      │                      │
│       IMAGE          │ Employer need        │
│                      │ alignment            │
│                      │                      │
│                      │ Paragraph            │
│                      │                      │
│                      │ [Learn more]         │
└──────────────────────┴──────────────────────┘
```

The existing bullet points should be integrated into the paragraph/content rather than displayed as separate cards.

---

# 12. Button System

The client specifically wants:

> WHITE ON PINK  
> WHITE ON BLUE  
> AND THE VICE VERSA

Create a centralized button system.

Do not style buttons individually on pages.

Create controlled variants such as:

```tsx
<Button variant="pink" />
<Button variant="blue" />
<Button variant="pink-outline" />
<Button variant="blue-outline" />
<Button variant="white" />
<Button variant="white-outline" />
```

Keep the number of variants controlled.

### Pink background

- Pink background
- White text

### Blue background

- Blue background
- White text

### Pink outline

- Light/white background
- Pink border
- Pink text

### Blue outline

- Light/white background
- Blue border
- Blue text

Buttons should be:

- Larger
- More readable
- Rectangular
- Confident
- Consistent
- Accessible

Avoid excessive pill-shaped buttons.

---

# 13. Button Shape

Move away from the current overly rounded/pill aesthetic.

Prefer modestly rounded rectangular buttons:

```text
┌─────────────────────┐
│     Learn more      │
└─────────────────────┘
```

rather than fully pill-shaped buttons.

---

# 14. Increase Typography

The client explicitly wants the text larger.

Audit the typography system globally.

Do not randomly increase individual elements.

Create a proper type scale:

- Display
- Hero
- H1
- H2
- H3
- Body Large
- Body
- Body Small
- Caption
- Button

Headings should be significantly more prominent.

Body text should also be comfortably readable.

Avoid tiny paragraph text.

---

# 15. Editorial Typography

Introduce a typography system inspired by modern editorial/NGO websites.

Use:

### Display / Headings

A strong serif or editorial display typeface.

### Body

A clean sans-serif typeface.

This creates:

**SERIF HEADINGS + SANS-SERIF BODY**

rather than using the same sans-serif style everywhere.

Do not hardcode font-family values throughout components.

Define typography centrally.

---

# 16. Card System

Create a shared card architecture.

Cards should support only meaningful variants, for example:

```tsx
<Card variant="image" />
<Card variant="feature" />
<Card variant="story" />
<Card variant="resource" />
<Card variant="stat" />
```

Do not create unnecessary variants.

The standard visual storytelling card should generally contain:

```text
Image
↓
Category
↓
Heading
↓
Short excerpt
↓
CTA
```

---

# 17. Image System

Create a reusable image component.

It should standardize:

- Aspect ratios
- Object-fit
- Border radius
- Responsive behavior
- Lazy loading where appropriate
- Image positioning
- Hover behavior
- Overlays where required

For example:

```tsx
<ContentImage
  src={...}
  alt={...}
  aspectRatio="landscape"
/>
```

Do not implement image styling independently in every page.

---

# 18. Video System

Create a reusable video presentation component.

It should support:

```tsx
<VideoCard
  thumbnail={...}
  videoUrl={...}
  title={...}
/>
```

and potentially:

```tsx
<VideoSection
  videoUrl={...}
  title={...}
  description={...}
/>
```

Video should be presented as a proper visual storytelling element.

Do not simply place raw YouTube/Vimeo URLs inside paragraphs.

---

# 19. Centralized Color System

Create a centralized color system.

At minimum define:

- Primary Pink
- Primary Blue
- Dark Navy
- White
- Off White
- Light Blue
- Light Pink
- Text Primary
- Text Secondary
- Border
- Success
- Warning
- Error

Do not hardcode colors throughout pages.

Use design tokens/theme variables.

For example:

```text
--color-primary
--color-secondary
--color-accent
--color-background
--color-surface
--color-text
--color-muted
```

---

# 20. Color-Blocked Sections

Introduce occasional full-width color sections to create rhythm.

For example:

```text
WHITE
↓
LIGHT BLUE
↓
WHITE
↓
PINK
↓
WHITE
↓
BLUE
```

Use this strategically.

Do not turn the entire website into colored cards.

The goal is visual rhythm.

---

# 21. Circular Image Treatment

For selected:

- Testimonials
- Leadership stories
- CTA sections
- Human-interest sections

allow circular or organically cropped images.

This should be a reusable image variant, not custom CSS on individual pages.

---

# 22. Remove the "Everything Is a Card" Problem

Not every piece of information needs to be inside a bordered rounded card.

Use a mixture of:

- Editorial sections
- Full-width color blocks
- Image/text layouts
- Statistics
- Quotes
- Cards
- Media blocks
- Large typography
- White space

The page should breathe.

---

# 23. Quote / Testimonial System

Create a proper editorial quote component.

For example:

```text
“Large quotation goes here.”

Person Name
Role / Organization

[PHOTO]
```

Create a reusable:

```tsx
<QuoteBlock />
```

component.

---

# 24. Section Spacing

Increase vertical spacing between major sections.

The website should feel spacious and intentional.

Avoid sections being stacked with almost no breathing room.

Use consistent design tokens such as:

```text
section-sm
section-md
section-lg
section-xl
```

---

# 25. Responsive Design

Everything must work on:

- Mobile
- Tablet
- Desktop
- Large desktop

The 50/50 layouts should stack naturally on mobile:

```text
IMAGE
TEXT
```

or:

```text
TEXT
IMAGE
```

Do not allow desktop designs to simply shrink on mobile.

Design responsive behavior intentionally.

---

# 26. Component Architecture

Create or refactor reusable components such as:

```text
components/
├── ui/
│   ├── Button
│   ├── Badge
│   ├── Container
│   ├── Section
│   └── ...
│
├── media/
│   ├── ContentImage
│   ├── VideoCard
│   └── MediaBlock
│
├── content/
│   ├── StorySection
│   ├── FeatureCard
│   ├── ResourceCard
│   ├── QuoteBlock
│   └── StatBlock
│
├── layout/
│   ├── Header
│   ├── Footer
│   ├── PageContainer
│   └── PageHeader
│
└── sections/
    ├── HeroSection
    ├── StatsSection
    ├── CTASection
    └── ...
```

Adapt this to the existing project.

Do not blindly create every file listed above.

---

# 27. Data-Driven Content

Do not hardcode repeated cards directly into JSX.

Use data structures.

For example:

```tsx
const services = [
  {
    title: "...",
    description: "...",
    image: "...",
    category: "...",
    href: "..."
  },
  ...
];
```

Then:

```tsx
{services.map((service) => (
  <FeatureCard
    key={service.title}
    {...service}
  />
))}
```

This allows the same component to be reused across pages.

---

# 28. No Page-Specific CSS Duplication

This is one of the highest priorities.

Find CSS that is repeated across pages and determine whether it actually represents a shared pattern.

If it does:

**move it into the shared design system/components.**

Pages should primarily define:

**CONTENT + LAYOUT COMPOSITION**

rather than:

**CONTENT + LAYOUT + COLORS + TYPOGRAPHY + BUTTON STYLES + CARD STYLES + IMAGE STYLES + RESPONSIVE CSS**

---

# 29. No Hardcoded Design Values

Do not scatter arbitrary values throughout individual pages.

Avoid unnecessary hardcoded:

- Font sizes
- Colors
- Border radiuses
- Spacing
- Shadows
- Breakpoints
- Component heights

Centralize design decisions.

The goal is:

```text
Design Token
     ↓
Shared Component
     ↓
Every Page
```

---

# 30. Page Structure After Redesign

Each page should conceptually follow a storytelling structure such as:

```text
Header

Hero
 ├── Text
 └── Image / Video

Introduction
 ├── Text
 └── Image

Story Section
 ├── Image
 └── Text

Story Section
 ├── Text
 └── Image

Statistics
 └── Large numbers

Feature / Service Section
 ├── Image Card
 ├── Image Card
 └── Image Card

Testimonial / Quote
 ├── Photo
 └── Quote

Additional Story
 ├── Image
 └── Text

CTA
 ├── Visual
 └── Action

Footer
```

Do not force every page into exactly this structure.

Use it as the overall storytelling language.

---

# 31. Preserve Content

Do not arbitrarily rewrite the client's content.

Where the current content is presented as bullets and the client specifically wants paragraphs, restructure the presentation while preserving the meaning.

Where content is too long for the new design, identify appropriate places for:

- Excerpts
- "Read more"
- Dedicated detail pages
- Expandable content

Do not delete important information simply to make the page visually shorter.

---

# 32. Do Not Invent Images

If actual image assets already exist in the project:

**Reuse them.**

If the project contains image placeholders:

make the component architecture ready for the images.

If appropriate images do not yet exist, use a clearly defined placeholder/media slot rather than randomly selecting unrelated images.

Do not download or embed random copyrighted images simply to fill space.

---

# 33. Client Feedback → Technical Requirements

### "Stats can be moved down"

Create a reusable `StatsSection` that can be positioned independently from introduction/hero content.

### "That space will be a video link"

Create reusable `VideoCard` / `VideoSection`.

### "The under the stats will also be on a side with something"

Use alternating media/content layouts.

### "All these bullets needs to become one paragraph"

Replace bullet-card presentations with editorial paragraph content.

### "WHITE on PINK, WHITE on BLUE and vice versa"

Create centralized button variants.

### "These should be bigger"

Create a global typography and component sizing system.

### "Increase all text sizes"

Establish a new global type scale.

### "Pictures/video links across each page"

Introduce media-driven storytelling sections.

### "Every card have an image"

Create image-first card architecture.

### "Replicate CAMFED designs"

Adopt CAMFED-inspired editorial storytelling principles while maintaining IT For Youth Ghana's own branding and identity.

---

# 34. Preserve Existing Functionality

The redesign must preserve:

- Routing
- Navigation
- Authentication
- Forms
- API calls
- Data fetching
- Backend integrations
- Buttons/actions
- Links
- Dynamic content
- SEO
- Metadata
- Accessibility
- Responsive behavior

Do not rewrite backend functionality.

Do not modify API contracts unless absolutely necessary.

Do not introduce unrelated features.

---

# 35. Refactor in Phases

Do not attempt a chaotic all-at-once rewrite.

## Phase 1 — Audit

Inspect the entire project.

Identify:

- Duplicate components
- Duplicate CSS
- Hardcoded design values
- Repeated layouts
- Existing media
- Existing design tokens
- Existing UI components

## Phase 2 — Design System

Establish:

- Typography
- Colors
- Spacing
- Buttons
- Containers
- Cards
- Image treatment
- Video treatment
- Responsive breakpoints

## Phase 3 — Shared Components

Create/refactor:

- Button
- Card
- Image
- Video
- StorySection
- Stats
- Quote
- CTA
- PageHeader
- Section

## Phase 4 — Page Migration

Migrate every page to the shared system.

## Phase 5 — CSS Cleanup

Remove duplicated page CSS and obsolete styles.

## Phase 6 — Responsive Pass

Test every page at:

- 375px
- 768px
- 1024px
- 1440px+

## Phase 7 — Verification

Run:

- TypeScript
- ESLint
- Tests
- Production build

Fix all errors introduced by the refactor.

---

# 36. Final Quality Standard

When the redesign is complete, I should be able to change something globally.

For example:

> "Make all buttons slightly taller."

This should require changing one shared component/token rather than editing 15 pages.

Similarly:

> "Increase all heading sizes."

should be a typography-system change.

> "Change the pink."

should be a design-token change.

> "All cards should use a 4:3 image."

should be a shared card/media change.

That is the architecture required.

---

# Final Design Principle

The website should no longer feel like a collection of independently designed pages.

It should feel like **one coherent digital product**.

The architecture should be:

```text
                    DESIGN SYSTEM
                         │
             ┌───────────┴───────────┐
             │                       │
        UI COMPONENTS           MEDIA SYSTEM
             │                       │
             └───────────┬───────────┘
                         │
                 SHARED SECTIONS
                         │
                  PAGE COMPOSITION
                         │
                   PAGE CONTENT
```

And visually:

```text
        TYPOGRAPHY
             +
         PHOTOGRAPHY
             +
           VIDEO
             +
          STORIES
             +
         STATISTICS
             +
          COLOR
             +
        WHITE SPACE
             +
       STRONG CTAs
```

The pages should tell the organization's story visually, not simply display information.

The final result should feel **human, editorial, credible, modern, African/NGO-oriented, and premium**, while still clearly belonging to **IT For Youth Ghana** rather than looking like a copy of another organization's website.
