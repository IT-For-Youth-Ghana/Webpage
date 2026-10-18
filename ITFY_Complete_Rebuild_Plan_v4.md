# IT For Youth Ghana — Full Website Rebuild Plan
## Stunning NGO Site + Firebase Admin CMS
> Version 4.0 | April 2026 | Definitive Implementation Document

---

## TABLE OF CONTENTS

1. [Site Experience Vision](#1-site-experience-vision)
2. [Final Navigation (v3 — Authoritative)](#2-final-navigation)
3. [Homepage — Full Feature Spec](#3-homepage-full-feature-spec)
4. [Interior Page Features](#4-interior-page-features)
5. [Component Library](#5-component-library)
6. [Admin Panel — Complete CMS Spec](#6-admin-panel-complete-cms-spec)
7. [Firebase Data Schema](#7-firebase-data-schema)
8. [Complete App Router Directory](#8-complete-app-router-directory)
9. [Technology Stack](#9-technology-stack)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. SITE EXPERIENCE VISION

### Reference Tier: Best-in-Class NGO Sites

The site should feel like a combination of:
- **UNICEF** — bold typographic impact, clean data storytelling
- **charity: water** — cinematic imagery, emotional narrative, donation urgency
- **Room to Read** — warm, human, programme-driven storytelling
- **Teach For America** — strong CTAs, movement energy, career/volunteer pull
- **TechBridge** — tech-forward NGO aesthetic that doesn't feel cold

### Design Language

```
Tone:           Warm authority — we know what we're doing AND we care deeply
Typography:     Plus Jakarta Sans (headings) + DM Sans (body) — confident, modern
Colour:         Deep navy (#0c2d5a) primary + gold (#F5A623) accent + warm white
Motion:         Purposeful — every animation communicates, nothing decorates
Photography:    Real students, real moments, real Ghana — never stock
Layout:         Generous whitespace, bold section breaks, asymmetric grids
```

### Must-Have "Wow" Features

| Feature | Purpose | Admin Editable |
|---------|---------|----------------|
| Full-screen hero slideshow | First impression, programme showcase | ✅ Full CRUD |
| Animated impact counter | Instant credibility, real numbers | ✅ Edit values |
| Announcement banner | Time-sensitive news, events, alerts | ✅ Toggle + schedule |
| Ticker/marquee strip | Partner logos, live stats, news | ✅ Content + speed |
| Donation progress bar | Campaign fundraising urgency | ✅ Target + current |
| Programme cards (hover video) | What We Do — visceral engagement | ✅ Content |
| Testimonial carousel | Social proof, human stories | ✅ Full CRUD |
| Live news feed | Freshness signal, credibility | ✅ CRUD |
| SDG alignment visual | Donor credibility, grant appeal | ✅ Mapping |
| Newsletter popup (exit-intent) | Lead capture | ✅ Toggle + content |
| Floating donate CTA | Always-visible giving path | ✅ Toggle |
| Instagram/social embed strip | Community feel, social proof | ✅ Handle |
| Interactive impact map | Geographic reach visualisation | ✅ Data points |
| Video modal embed | Emotional storytelling | ✅ URL |
| Event/cohort countdown | Urgency for applications | ✅ Date |

---

## 2. FINAL NAVIGATION (v3 — AUTHORITATIVE)

> This replaces ALL previous navigation documents. Do not reference v1 or v2.

```
HOME  /

WHO WE ARE  /who-we-are
  About Us          /who-we-are
  Our Team          /who-we-are/team
  Our Partners      /who-we-are/partners
  Join Our Team     /who-we-are/careers

WHAT WE DO  /what-we-do
  Girls in Tech          /what-we-do/girls-in-tech
  Youth Tech Academy     /what-we-do/youth-academy
  Entrepreneurship Hub   /what-we-do/entrepreneurship-hub
  Code Impact Challenge  /what-we-do/code-impact-challenge
  Rural Tech Connect     /what-we-do/rural-tech-connect
  Community Outreach     /what-we-do/community-outreach
  Advocacy               /what-we-do/advocacy
  Tech Clubs             /what-we-do/tech-clubs

APPLY FOR TRAINING  /apply-for-training
  Who Can Apply    /apply-for-training/who-can-apply
  Browse Courses   /apply-for-training/courses
  How It Works     /apply-for-training/how-it-works

FOR ORGANISATIONS  /for-organisations
  Corporate Training    /for-organisations/corporate-training
  Sponsorships          /for-organisations/sponsorships
  Hire Our Graduates    /for-organisations/hire-graduates
  Staff Volunteering    /for-organisations/staff-volunteering

PARTNER WITH US  /partner-with-us
  Educational Institutions   /partner-with-us/educational
  Government                 /partner-with-us/government
  NGOs & Foundations         /partner-with-us/ngo-foundations
  International Development  /partner-with-us/international-development
  Technology Companies       /partner-with-us/technology

OUR IMPACT  /our-impact/reports
  Impact Reports    /our-impact/reports
  Testimonials      /our-impact/testimonials
  UN SDGs           /our-impact/sdgs

NEWS & UPDATES  /news-and-updates
  News    /news-and-updates/news
  Blogs   /news-and-updates/blogs

CONTACT  /contact
[DONATE]  /donate   ← accent-coloured button
```

---

## 3. HOMEPAGE — FULL FEATURE SPEC

The homepage is assembled from **13 named sections**. Each section is independently toggled and reordered from the admin panel.

### Section 01: Announcement Banner
```
Position:       Top of page, above navigation
Type:           Full-width dismissible strip
Variants:       info (blue) | success (green) | urgent (amber) | alert (red)
Features:       Rich text, optional CTA link, countdown timer, close button
Animation:      Slide down from top on page load
Admin controls: text, variant, CTA label, CTA URL, start date, end date,
                show/hide toggle, countdown target date
```

**Behaviour**: If `endDate` has passed, the banner auto-hides. The "X" button sets a localStorage key — dismissed banners don't re-appear for 24h.

---

### Section 02: Hero Slideshow
```
Position:       Full viewport height, below nav
Type:           Full-bleed image/video slideshow with overlaid content
Slides:         3–6 slides (admin configurable)
Transition:     Ken Burns pan on still images, crossfade between slides
Auto-advance:   6 seconds (pauses on hover/touch)
```

**Per-slide content (all admin editable):**
```
- Background: image URL (Firebase Storage) OR YouTube/Vimeo video URL
- Overlay opacity: 0–80% (slider)
- Eyebrow label: e.g. "Now Enrolling — Cohort 7"
- Main headline: large, bold, max 60 chars
- Subheadline: supporting copy, max 120 chars
- Primary CTA: label + URL
- Secondary CTA: label + URL (optional)
- Content alignment: left | centre | right
- Text colour: light | dark (for light-background slides)
- Slide order: drag-and-drop in admin
- Active: toggle on/off per slide
```

**Navigation:**
- Dot indicators at bottom centre (clickable)
- Left/right arrow buttons
- Swipe gesture on mobile
- Keyboard arrow key support

---

### Section 03: Marquee / Ticker Strip
```
Position:       Immediately below hero
Type:           Infinite horizontal scroll strip
Background:     Primary navy, gold text
Speed:          Admin-controlled (slow | medium | fast)
Pause on hover: Yes
```

**Content (admin selects type):**
- Mode A — **Stats ticker**: "200+ Youth Trained · 40% Female Participation · 800+ Students Reached · 85% Employment Rate · 2+ Years of Impact"
- Mode B — **Partner logos**: scrolling partner logo strip (white/gold SVG logos)
- Mode C — **News headlines**: Latest news item titles linking to articles
- Mode D — **Announcement**: Single repeated message with urgency

---

### Section 04: Impact Counter Strip
```
Position:       Below marquee
Type:           4-column stat counter (animated count-up on scroll enter)
Background:     White with subtle navy border bottom
Animation:      Numbers count up from 0 over 2s when 20% in viewport
```

**Stats (all admin editable — label, value, suffix, icon, description):**

| Icon | Value | Suffix | Label | Description |
|------|-------|--------|-------|-------------|
| 👩‍💻 | 200 | + | Youth Trained | In digital skills programmes |
| 🏫 | 800 | + | Students Reached | Through school outreach |
| 📊 | 40 | % | Female Participation | Leading gender inclusion in tech |
| ✅ | 85 | % | Employment Rate | Graduates in work or business |

Admin can add/remove/reorder stat cards.

---

### Section 05: What We Do — Programme Showcase
```
Position:       Section 5
Type:           Horizontal scroll cards on mobile, 4-column grid desktop
Card style:     Image card with colour overlay, icon, title, 1-line description
Hover effect:   Card lifts, overlay colour deepens, "Learn More" arrow appears
```

**Per-card (admin editable):**
- Initiative slug (links to `/what-we-do/[slug]`)
- Custom card image (or auto-pull from initiative hero)
- Card accent colour (unique per initiative)
- Short description (max 80 chars)
- Active toggle

**Display logic**: Always shows all 8 initiatives. Admin can reorder them via drag-and-drop to change grid priority.

---

### Section 06: Donation Campaign Block
```
Position:       Section 6 (after What We Do)
Type:           Split layout — left: campaign narrative; right: progress bar + CTAs
Background:     Warm amber/gold gradient
Visibility:     Admin toggleable (hide when no active campaign)
```

**Left panel:**
- Campaign headline (admin editable)
- Campaign description (rich text)
- Campaign image (optional)

**Right panel:**
- Goal amount (e.g. $67,500)
- Raised amount (e.g. $45,230) — admin updates this
- Progress bar (calculated automatically)
- Donor count
- Days remaining (auto-calculated from deadline)
- Primary donate CTA (links to GlobalGiving or internal /donate)
- Secondary CTA: "Learn how your donation helps"

---

### Section 07: Featured Story / Video
```
Position:       Section 7
Type:           Full-width cinematic section — large background image/video
                with overlaid story content
Height:         80vh
```

**Content (admin editable):**
- Background image OR video URL (YouTube embed, muted autoplay)
- Overlay opacity + colour tint
- Story label: e.g. "Graduate Story"
- Headline: e.g. "From zero experience to software developer in 6 months"
- Short quote (1–2 sentences)
- Attribution: name, role, programme
- CTA: "Watch Her Story" → opens YouTube video in modal
- "Read More Stories" → `/our-impact/testimonials`

---

### Section 08: Latest News & Blog
```
Position:       Section 8
Type:           3-column card grid (most recent 3 news items from Firestore)
Header:         Section heading + "View All News" link
```

**News card contents:**
- Cover image
- Category badge (News | Blog | Event | Press)
- Title
- Date
- 2-line excerpt
- Read time estimate
- "Read More →" link

**Data source**: Pulls 3 most-recently published docs from `news` Firestore collection.

---

### Section 09: Testimonial Carousel
```
Position:       Section 9
Type:           Auto-advancing carousel, 1 testimonial at a time (large format)
Background:     Deep navy
Auto-advance:   8 seconds
Controls:       Prev/next arrows + dot indicators
```

**Per testimonial (admin editable):**
- Portrait photo (square, Firebase Storage)
- Full quote (max 200 chars)
- Name
- Role
- Programme graduated from
- Year
- Active toggle

---

### Section 10: Partner Logo Strip
```
Position:       Section 10
Type:           Infinite scroll marquee (slower than ticker strip)
Background:     Light grey (#f8f9fa)
Logos:          White/greyscale by default, full colour on hover
```

**Admin controls:** Upload logos, set partner name (tooltip), set partner website URL, reorder via drag-and-drop, toggle active.

---

### Section 11: Apply / Join CTA Block
```
Position:       Section 11 (second-to-last)
Type:           3-column CTA cards — "For Students", "For Organisations", "Volunteer"
Background:     White
Each card:      Icon, heading, 2-line description, button
```

**Admin controls:** Each card independently: icon (from preset set), heading, description, button label, button URL, card active toggle.

---

### Section 12: Newsletter / Mailing List Signup
```
Position:       Section 12
Type:           Full-width navy section, centred email capture
Integration:    Brevo (existing provider) via API
```

**Content:** Heading, subheading, email input, submit button, privacy note.

**Admin controls:** Heading, subheading text, toggle show/hide.

**Double opt-in**: On submit → Brevo API creates contact → Brevo sends confirmation email.

---

### Section 13: Floating Elements (always visible)

**A. Floating Donate Button**
```
Position:   Fixed, bottom-right, above scroll-to-top
Appears:    After scrolling 400px
Style:      Pill button, gold/amber, heart icon
Admin:      Toggle on/off, button label, destination URL
```

**B. Exit-Intent Popup**
```
Trigger:    Mouse moving toward top of browser (desktop) OR 60s on mobile
Content:    Image, headline, short copy, email signup OR donate CTA
Frequency:  Max once per 7 days (localStorage)
Admin:      Content, image, mode (newsletter | donate | announcement),
            toggle active, set display delay
```

**C. Scroll-to-Top Button**
```
Appears:    After scrolling 600px
Position:   Fixed, bottom-right
Style:      Small circle, navy background, white arrow
```

---

## 4. INTERIOR PAGE FEATURES

### Every Interior Page Includes

| Element | Description |
|---------|-------------|
| Breadcrumb navigation | Home > Section > Page |
| Hero section | Page-specific image/gradient + title + subtitle |
| Section anchors | Sticky in-page navigation for long pages |
| Related content | "You might also like" cards at bottom |
| Social share | Share to WhatsApp, Twitter/X, LinkedIn, email |
| Page-level SEO | Dynamic metadata, OG image, structured data |
| Print styles | Clean print layout (for reports, SDG pages) |

### What We Do — Initiative Pages (8 pages)

Each initiative page follows this section flow:

```
01. HERO
    Full-bleed image or video
    Eyebrow: category label
    Headline: bold initiative name
    Tagline: one sentence impact statement
    2 CTAs: "Apply Now" + "Learn More" (anchor to overview)
    Animated stat strip (initiative-specific numbers)

02. OVERVIEW
    Split layout: rich text left, image right
    Mission statement (admin editable rich text)
    Key objectives list

03. HOW IT WORKS
    3–4 step process (icon + step number + title + description)
    Timeline or visual process flow

04. IMPACT STATS
    3–4 large-format stat cards specific to this initiative

05. WHO IT'S FOR
    Target audience description
    Eligibility criteria
    Age range, location, requirements

06. GALLERY
    Masonry photo grid (images from Firebase Storage)
    Lightbox on click
    Admin: upload/remove/reorder

07. TESTIMONIALS
    2–3 testimonials specific to this initiative
    Quote + photo + name + role

08. PARTNERS & SPONSORS (if applicable)
    Logos of supporting organisations

09. FAQ ACCORDION
    5–8 FAQs (admin editable)

10. APPLY CTA
    Full-width navy section
    Headline + subheadline
    "Apply Now" button → /apply-for-training
    "Have questions?" → /contact
```

### Apply for Training — Course Listing Page

```
01. HERO: "Find Your Path in Tech"

02. FILTER BAR (sticky on scroll):
    Search input | Category filter | Level filter | Price filter (free/paid)

03. COURSE CARDS GRID:
    Image | Category badge | Level badge | Title | Short description
    Duration | Price | "Apply Now" button
    Skeleton loading state while API fetches

04. EMPTY STATE: "No courses match — see upcoming cohorts"

05. UPCOMING COHORTS SECTION:
    Timeline of next start dates (admin editable)

06. PROCESS STRIP: 4-step apply process
```

### For Organisations Pages

```
Each page:
01. HERO (unique image per service type)
02. SERVICE OVERVIEW (what we offer — cards)
03. HOW IT WORKS (process steps)
04. CASE STUDIES / SUCCESS STORIES
05. PRICING / PACKAGES (if applicable — admin toggle)
06. FAQ
07. CONTACT CTA: direct email + form link
```

---

## 5. COMPONENT LIBRARY

### Naming Convention
All components in `/components/` following atomic design:

```
components/
├── ui/                     ← atoms (no dependencies)
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Toggle.tsx
│   ├── Skeleton.tsx
│   ├── Avatar.tsx
│   ├── Progress.tsx        ← donation progress bar
│   ├── CountUp.tsx         ← animated number counter
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   └── Accordion.tsx
│
├── composite/              ← molecules (combine atoms)
│   ├── StatCard.tsx        ← icon + number + label
│   ├── ProgramCard.tsx     ← image + overlay + CTA
│   ├── TestimonialCard.tsx
│   ├── NewsCard.tsx
│   ├── CourseCard.tsx
│   ├── PartnerLogo.tsx
│   ├── TeamMemberCard.tsx
│   ├── InitiativeCard.tsx
│   ├── JobCard.tsx
│   ├── FAQItem.tsx
│   ├── ProcessStep.tsx
│   └── SocialShareBar.tsx
│
├── sections/               ← organisms (full-width page sections)
│   ├── HeroSlideshow/
│   │   ├── index.tsx       ← orchestrator
│   │   ├── Slide.tsx
│   │   ├── SlideControls.tsx
│   │   └── SlideIndicators.tsx
│   ├── AnnouncementBanner.tsx
│   ├── MarqueeTicker.tsx
│   ├── ImpactCounter.tsx
│   ├── ProgrammeShowcase.tsx
│   ├── DonationCampaign.tsx
│   ├── FeaturedStory.tsx
│   ├── NewsGrid.tsx
│   ├── TestimonialCarousel.tsx
│   ├── PartnerStrip.tsx
│   ├── JoinCTABlock.tsx
│   ├── NewsletterSignup.tsx
│   ├── InitiativeHero.tsx
│   ├── InitiativeOverview.tsx
│   ├── InitiativeGallery.tsx
│   ├── InitiativeFAQ.tsx
│   └── ImpactMap.tsx
│
├── layout/
│   ├── MainNavigation/
│   │   ├── index.tsx
│   │   ├── NavDropdown.tsx
│   │   ├── MegaMenu.tsx
│   │   └── MobileMenu.tsx
│   ├── Footer.tsx
│   ├── Breadcrumbs.tsx
│   └── PageLayout.tsx
│
├── floating/
│   ├── FloatingDonate.tsx
│   ├── ExitIntentPopup.tsx
│   └── ScrollToTop.tsx
│
├── admin/
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   ├── DataTable/
│   │   ├── index.tsx
│   │   ├── TableHeader.tsx
│   │   ├── TableRow.tsx
│   │   └── TablePagination.tsx
│   ├── RichTextEditor.tsx  ← TipTap
│   ├── ImageUploader.tsx   ← Firebase Storage
│   ├── SlideEditor.tsx
│   ├── DraggableList.tsx   ← @dnd-kit
│   ├── StatsWidget.tsx
│   ├── ActivityFeed.tsx
│   ├── ColorPicker.tsx
│   ├── DateRangePicker.tsx
│   └── PreviewFrame.tsx
│
└── seo/
    ├── PageMeta.tsx
    ├── JsonLd.tsx
    └── OgImage.tsx
```

---

## 6. ADMIN PANEL — COMPLETE CMS SPEC

### Architecture

```
Firebase Auth    → Email/password, session cookies, role claims
Firestore        → All content documents
Firebase Storage → Images, documents, logos
Vercel Edge      → Serves admin UI (auth-gated by middleware)
On-demand ISR    → Admin save → webhook → revalidate specific page
```

### Access Roles

| Role | Can Do |
|------|--------|
| `super-admin` | Everything — including user management, publish/unpublish all |
| `editor` | CRUD on content, news, team, partners; cannot manage users |
| `viewer` | Read-only; can see applications and stats |

### Admin Navigation

```
/admin
├── Dashboard                ← Stats overview, recent activity
├── Site Content
│   ├── Homepage Sections    ← Toggle, reorder, edit each section
│   ├── Announcement Banner  ← Content, schedule, variant
│   ├── Hero Slides          ← CRUD, drag-to-reorder slides
│   ├── Impact Statistics    ← Edit counter values
│   ├── Donation Campaign    ← Goal, raised, deadline
│   ├── Featured Story       ← Content, video URL
│   └── Floating Elements    ← Donate button, exit popup
├── Programmes
│   ├── Initiative Pages     ← Edit each of the 8 initiatives
│   └── For Organisations    ← Edit the 4 org service pages
├── News & Blog
│   ├── All Articles         ← CRUD, publish/draft toggle
│   └── Categories           ← Manage news categories/tags
├── Testimonials             ← CRUD, assign to initiative or global
├── Our Team                 ← CRUD, department grouping, order
├── Partners                 ← CRUD, logo upload, website URL
├── Job Listings             ← CRUD for /who-we-are/careers
├── Courses (Read-only)      ← Sync view from portal API
├── Applications             ← View, status update, notes
├── Users                    ← Manage admin accounts + roles
├── Media Library            ← Firebase Storage browser
└── Settings
    ├── SEO Defaults         ← Site title, description, OG image
    ├── Social Media         ← Handles for all platforms
    ├── Contact Info         ← Address, phone, email
    └── Integrations         ← Brevo API key, portal API URL
```

---

### Admin Section: HOMEPAGE BUILDER

This is the most powerful admin feature — a **section-by-section page builder** for the homepage.

```
UI:   Drag-and-drop list of the 13 homepage sections
Each row shows:
  [≡ drag handle] [Section Name] [Status: Live/Hidden] [Edit ✏️] [👁 Preview]

Clicking "Edit" opens a slide-over panel with that section's controls.
"Preview" opens /preview?section=hero-slideshow in a separate tab.
```

**Section Editor — Hero Slideshow:**
```typescript
// Admin form fields for each slide:
{
  id: string                    // auto-generated
  order: number                 // drag-to-reorder
  backgroundType: 'image' | 'video'
  backgroundImage: string       // Firebase Storage URL (drag-drop upload)
  backgroundVideo: string       // YouTube/Vimeo URL
  overlayOpacity: number        // 0–80, slider
  overlayColor: string          // colour picker
  eyebrow: string               // "Now Enrolling — Cohort 7"
  headline: string              // Main headline
  subheadline: string           // Supporting copy
  primaryCta: { label: string, href: string }
  secondaryCta: { label: string, href: string } | null
  alignment: 'left' | 'center' | 'right'
  textColor: 'light' | 'dark'
  isActive: boolean
}
```

**Section Editor — Announcement Banner:**
```typescript
{
  isActive: boolean
  text: string                  // Rich text (bold, links allowed)
  variant: 'info' | 'success' | 'urgent' | 'alert'
  ctaLabel: string | null
  ctaUrl: string | null
  startDate: Date | null        // null = always show
  endDate: Date | null          // null = never auto-hide
  countdownDate: Date | null    // shows "X days left" if set
  dismissible: boolean
}
```

**Section Editor — Impact Statistics:**
```typescript
// Array of stat cards, admin drag-reorders
{
  stats: Array<{
    id: string
    icon: string              // emoji or icon name from preset list
    value: number             // the number to count to
    suffix: string            // "+", "%", "K+" etc.
    label: string             // "Youth Trained"
    description: string       // "In digital skills programmes"
    accentColor: string       // card accent colour
    isActive: boolean
  }>
}
```

**Section Editor — Donation Campaign:**
```typescript
{
  isActive: boolean
  campaignTitle: string
  campaignDescription: string    // Rich text
  campaignImage: string | null
  goalAmount: number             // e.g. 67500
  raisedAmount: number           // manually updated
  currency: 'USD' | 'GHS'
  donorCount: number
  deadline: Date | null
  primaryCtaLabel: string        // "Donate Now"
  primaryCtaUrl: string          // GlobalGiving or /donate
  secondaryCtaLabel: string | null
  secondaryCtaUrl: string | null
}
```

**Section Editor — Testimonial Carousel:**
```typescript
// References testimonials from /testimonials collection
// Admin selects which testimonials appear on homepage (max 8)
// Drag-to-reorder
{
  selectedTestimonialIds: string[]
  autoAdvanceSeconds: number       // 4–12
}
```

---

### Admin Section: INITIATIVE PAGE EDITOR

Full WYSIWYG page editor for each of the 8 What We Do pages.

```typescript
// Firestore collection: initiatives
interface InitiativeDocument {
  id: string                       // e.g. "girls-in-tech"
  slug: string                     // URL segment
  title: string
  tagline: string                  // One-line impact statement
  eyebrow: string                  // e.g. "Flagship Programme"
  isPublished: boolean

  hero: {
    backgroundImage: string        // Firebase Storage URL
    backgroundVideo: string | null // YouTube embed URL
    overlayOpacity: number
    statStrip: Array<{             // 3–4 numbers below hero
      value: string
      label: string
    }>
  }

  overview: {
    body: string                   // TipTap HTML
    sideImage: string
    keyObjectives: string[]
  }

  howItWorks: {
    steps: Array<{
      stepNumber: number
      icon: string
      title: string
      description: string
    }>
  }

  impactStats: Array<{
    value: string
    label: string
    description: string
    icon: string
  }>

  targetAudience: {
    description: string
    criteria: string[]
    ageRange: string
    location: string
  }

  gallery: string[]                // Firebase Storage URLs (ordered)

  testimonials: Array<{
    name: string
    role: string
    programme: string
    quote: string
    photo: string
  }>

  partners: Array<{
    name: string
    logo: string
    website: string
  }>

  faqs: Array<{
    question: string
    answer: string
  }>

  applyCtaHeadline: string
  applyCtaSubheadline: string
  applyCtaUrl: string

  seo: {
    title: string
    description: string
    ogImage: string
    keywords: string[]
  }

  updatedAt: Timestamp
  publishedAt: Timestamp
}
```

---

### Admin Section: NEWS & BLOG EDITOR

```typescript
// Firestore collection: articles
interface ArticleDocument {
  id: string                       // auto-generated
  slug: string                     // URL slug (auto-generated from title, editable)
  category: 'news' | 'blog'
  status: 'draft' | 'published' | 'archived'
  title: string
  excerpt: string                  // 120–160 chars, used for card previews and meta
  content: string                  // TipTap HTML
  coverImage: string               // Firebase Storage URL
  tags: string[]
  author: string                   // Team member ID or custom name
  publishedAt: Timestamp | null    // null = draft
  readTimeMinutes: number          // auto-calculated from content length
  featured: boolean                // appears in "Featured" section if true
  seo: {
    title: string                  // defaults to article title
    description: string            // defaults to excerpt
    ogImage: string                // defaults to coverImage
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**News editor UI:**
- Full TipTap rich text editor (headings, bold, italic, links, images, blockquotes, code, YouTube embeds)
- Cover image drag-drop upload
- Tag manager (type-ahead from existing tags)
- SEO preview (shows how the article looks in Google search results)
- Schedule publish: set future `publishedAt` date → auto-publishes
- Preview: opens `/preview/news/[slug]` in new tab before publishing

---

### Admin Section: TEAM MEMBERS

```typescript
// Firestore collection: team
interface TeamMember {
  id: string
  name: string
  role: string
  department: 'core' | 'board' | 'technical' | 'mentors' | 'volunteers'
  photo: string                    // Firebase Storage URL
  bio: string                      // TipTap HTML, 100–300 words
  email: string
  phone: string | null
  linkedin: string | null
  github: string | null
  twitter: string | null
  expertise: string[]              // tag chips
  isActive: boolean
  isFeatured: boolean              // appears on homepage team section if exists
  order: number                    // drag-to-reorder within department
  joinedAt: string                 // e.g. "March 2023"
}
```

---

### Admin Section: APPLICATIONS MANAGEMENT

```
Applications flow:
  Visitor fills /apply-for-training form → Firestore write + email notification
  Admin views all applications in a filterable data table

Table columns:
  Name | Email | Course | Date | Status | Actions

Status values:
  new (yellow) → reviewed (blue) → shortlisted (green) → rejected (red) | enrolled (teal)

Admin actions per application:
  - View full details (slide-over panel)
  - Change status (dropdown)
  - Add internal notes (text area, not visible to applicant)
  - Export to CSV
  - Send email to applicant (opens mailto: link)

Bulk actions:
  - Export selected to CSV
  - Mark selected as reviewed
```

---

### Admin Section: MEDIA LIBRARY

Full Firebase Storage browser inside admin:
```
Features:
- Folder view (organized by: initiatives | team | news | logos | documents)
- Upload: drag-drop or click, multiple files
- Preview: image lightbox, document download
- Copy URL: click to copy Firebase Storage CDN URL
- Delete: with confirmation
- Rename: inline edit
- Filter: by type (image/document), by folder, by date
- Storage usage indicator
```

---

### On-Demand Revalidation (Admin → Live Site)

Every admin save triggers an ISR revalidation for affected pages only:

```typescript
// Called after any Firestore write in admin panel
async function revalidateAfterSave(contentType: string, slug?: string) {
  const revalidationMap: Record<string, string[]> = {
    'homepage':    ['/'],
    'initiative':  [`/what-we-do/${slug}`, '/what-we-do'],
    'article':     [`/news-and-updates/${slug}`, '/news-and-updates/news', '/'],
    'team':        ['/who-we-are/team'],
    'partner':     ['/who-we-are/partners'],
    'testimonial': ['/our-impact/testimonials', '/'],
    'job':         ['/who-we-are/careers'],
    'impactStats': ['/', '/our-impact/reports'],
  }

  const paths = revalidationMap[contentType] ?? []
  await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ paths, secret: process.env.REVALIDATION_SECRET }),
  })
}
```

---

## 7. FIREBASE DATA SCHEMA

### Complete Collections

```typescript
// Collection overview
const COLLECTIONS = {
  // Content
  'homepage'      : 'single doc — all homepage section settings',
  'initiatives'   : '8 docs — one per initiative page',
  'forOrganisations': '4 docs — one per org service page',
  'articles'      : 'many docs — news + blog posts',
  'team'          : 'many docs — team members',
  'partners'      : 'many docs — partner organisations',
  'testimonials'  : 'many docs — global testimonial pool',
  'jobListings'   : 'many docs — careers/volunteering listings',
  'impactStats'   : 'single doc — homepage counter values',
  'siteContent'   : 'few docs — per-page editable content blocks',
  // Transactional
  'applications'  : 'many docs — training applications (write-public, read-admin)',
  'contactMessages': 'many docs — contact form submissions',
  'newsletterSubs': 'many docs — email signups',
  // Admin
  'users'         : 'few docs — admin user profiles + roles',
  'auditLog'      : 'many docs — all admin actions logged',
  'settings'      : 'single doc — global site settings',
}
```

### Firestore Security Rules (Complete)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helpers
    function isAuthenticated() {
      return request.auth != null;
    }
    function hasRole(role) {
      return isAuthenticated() && request.auth.token.role == role;
    }
    function isEditorOrAbove() {
      return isAuthenticated() &&
        request.auth.token.role in ['super-admin', 'editor'];
    }
    function isSuperAdmin() {
      return hasRole('super-admin');
    }

    // Public content reads
    match /initiatives/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /articles/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /team/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /partners/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /testimonials/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /homepage/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /jobListings/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /impactStats/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /siteContent/{id} {
      allow read: if true;
      allow write: if isEditorOrAbove();
    }
    match /settings/{id} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }

    // Write-only for anonymous, read for admins
    match /applications/{id} {
      allow create: if true;
      allow read, update: if isEditorOrAbove();
      allow delete: if isSuperAdmin();
    }
    match /contactMessages/{id} {
      allow create: if true;
      allow read: if isEditorOrAbove();
      allow delete: if isSuperAdmin();
    }
    match /newsletterSubs/{id} {
      allow create: if true;
      allow read, delete: if isEditorOrAbove();
    }

    // Super-admin only
    match /users/{id} {
      allow read, write: if isSuperAdmin();
    }
    match /auditLog/{id} {
      allow read: if isEditorOrAbove();
      allow create: if isAuthenticated();
      allow update, delete: if false; // immutable
    }
  }
}
```

---

## 8. COMPLETE APP ROUTER DIRECTORY

```
itfy-ghana/
│
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                        ← Nav + Footer + Providers
│   │   ├── page.tsx                          ← / Home (all 13 sections)
│   │   │
│   │   ├── who-we-are/
│   │   │   ├── page.tsx                      ← About Us + Mission/Vision
│   │   │   ├── team/page.tsx
│   │   │   ├── partners/page.tsx
│   │   │   └── careers/page.tsx
│   │   │
│   │   ├── what-we-do/
│   │   │   ├── page.tsx                      ← Hub (8 initiative cards)
│   │   │   ├── girls-in-tech/page.tsx
│   │   │   ├── youth-academy/page.tsx
│   │   │   ├── entrepreneurship-hub/page.tsx
│   │   │   ├── code-impact-challenge/page.tsx
│   │   │   ├── rural-tech-connect/page.tsx
│   │   │   ├── community-outreach/page.tsx
│   │   │   ├── advocacy/page.tsx
│   │   │   └── tech-clubs/page.tsx
│   │   │
│   │   ├── apply-for-training/
│   │   │   ├── page.tsx                      ← Hub
│   │   │   ├── who-can-apply/page.tsx
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                  ← API course listing
│   │   │   │   └── loading.tsx
│   │   │   └── how-it-works/page.tsx
│   │   │
│   │   ├── programs/                         ← KEPT AS-IS (portal links)
│   │   │   ├── page.tsx
│   │   │   ├── course/
│   │   │   │   └── [courseSlug]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── loading.tsx
│   │   │   └── [category]/
│   │   │       ├── page.tsx
│   │   │       └── [courseId]/page.tsx
│   │   │
│   │   ├── for-organisations/
│   │   │   ├── page.tsx                      ← Hub
│   │   │   ├── corporate-training/page.tsx
│   │   │   ├── sponsorships/page.tsx
│   │   │   ├── hire-graduates/page.tsx
│   │   │   └── staff-volunteering/page.tsx
│   │   │
│   │   ├── partner-with-us/
│   │   │   ├── page.tsx                      ← Hub
│   │   │   ├── educational/page.tsx
│   │   │   ├── government/page.tsx
│   │   │   ├── ngo-foundations/page.tsx
│   │   │   ├── international-development/page.tsx
│   │   │   └── technology/page.tsx
│   │   │
│   │   ├── our-impact/
│   │   │   ├── page.tsx                      ← redirects to /reports
│   │   │   ├── reports/page.tsx
│   │   │   ├── testimonials/page.tsx
│   │   │   └── sdgs/page.tsx
│   │   │
│   │   ├── news-and-updates/
│   │   │   ├── page.tsx                      ← Hub
│   │   │   ├── news/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── loading.tsx
│   │   │   └── blogs/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/
│   │   │           ├── page.tsx
│   │   │           └── loading.tsx
│   │   │
│   │   ├── contact/page.tsx
│   │   └── donate/page.tsx
│   │
│   ├── (admin)/
│   │   ├── layout.tsx                        ← Admin shell, auth guard
│   │   └── admin/
│   │       ├── page.tsx                      ← redirects to /admin/dashboard
│   │       ├── dashboard/page.tsx
│   │       ├── content/
│   │       │   ├── homepage/page.tsx         ← Section builder
│   │       │   ├── banner/page.tsx
│   │       │   ├── hero-slides/page.tsx
│   │       │   ├── impact-stats/page.tsx
│   │       │   ├── donation-campaign/page.tsx
│   │       │   ├── featured-story/page.tsx
│   │       │   └── floating-elements/page.tsx
│   │       ├── programmes/
│   │       │   ├── [initiative]/page.tsx     ← Dynamic (8 routes)
│   │       │   └── for-organisations/
│   │       │       └── [service]/page.tsx
│   │       ├── articles/
│   │       │   ├── page.tsx                  ← All articles list
│   │       │   ├── new/page.tsx              ← Create
│   │       │   └── [id]/page.tsx             ← Edit
│   │       ├── testimonials/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── team/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── partners/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── jobs/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── applications/page.tsx
│   │       ├── media/page.tsx                ← Firebase Storage browser
│   │       ├── users/page.tsx
│   │       └── settings/page.tsx
│   │
│   ├── (auth)/
│   │   └── admin-login/page.tsx
│   │
│   ├── api/
│   │   ├── courses/route.ts
│   │   ├── revalidate/route.ts
│   │   ├── contact/route.ts
│   │   ├── newsletter/route.ts              ← Brevo integration
│   │   └── apply/route.ts                  ← Application submission
│   │
│   ├── layout.tsx                           ← Root (html, body, providers)
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/                              ← See Section 5
├── lib/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   ├── storage.ts
│   │   └── admin.ts                        ← Server-only (Firebase Admin SDK)
│   ├── api/
│   │   ├── courses.ts
│   │   ├── brevo.ts
│   │   └── revalidate.ts
│   ├── content/                            ← Static fallbacks
│   │   ├── initiatives.ts
│   │   └── defaults.ts
│   └── utils/
│       ├── cn.ts
│       ├── formatters.ts
│       ├── validators.ts                   ← Zod schemas
│       └── revalidate.ts
│
├── hooks/
│   ├── useFirestoreDoc.ts
│   ├── useFirestoreCollection.ts
│   ├── useCourses.ts
│   ├── useAuth.ts
│   ├── useCountUp.ts                       ← Animated counter
│   ├── useIntersection.ts                  ← Viewport detection
│   └── useMediaQuery.ts
│
├── stores/
│   └── adminStore.ts                       ← Zustand (admin only)
│
├── types/
│   ├── course.ts
│   ├── content.ts
│   ├── admin.ts
│   └── firebase.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 9. TECHNOLOGY STACK

| Layer | Tool | Version | Why |
|-------|------|---------|-----|
| Framework | Next.js | 14.x | App Router, RSC, ISR, Image Optimization |
| Language | TypeScript | 5.x | Full type safety |
| Styling | Tailwind CSS | 3.x | Utility-first, design tokens |
| Animation | Framer Motion | 11.x | Slideshow, counters, reveals |
| Slideshow | Embla Carousel | 8.x | Touch-native, performant, accessible |
| Rich Text (editor) | TipTap | 2.x | Extensible, headless, ProseMirror |
| Rich Text (render) | TipTap / `@tiptap/html` | 2.x | Server-side render to HTML |
| Drag and Drop | @dnd-kit/core | 6.x | Accessible, touch-friendly |
| Firebase | firebase + firebase-admin | 10.x | Auth, Firestore, Storage |
| Validation | Zod | 3.x | Runtime type safety on all inputs |
| State (admin) | Zustand | 4.x | Minimal, no boilerplate |
| Data fetching | SWR | 2.x | Client-side stale-while-revalidate |
| Headless UI | Radix UI | latest | Accessible primitives |
| Icons | Lucide React | latest | Tree-shakeable, consistent |
| Maps | Leaflet + react-leaflet | 4.x | Open-source, Firebase data points |
| Email | Brevo SDK | latest | Existing SMTP + contact forms |
| Image CDN | Vercel Image Optimization | — | Auto WebP/AVIF |
| Deployment | Vercel | — | Edge, ISR, Analytics |
| Error tracking | Sentry | 8.x | Production monitoring |
| Analytics | Vercel Analytics + Speed Insights | — | Real user metrics |
| E2E testing | Playwright | 1.x | Critical path coverage |
| Fonts | Plus Jakarta Sans + DM Sans | — | Google Fonts, preconnected |

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1 — Foundation (Week 1)
- [ ] Next.js 14 project init (TypeScript, Tailwind, ESLint, Prettier)
- [ ] Design system: globals.css, CSS variables, Tailwind config with custom tokens
- [ ] Font setup: Plus Jakarta Sans + DM Sans with `next/font`
- [ ] Firebase project: Auth, Firestore, Storage, Security Rules
- [ ] Seed Firestore with initial content (initiatives, team, partners)
- [ ] `MainNavigation` — v3 structure, desktop mega menus, mobile accordion
- [ ] `Footer` — 4-column link structure
- [ ] `next.config.ts` — full redirect list, image domains, headers
- [ ] `middleware.ts` — admin route protection
- [ ] Staging deploy to Vercel
- [ ] Admin login page (Firebase Auth, session cookies)

### Phase 2 — Homepage (Week 2)
- [ ] `AnnouncementBanner` — dismissible, variants, countdown
- [ ] `HeroSlideshow` — Embla Carousel, Ken Burns, all controls
- [ ] `MarqueeTicker` — infinite scroll, all 4 modes
- [ ] `ImpactCounter` — CountUp animation, Intersection Observer
- [ ] `ProgrammeShowcase` — 8 initiative cards, hover effects
- [ ] `DonationCampaign` — progress bar, countdown, CTAs
- [ ] `FeaturedStory` — video modal embed
- [ ] `NewsGrid` — pulls from Firestore
- [ ] `TestimonialCarousel` — Embla, auto-advance
- [ ] `PartnerStrip` — logo marquee
- [ ] `JoinCTABlock` — 3 audience cards
- [ ] `NewsletterSignup` — Brevo integration
- [ ] Floating elements: donate button, scroll-to-top
- [ ] Exit-intent popup

### Phase 3 — Who We Are + What We Do (Week 3)
- [ ] `/who-we-are` — About Us, Mission, Vision, History timeline
- [ ] `/who-we-are/team` — Department-grouped grid, modal bio
- [ ] `/who-we-are/partners` — Logo grid, partnership details
- [ ] `/who-we-are/careers` — Jobs + volunteer roles, application flow
- [ ] `/what-we-do` hub — 8-card overview with filter
- [ ] Initiative page template (shared layout)
- [ ] All 8 initiative pages with unique content/imagery

### Phase 4 — Apply + For Organisations (Week 4)
- [ ] `/apply-for-training` hub
- [ ] `/apply-for-training/who-can-apply`
- [ ] `/apply-for-training/courses` — API listing with filters
- [ ] `/apply-for-training/how-it-works` — step-by-step process
- [ ] Migrate `/programs/**` (portal routes — keep URLs)
- [ ] `/for-organisations` hub
- [ ] All 4 organisation service pages (consolidated, no duplicates)

### Phase 5 — Partner With Us + Impact + News (Week 5)
- [ ] `/partner-with-us` hub + 5 partnership pages
- [ ] `/our-impact/reports` — charts, stats, download reports
- [ ] `/our-impact/testimonials` — video + written testimonials
- [ ] `/our-impact/sdgs` — SDG alignment visual mapping
- [ ] `/news-and-updates` hub
- [ ] News listing + article page (TipTap HTML render)
- [ ] Blogs listing + article page
- [ ] `/contact` — form with server action + Brevo notification
- [ ] `/donate` — payment options, campaign progress, impact info
- [ ] `sitemap.ts` — dynamic, includes all article slugs

### Phase 6 — Admin Panel (Weeks 6–7)
- [ ] Admin layout: sidebar, header, breadcrumbs, role badge
- [ ] Dashboard: stats cards, recent applications, activity feed
- [ ] Homepage builder: drag-to-reorder sections, toggle visibility
- [ ] Hero slide editor: CRUD, image upload, drag-to-reorder
- [ ] Announcement banner editor: content, scheduling, preview
- [ ] Impact stats editor: edit values, add/remove stats
- [ ] Donation campaign editor: all fields, auto-calculated progress
- [ ] Initiative page editors (8): all sections, gallery, FAQs
- [ ] Article editor: TipTap, image upload, SEO fields, schedule publish
- [ ] Testimonials CRUD
- [ ] Team CRUD: photo upload, rich bio, drag-to-reorder per dept
- [ ] Partners CRUD: logo upload, website URL
- [ ] Job listings CRUD
- [ ] Applications table: filters, status update, notes, CSV export
- [ ] Media library: Storage browser, folder view, copy URL
- [ ] User management (super-admin only)
- [ ] Settings: SEO defaults, social handles, contact info
- [ ] On-demand revalidation: every save → ISR update

### Phase 7 — QA + SEO + Launch (Week 8)
- [ ] Verify all 301 redirects (automated script)
- [ ] Lighthouse ≥ 90 on all pages
- [ ] Accessibility audit: axe-core automated + manual NVDA/VoiceOver
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Mobile: iOS Safari, Chrome Android
- [ ] Dynamic OG images: `opengraph-image.tsx` per major section
- [ ] Structured data: Organization, EducationalProgram, FAQPage, BreadcrumbList
- [ ] `robots.ts` — disallow /admin, /api
- [ ] DNS cutover plan
- [ ] Post-launch monitoring: Vercel Analytics, Sentry alerts
- [ ] Content training session for admin editors

---

## APPENDIX A — HOMEPAGE SECTION SEQUENCE

```
┌─────────────────────────────────────────────────────────┐
│  01  ANNOUNCEMENT BANNER (conditional)                  │
├─────────────────────────────────────────────────────────┤
│  [NAVIGATION]                                           │
├─────────────────────────────────────────────────────────┤
│  02  HERO SLIDESHOW (100vh)                             │
├─────────────────────────────────────────────────────────┤
│  03  MARQUEE TICKER                                     │
├─────────────────────────────────────────────────────────┤
│  04  IMPACT COUNTER STRIP                               │
├─────────────────────────────────────────────────────────┤
│  05  WHAT WE DO — PROGRAMME SHOWCASE                    │
├─────────────────────────────────────────────────────────┤
│  06  DONATION CAMPAIGN BLOCK (conditional)              │
├─────────────────────────────────────────────────────────┤
│  07  FEATURED STORY / VIDEO                             │
├─────────────────────────────────────────────────────────┤
│  08  LATEST NEWS & BLOG                                 │
├─────────────────────────────────────────────────────────┤
│  09  TESTIMONIAL CAROUSEL                               │
├─────────────────────────────────────────────────────────┤
│  10  PARTNER LOGO STRIP                                 │
├─────────────────────────────────────────────────────────┤
│  11  APPLY / JOIN / VOLUNTEER CTA BLOCK                 │
├─────────────────────────────────────────────────────────┤
│  12  NEWSLETTER SIGNUP                                  │
├─────────────────────────────────────────────────────────┤
│  [FOOTER]                                               │
└─────────────────────────────────────────────────────────┘
                                        ↑
                          Floating: Donate button + Scroll-to-top
```

---

## APPENDIX B — SEO & STRUCTURED DATA

### Per-Page Structured Data Types

| Page | Schema Type |
|------|-------------|
| Home | `Organization`, `WebSite`, `SiteNavigationElement` |
| Initiative pages | `EducationalOccupationalProgram` |
| Course pages | `Course`, `EducationalOccupationalProgram` |
| News articles | `NewsArticle` |
| Blog posts | `BlogPosting` |
| Team page | `Person` (per member) |
| FAQ sections | `FAQPage` |
| All pages | `BreadcrumbList` |
| Contact | `ContactPage` |

### Dynamic OG Image Generation

Each major section gets a unique OG image via `opengraph-image.tsx`:
```
/ → Site logo + "Empowering Ghana's Youth Through Technology"
/what-we-do/[initiative] → Initiative title + hero image crop
/news-and-updates/news/[slug] → Article title + cover image crop
/apply-for-training → Course count + "Apply Now"
```

---

## APPENDIX C — PERFORMANCE BUDGETS

| Metric | Target | Measured at |
|--------|--------|------------|
| LCP | < 2.5s | p75, mobile 4G |
| CLS | < 0.1 | All pages |
| INP | < 200ms | Interaction |
| TTFB | < 600ms | ISR cache hit |
| Initial JS bundle | < 150KB gzipped | Home page |
| Total page weight | < 500KB | Home page |
| Hero image | < 200KB | WebP/AVIF |
| Lighthouse performance | ≥ 90 | All pages |
| Lighthouse accessibility | ≥ 95 | All pages |
| Lighthouse SEO | ≥ 95 | All pages |

---

*Version 4.0 — Complete, deduplicated, with full feature spec and admin CMS*
*Navigation: v3 (final) — supersedes all previous versions*
*Status: READY FOR IMPLEMENTATION*
