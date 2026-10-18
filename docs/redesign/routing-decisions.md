# Routing, SEO and Information Architecture Decisions

Status: Proposed
Repository identity verified: new_site @ 37db40a
Scope: analysis only. No code changed by this document.

## 1. Canonical public course-detail URL

### Decision

**Canonical: `/apply-for-training/courses/[slug]`.** Retire the other two shapes with permanent redirects. The brief's starting hypothesis holds, and the live API confirms it rather than blocking it.

### The three shapes and what each actually does

| Route | File | Data function | Fallback chain |
|---|---|---|---|
| `/apply-for-training/courses/[slug]` | `app/(public)/apply-for-training/courses/[slug]/page.tsx:39` | `getCourseBySlugMixed` (`lib/api/training.ts:55`) | live API, then CMS `trainingCoursesHub.courses`, then `seedTrainingCourses` |
| `/programs/[category]/[courseId]` | `app/(public)/programs/[category]/[courseId]/page.tsx:11` | `getCourseBySlug` (`lib/api/courses.ts:101`) | live API, then live catalogue. No CMS, no seed |
| `/programs/course/[courseSlug]` | `app/(public)/programs/course/[courseSlug]/page.tsx:11` | `getCourseBySlug` (`lib/api/courses.ts:101`) | live API, then live catalogue. No CMS, no seed |

All three render the identical component, `components/programs/course-detail-card.tsx` (`CourseDetailCard`), from the identical prop shape. The rendered content is byte-identical for a course the live API returns.

### API evidence: the key space is flat, category is not needed

`lib/api/courses.ts:103` requests `GET {endpoint}/{key}`, endpoint defaulting to `https://papi.itforyouthghana.org/api/courses` (`lib/api/courses.ts:3`).

Probed live on 2026-08-25:

```
GET /api/courses                                       -> 200, 5 courses in data.data[]
GET /api/courses/cyber-security                        -> 200 (bare slug resolves)
GET /api/courses/aa715313-2c77-4acf-bfb6-3adf834e93ae  -> 200 (UUID resolves, same record)
GET /api/courses/uiux                                  -> 200
GET /api/courses/nonexistent-course                    -> 404 {"success":false,"message":"Course not found"}
```

Catalogue as returned today:

| id (UUID) | slug | category |
|---|---|---|
| aa715313-2c77-4acf-bfb6-3adf834e93ae | cyber-security | Technology and Digital Skills |
| 64d07f70-0d1e-4fb3-bfd2-6321b4be6cf9 | data-analysis-with-python | Technology and Digital Skills |
| 30c3f5bb-c063-44c4-bbfe-1664bc22b705 | data-analytics | Technology and Digital Skills |
| f873f6ba-b1d7-435e-9b15-97010a4f9b15 | fronted-development | Technology and Digital Skills |
| 94652cd9-3882-488e-b8ab-3aafb65ddaf9 | uiux | Technology and Digital Skills |

Three findings follow directly.

1. **The API is not keyed by category+id.** A single path segment resolves a course, by slug or by UUID. The concern raised in the brief does not apply. `/apply-for-training/courses/[slug]` needs no category segment to fetch anything.
2. **Ids are not slugs, but the id space is a superset that already works.** Ids are UUIDs, slugs are human strings. `getCourseBySlug` resolves either at the API, and the catalogue fallback at `lib/api/courses.ts:122` matches `course.slug === slug || course.id === slug`. So the canonical route accepts a UUID today and will continue to. No UUID URL breaks under the migration.
3. **Category carries no information.** All five live courses share one category, `Technology and Digital Skills`. `/programs/[category]` slugifies to a single real value, `technology-and-digital-skills`. The category segment discriminates nothing.

### Why the two `/programs/*` shapes are actively harmful, not merely redundant

`app/(public)/programs/[category]/[courseId]/page.tsx:7-11` destructures **only** `params.courseId`. `params.category` is never read and never validated. `/programs/anything-at-all/cyber-security` renders the full canonical cyber-security page at HTTP 200. The category segment is an unbounded duplicate-URL generator: one course is reachable at infinitely many URLs.

The same defect exists one level up. `app/(public)/programs/[category]/page.tsx:22` reads `filtered.length ? filtered : courses`, so an unmatched category silently renders the complete catalogue. `/programs/blue`, `/programs/xyz` and `/programs` are the same page at HTTP 200.

Neither route calls `notFound()`. Neither exports `metadata` or `generateMetadata`, so both inherit the layout title and every duplicate carries the same title tag.

### What breaks: nothing internal

Grep across `app/`, `components/`, `lib/` for links into the two `/programs/*` detail shapes returns zero hits. The only file references are the three pages' own `CourseDetailCard` imports and one string in `components/capsule/design-rules.test.ts:43`.

Every course card in the codebase already points at the canonical route:
- `components/programs/programs-overview.tsx:39` builds `/apply-for-training/courses/${course.slug}`
- `components/training/training-course-catalog.tsx:296` builds `/apply-for-training/courses/${course.slug}`

`ProgramsOverview` is what `/programs` and `/programs/[category]` render, so even the programs hub links into the canonical shape. The `/programs/*` detail routes are orphans that only an external link or a crawler could reach.

External risk is the only real risk: unknown inbound links or historical index entries on `/programs/course/<slug>`. Permanent redirects preserve those.

### Migration

Add to the `redirects()` array in `next.config.mjs:47`:

```js
{ source: "/programs/course/:courseSlug", destination: "/apply-for-training/courses/:courseSlug", permanent: true },
{ source: "/programs/:category/:courseId", destination: "/apply-for-training/courses/:courseId", permanent: true },
```

Order matters. Next matches redirects top to bottom, and `/programs/:category/:courseId` would otherwise swallow nothing else at that depth, but keep the more specific `/programs/course/:courseSlug` first so its intent stays readable.

Then delete:
- `app/(public)/programs/course/[courseSlug]/page.tsx`
- `app/(public)/programs/course/[courseSlug]/loading.tsx`
- `app/(public)/programs/[category]/[courseId]/page.tsx`

Note that `redirects()` in `next.config.mjs` runs before filesystem routing, so the redirects take effect even if deletion is staged separately. Deleting the files is still required, otherwise the routes remain in the build output and any future removal of the redirect silently resurrects the duplicates.

Update `components/capsule/design-rules.test.ts:43` only if it asserts on a deleted path. It references the shared card component, which survives.

### The `/programs/[category]` listing route

Separate from the detail decision, `/programs/[category]` should either validate its category against the live catalogue and call `notFound()` on a miss, or be deleted. As written it manufactures unlimited duplicates of `/programs`. Deleting it is the smaller change: nothing links to it (`grep '"/programs'` returns only `app/sitemap.ts:33`, `components/home/featured-programs.tsx:38`, `lib/content/site-config.ts:240`, all pointing at the bare `/programs`), and with one live category it filters nothing.

**DECISION REQUIRED** on `/programs` itself. It is labelled "Programs Portal" in `legalNavigation` (`lib/content/site-config.ts:240`), sits in the footer utility row, and duplicates `/apply-for-training/courses` in content: both render the live catalogue, and `ProgramsOverview` links into the canonical detail route.

- **Option A, keep `/programs` as a thin alias.** Add `<link rel="canonical">` pointing at `/apply-for-training/courses`. Preserves the "portal" entry point for anyone using it. Cost: a second indexable listing forever, plus the canonical tag to maintain.
- **Option B, redirect `/programs` to `/apply-for-training/courses` permanently** and drop the whole `app/(public)/programs/` tree. One catalogue URL, no canonical tags, less surface. Cost: the "Programs Portal" footer label loses its distinct destination and should be relabelled or removed.

Option B is cleaner and matches the rest of the IA, where `/apply-for-training` owns the learner path. It is flagged rather than decided because "Programs Portal" may be a deliberate external-facing entry point for the Moodle-backed portal, which is a product question, not a routing one.

## 2. Sitemap and robots integrity

Implementation: `app/sitemap.ts` (Next.js `MetadataRoute.Sitemap`, async, no `revalidate`). Robots: `app/robots.ts`. Base URL is hardcoded twice, `app/sitemap.ts:56` and `app/robots.ts:12`, while `metadataBase` is set a third time at `app/layout.tsx:9`.

### Static route coverage: complete

Checked mechanically by walking `app/` for `page.tsx`, excluding `(admin)` and `(auth)`, and diffing the 21 static public routes against the sitemap's literal list plus the `publicNavigation` spread at `app/sitemap.ts:45`.

Result: **zero static public routes missing.**

This corrects the brief's premise. `/our-impact` is in the sitemap, but only indirectly, through `...publicNavigation.map((item) => item.href)` at `app/sitemap.ts:45` picking up the top-level `Our Impact` entry that commit `8818ac0` repointed at `/our-impact` (`lib/content/site-config.ts`, `Our Impact` nav block). Before that commit the nav href was `/our-impact/reports` and the hub was genuinely absent from both. The nav fix silently fixed the sitemap too.

That coupling is fragile. `app/sitemap.ts:45` makes sitemap coverage a side effect of navigation copy. Repointing a nav label at a child route silently removes a hub from the sitemap again, with no test failing.

**Recommendation.** List `/our-impact` explicitly in the literal array at `app/sitemap.ts:22-44`, alongside its three children which are already listed, and keep the `publicNavigation` spread as belt and braces. Then add a gate test asserting that every static public `page.tsx` route appears in the generated sitemap. That test is pure filesystem plus module import, deterministic, sub-second, no Firebase.

### Dynamic route coverage: one real gap

| Dynamic route | In sitemap? | Source used by sitemap |
|---|---|---|
| `/what-we-do/[slug]` | yes | `getCmsInitiatives()` + `getCmsWhatWeDoDynamicPages()` (`app/sitemap.ts:46,51`) |
| `/who-we-are/[slug]` | yes | `getCmsWhoWeAreDynamicPages()` (`app/sitemap.ts:50`) |
| `/departments/[slug]` | yes | `getCmsDepartments()` (`app/sitemap.ts:49`) |
| `/for-organisations/[slug]` | yes | static `organisationServices` seed (`app/sitemap.ts:47`) |
| `/partner-with-us/[slug]` | yes | static `partnershipTracks` seed (`app/sitemap.ts:48`) |
| `/news-and-updates/[category]` | yes | hardcoded `/news-and-updates/news`, `/news-and-updates/blogs` (`app/sitemap.ts:40-41`) |
| `/news-and-updates/[category]/[slug]` | yes | `getCmsPublishedArticles()` (`app/sitemap.ts:52`) |
| `/apply-for-training/courses/[slug]` | **no** | nothing |
| `/programs/[category]` | no | nothing (correct, see section 1) |
| `/programs/[category]/[courseId]` | no | nothing (correct) |
| `/programs/course/[courseSlug]` | no | nothing (correct) |

**Gap: not one course-detail URL is in the sitemap.** Five live courses, five indexable pages with real `generateMetadata` (`app/(public)/apply-for-training/courses/[slug]/page.tsx:20`), zero advertised. These are the highest-intent pages on the site for a prospective learner.

**Migration.** Add to `app/sitemap.ts`:

```ts
import { getTrainingCatalog } from "@/lib/api/training";
// ...
...courses.map((course) => `/apply-for-training/courses/${course.slug}`),
```

`getTrainingCatalog` (`lib/api/training.ts:22`) already degrades to `seedTrainingCourses` when the live API returns nothing, so a sitemap build never fails on an API outage. It does mean an outage swaps the eight seed slugs in for the five live ones. Prefer `getCourseCatalog()` (`lib/api/courses.ts:71`) if the sitemap should advertise only URLs the live API can actually resolve; it returns `[]` on failure, which drops course URLs from that build rather than advertising eight that 404-ish.

**DECISION REQUIRED, mild.** Seed slugs and live slugs do not overlap. Seed: `frontend-web-development`, `ux-design-essentials`, `data-analytics-essentials`, and five more (`lib/content/training-config.ts:109-235`). Live: `cyber-security`, `data-analysis-with-python`, `data-analytics`, `fronted-development`, `uiux`. A seed-backed sitemap advertises eight URLs that render the fallback panel rather than a real course when the API is up. Recommendation: use `getCourseCatalog()` in the sitemap, `getTrainingCatalog()` in the page. Advertise only what resolves.

Note the live slug `fronted-development` is a typo in the upstream portal data, not in this repo. Once it is in a sitemap it is a URL that has to be redirected later if corrected. Worth raising with whoever owns `papi.itforyouthghana.org` before the sitemap ships.

### Routes in the sitemap that 404: none found

Traced each generator:

- `/for-organisations/[slug]`: sitemap uses the seed array; the page resolves through `getCmsOrganisationService` (`lib/cms/organisations.ts:37`), which returns the seed entry when Firestore is absent or the doc is missing (`lib/cms/organisations.ts:38-44`). Every sitemap entry resolves.
- `/partner-with-us/[slug]`: same shape, `lib/cms/partnerships.ts:47-57` falls back to `seedTracks.find(...)`. Every sitemap entry resolves.
- `/departments/[slug]`: sitemap and page both read `getCmsDepartments()` (`lib/cms/departments.ts:177`, `:214`). Same source, so they cannot disagree.
- `/news-and-updates/[category]/[slug]`: `lib/cms/articles.ts:117` normalises `category` to exactly `"blogs"` or `"news"`, so the sitemap can never emit a category that `isArticleCategory` rejects at `app/(public)/news-and-updates/[category]/[slug]/page.tsx:60`.
- `/what-we-do/[slug]`, `/who-we-are/[slug]`: sitemap and page read the same CMS getters.

The inverse gap exists and is worth recording: a **new** organisation service or partnership track created in Firestore under a slug absent from the seed arrays appears in neither the sitemap nor the page, because `lib/cms/organisations.ts:38-39` returns `undefined` for any slug with no seed entry and the page then calls `notFound()`. The seed array is the hard ceiling on those two routes. That is a CMS-coverage question, not a sitemap bug, but it means "add a service in the admin UI" does not produce a public page.

### lastModified is fabricated

`app/sitemap.ts:57` sets `lastModified: new Date()` for every entry, unconditionally. Every URL, static page and years-old article alike, reports as modified at the instant the sitemap was generated.

Consequences: crawlers get no usable change signal, and because the value moves on every request the whole sitemap looks fully rewritten each fetch. Search engines discount `lastmod` they can prove is unreliable, so the field is currently worse than absent.

Real timestamps are available for the CMS-backed routes. `app/(public)/news-and-updates/[category]/[slug]/page.tsx:51` already reads `article.updatedAt`, so articles carry one. Departments, who-we-are pages and what-we-do pages are written through `saveCms*` helpers that stamp `updatedAt` with `FieldValue.serverTimestamp()` (the pattern at `lib/cms/organisations.ts:56` is representative).

**Migration.** Emit `lastModified` per entry from the record's `updatedAt` where one exists. For static routes with no CMS record, omit the field rather than inventing one. `MetadataRoute.Sitemap` allows `lastModified` to be undefined per entry. A build-time constant is the second-best option; `new Date()` per request is the one option to remove.

### robots.txt

`app/robots.ts` disallows `/admin/` and `/api/`, allows everything else, and points at the sitemap.

Two gaps.

1. **`/admin-login` is crawlable.** It lives at `app/(auth)/admin-login/page.tsx`, so its URL is `/admin-login`, which the `/admin/` prefix does not match. The staff login page is indexable. Add `/admin-login` to `disallow`, and add `robots: { index: false, follow: false }` to that page's metadata, since `robots.txt` prevents crawling but not indexing of a URL discovered elsewhere.
2. **No host or canonical-domain declaration.** With the apex hardcoded in three places (`app/robots.ts:12`, `app/sitemap.ts:56`, `app/layout.tsx:9`) and no `www` redirect visible in `next.config.mjs`, both hosts can serve identical content if DNS resolves both. Confirm the platform-level `www` to apex redirect exists, or add one to `next.config.mjs` `redirects()`.

Also worth noting: `next.config.mjs:176-196` sets `X-Frame-Options`, `X-Content-Type-Options` and `Referrer-Policy`, but no `Content-Security-Policy`. Out of scope for routing; flagged because `CourseDetailCard` renders `dangerouslySetInnerHTML` (`components/programs/course-detail-card.tsx:137`) on HTML that arrives from the external portal API.

## 3. Navigation exposure

Three nav sources, all in `lib/content/site-config.ts`:

- `publicNavigation` (`:111`), rendered by `components/layout/site-header.tsx:99` (desktop) and `:168` (mobile)
- `footerNavigation` (`:196`), rendered by `components/layout/site-footer.tsx:89`
- `legalNavigation` (`:239`), rendered by `components/layout/site-footer.tsx:134`

All three are data-driven. No component hardcodes a nav list, so the config is genuinely the single source and the sitemap's dependency on it (`app/sitemap.ts:45`) is at least reading the same thing the header renders.

### Dead entries: none

Every href in all three blocks was resolved against the filesystem route table, with dynamic segments checked against the seed slug arrays they are backed by.

**Zero dead nav entries.** Every `/what-we-do/*`, `/for-organisations/*` and `/partner-with-us/*` link in the nav matches a slug in `initiatives`, `organisationServices` and `partnershipTracks` respectively. Both `/news-and-updates/*` links match `articleCategories`.

### Unexposed routes: none

**Zero static public routes are absent from all three nav blocks.** Every one of the 21 is reachable from header or footer.

### Findings worth acting on

**a. `/admin-login` is linked from the public footer.** `lib/content/site-config.ts:240` puts "Admin Login" in `legalNavigation`, rendered site-wide at `components/layout/site-footer.tsx:134`. Combined with `app/robots.ts` not disallowing it (section 2), the staff login is both linked and crawlable from every public page. Decision: remove it from `legalNavigation`, add `/admin-login` to the robots disallow list, and set `robots: { index: false }` in that page's metadata. Staff reach it by bookmark. Nothing breaks; the route stays live.

**b. "Programs Portal" in `legalNavigation` is the only link to `/programs`.** If section 1 Option B is taken (redirect `/programs` to `/apply-for-training/courses`), this entry must be relabelled or removed in the same change, otherwise the footer advertises a redirect.

**c. Duplicate hrefs inside `publicNavigation`.** `/who-we-are` appears as both the column href and its first child ("About Us"); `/our-impact` likewise ("Impact Overview"). This is deliberate and correct for a dropdown whose parent is itself a page: the parent label may not be clickable on touch, so the child link is the real path to the hub. Recording it so a future dedupe pass does not remove it and re-orphan `/our-impact`, which is exactly the bug commit `8818ac0` fixed. Leave as is.

**d. `/departments` sits under "Who We Are".** The route lives at the top level (`app/(public)/departments/`) but is presented as a Who We Are child. That is an IA choice, not a defect, but URL and nav position disagree. Either is defensible; no change recommended without a product view. Note the breadcrumbs config at `lib/content/site-config.ts:3221-3240` has no `departments` entry, so any breadcrumb rendered on `/departments/[slug]` is not coming from that config.

**e. Course detail pages are nav-invisible by design.** `/apply-for-training/courses/[slug]` is reached only from the catalogue cards (`components/training/training-course-catalog.tsx:296`, `components/programs/programs-overview.tsx:39`). Correct. They belong in the sitemap, not the menu (section 2).

**f. The nav-to-sitemap coupling.** Covered in section 2. Restated here because the fix lives in `app/sitemap.ts`, not in the nav config, and a reader looking at navigation alone would not see the risk.

## 4. Duplicate indexable content

Four distinct duplication sources, in descending severity.

### a. `/programs/[category]/[courseId]` -> unbounded duplicates of every course

`app/(public)/programs/[category]/[courseId]/page.tsx:7-11` accepts `params.category` in the URL and never reads it. `/programs/anything/cyber-security` renders the canonical cyber-security page at HTTP 200. One course, unbounded URLs, no canonical tag, no `notFound()`, no metadata of its own.

**Fix:** redirect and delete, per section 1. A canonical tag is the wrong tool here; the route has no reason to exist.

### b. `/programs/[category]` -> unbounded duplicates of `/programs`

`app/(public)/programs/[category]/page.tsx:22` renders `filtered.length ? filtered : courses`. Any category that matches nothing renders the complete catalogue. `/programs/blue` and `/programs` are the same page at HTTP 200. With all five live courses in one category (`Technology and Digital Skills`), only `/programs/technology-and-digital-skills` filters anything, and it filters to the full set anyway.

**Fix:** delete the route, or validate against the live category list and `notFound()` on a miss. Deletion preferred; nothing links to it.

### c. `/programs` vs `/apply-for-training/courses` -> two listings of the same catalogue

Both render the live catalogue and both link into `/apply-for-training/courses/[slug]`. `/programs` uses `ProgramsOverview` and reads `getCourseCatalog()` (`app/(public)/programs/page.tsx:7`); `/apply-for-training/courses` uses the training catalogue with CMS overlay. Same underlying records, different chrome.

This is the DECISION REQUIRED from section 1. Option A keeps both with a canonical tag on `/programs`; Option B redirects `/programs` away. Either resolves the duplication. Doing nothing leaves two competing listing pages for the same query intent.

### d. `/programs/course/[courseSlug]` vs `/apply-for-training/courses/[slug]` -> exact duplicate

Same component, same data function family, different URL. No inbound internal links. Redirect, per section 1.

### Not duplicates, checked and cleared

- `/what-we-do/[slug]` resolves initiatives first, then CMS dynamic pages (`app/(public)/what-we-do/[slug]/page.tsx:51-63`). Two data sources, one URL space. A slug present in both renders the initiative and the dynamic page is shadowed. That is a content-collision risk, not a URL-duplication risk: there is still exactly one URL. Worth a uniqueness check in the admin UI so an editor cannot create a What We Do page whose slug shadows an initiative, but it produces no duplicate indexable URL.
- `/news-and-updates/[category]/[slug]`: category is validated (`:60`) and the lookup is category-scoped (`lib/cms/articles.ts:271`), so an article is reachable at exactly one category path. No duplication.
- Trailing slashes: `next.config.mjs` does not set `trailingSlash`, so Next's default applies and `/contact/` redirects to `/contact`. No duplication.

### Canonical tags: currently zero

`grep -rn "alternates\|canonical"` across `app/`, `components/`, `lib/` returns one hit, `metadataBase` at `app/layout.tsx:9`. Not a single route declares `alternates.canonical`.

With `metadataBase` set, adding a canonical is one line per route: `alternates: { canonical: "/apply-for-training/courses" }`. Next resolves it against `metadataBase`.

**Recommendation.** Redirects, not canonicals, for a, b and d, because those routes have no independent purpose. Reserve canonical tags for c, and only if Option A is chosen. Additionally add `alternates.canonical` to `/apply-for-training/courses/[slug]` as a self-referencing canonical, which is the standard defence against a URL becoming reachable with query strings such as the tracking parameters a campaign might append.

### Root description is scaffolding text, but the public layout already shields it

`app/layout.tsx:14-15` reads "Next.js rebuild foundation for IT For Youth Ghana, with a new public information architecture and CMS-ready scaffolding."

That text does **not** reach public pages. `app/(public)/layout.tsx:11-18` re-declares `metadata` with `description: siteMeta.description` and the `siteMeta` title template, and a nested layout's metadata overrides its parent's. Every route under `(public)` inherits the real copy from `lib/content/site-config.ts:60`.

The scaffolding string is still the inherited description for `(admin)` and `(auth)` routes, including `/admin-login`, which is currently indexable (section 3a). Low severity, and it disappears once `/admin-login` is noindexed. Replacing the root default with `siteMeta.description` is still worth doing so the two layouts cannot drift.

## 5. Metadata coverage

Counted mechanically across all 32 public `page.tsx` files: 14 export `generateMetadata`, 10 export a static `metadata` object, 8 export neither.

Every public route inherits a working baseline from `app/(public)/layout.tsx:11-18`: the `siteMeta` title default and template, `siteMeta.description`, and `siteMeta.openGraph`. So a route with no metadata is not bare, it is generic. The gap is that eight routes are indistinguishable from one another in search results and in a shared link.

### Routes with no `metadata` and no `generateMetadata`

| Route | File | Verdict |
|---|---|---|
| `/` | `app/(public)/page.tsx` | **gap, highest priority** |
| `/who-we-are/team` | `app/(public)/who-we-are/team/page.tsx` | gap |
| `/who-we-are/partners` | `app/(public)/who-we-are/partners/page.tsx` | gap |
| `/who-we-are/careers` | `app/(public)/who-we-are/careers/page.tsx` | gap |
| `/programs` | `app/(public)/programs/page.tsx` | resolves with section 1 |
| `/programs/[category]` | `app/(public)/programs/[category]/page.tsx` | resolves with section 1 (deleted) |
| `/programs/[category]/[courseId]` | `app/(public)/programs/[category]/[courseId]/page.tsx` | resolves with section 1 (deleted) |
| `/programs/course/[courseSlug]` | `app/(public)/programs/course/[courseSlug]/page.tsx` | resolves with section 1 (deleted) |

**The homepage is the one that matters.** `app/(public)/page.tsx` is four lines and exports nothing but the component. It gets the layout's generic title `IT For Youth Ghana` with no descriptive suffix, no page-specific description, and no OG image. It is the most-linked and most-shared URL on the site.

**The three `who-we-are` children are a consistency gap, not a data gap.** Each already loads a CMS-backed page object with a title and description: `getCmsSitePage("team")` at `app/(public)/who-we-are/team/page.tsx:9`, `("partners")` at `partners/page.tsx:9`, `("careers")` at `careers/page.tsx:9`, each with a seed fallback (`teamHub`, `partnersHub`, `careersHub` in `lib/content/site-config.ts:1555`, `:1588`, `:1621`). Adding `generateMetadata` to each is a copy of the pattern already used by `app/(public)/who-we-are/[slug]/page.tsx:19-39`, reading the same objects. No new content required.

### Bug: doubled site name in titles

`app/(public)/layout.tsx:14` sets `template: siteMeta.titleTemplate`, which is `"%s | IT For Youth Ghana"` (`lib/content/site-config.ts:58`). Twelve title strings in `app/(public)` already end in `| IT For Youth Ghana` and are then fed through that template.

Rendered result: `Corporate Training | IT For Youth Ghana | IT For Youth Ghana`.

Affected lines:

```
app/(public)/what-we-do/[slug]/page.tsx:43              (openGraph.title only)
app/(public)/news-and-updates/[category]/[slug]/page.tsx:30, :38, :43
app/(public)/news-and-updates/[category]/page.tsx:29, :36
app/(public)/contact/page.tsx:10
app/(public)/donate/page.tsx:7
app/(public)/partner-with-us/[slug]/page.tsx:21, :26
app/(public)/for-organisations/[slug]/page.tsx:21, :26
```

`what-we-do/[slug]:43` is the one benign case: it is inside `openGraph`, and the template does not apply to `openGraph.title`. The other eleven are `title` values and do double.

**Fix:** strip ` | IT For Youth Ghana` from every `title` string in a page's `metadata` or `generateMetadata` and let the layout template add it. Where a route genuinely wants no suffix, use `title: { absolute: "..." }`.

**Gate test:** assert that no `title` string returned by a public route's metadata contains the site name, unless wrapped in `{ absolute }`. Static, deterministic, no network.

### openGraph coverage

22 of 32 public routes declare no `openGraph` block and fall back to `siteMeta.openGraph` (`lib/content/site-config.ts:62-66`), which sets `siteName`, `locale` and `type` but **no image**. There is no default OG image anywhere in the metadata config.

Consequence: every share of the homepage, `/our-impact`, `/donate`, `/contact`, `/what-we-do` and 17 other URLs renders as a text-only card. The routes that do set an image are the CMS-backed detail pages that happen to have a hero: `who-we-are/[slug]:36`, `what-we-do/[slug]:45`, `departments/[slug]:35`, `apply-for-training/courses/[slug]:33`, `news-and-updates/[category]/[slug]:48`.

**Fix:** add a default `openGraph.images` entry to `siteMeta.openGraph`. One org-level image covers all 22 at once. Then add page-specific images where a hero already exists.

### Structured data

No JSON-LD anywhere. `grep` for `application/ld+json` across `app/`, `components/`, `lib/` returns nothing. The obvious candidates, given the constitution's SEO section:

- `Organization` on the root layout, once
- `Article` on `/news-and-updates/[category]/[slug]`, where `publishedTime`, `modifiedTime` and `authors` are already assembled at `app/(public)/news-and-updates/[category]/[slug]/page.tsx:50-52`
- `Course` on `/apply-for-training/courses/[slug]`, where provider, price, duration and level are all present on the `Course` type (`types/course.ts:20-42`)
- `JobPosting` on `/who-we-are/careers`, which already reads `getCmsJobs(false)`

Out of scope for a routing decision, listed because the data for all four is already loaded on the page and only needs emitting.

### Summary of metadata actions

1. Add `generateMetadata` to `app/(public)/page.tsx`.
2. Add `generateMetadata` to the three `who-we-are` children, reading the `getCmsSitePage` object each already fetches.
3. Remove the doubled site name from eleven `title` strings.
4. Add a default OG image to `siteMeta.openGraph`.
5. Add self-referencing `alternates.canonical` per section 4.
6. The four `/programs/*` metadata gaps close when those routes are redirected and deleted.

## 6. Dynamic slug routes

No file in `app/` sets `dynamicParams`, so the Next default `dynamicParams = true` applies everywhere: a slug absent from `generateStaticParams` is still rendered on demand, and the page body decides the outcome. `generateStaticParams` therefore controls prerendering, not reachability.

| Route | Slug source | `generateStaticParams` | Unknown slug |
|---|---|---|---|
| `/who-we-are/[slug]` | Firestore `siteContent` where `parentSlug == "who-we-are"` | yes, `:14` | **404** |
| `/what-we-do/[slug]` | seed `initiatives` merged with Firestore, plus Firestore `siteContent` where `parentSlug == "what-we-do"` | yes, `:16` | **404** |
| `/departments/[slug]` | Firestore `departments`, seed fallback | yes, `:15` | **404** |
| `/for-organisations/[slug]` | seed `organisationServices` only | yes, `:12` | **404** |
| `/partner-with-us/[slug]` | seed `partnershipTracks` only | yes, `:12` | **404** |
| `/news-and-updates/[category]/[slug]` | Firestore published articles | yes, `:18` | **404** |
| `/apply-for-training/courses/[slug]` | live portal API | **no** | **200 soft-404** |

### Per route

**`/who-we-are/[slug]`** in `app/(public)/who-we-are/[slug]/page.tsx`

`generateStaticParams` (`:14`) reads `getCmsWhoWeAreDynamicPages()` (`lib/cms/site-pages.ts:257`), which queries `siteContent` filtered on `parentSlug == "who-we-are"`, drops the reserved slugs `team`, `partners`, `careers` (`:276`, set at `:50`) and drops unpublished. With no Firebase credentials it returns `[]` (`:262-264`), so a build without Firebase prerenders nothing here and every request is on-demand.

Unknown slug: `getCmsWhoWeAreDynamicPageBySlug` (`:321`) looks up doc id `who-we-are-${slug}` (`:338`), returns `null` for a reserved slug (`:325-327`) or a missing doc, and the page calls `notFound()` (`:45`). Clean 404. `generateMetadata` returns `title: "Page not found"` (`:26`) rather than throwing.

The reserved-slug filter is correct and worth keeping. Static segments already beat `[slug]` in Next's matcher, so `/who-we-are/team` can never reach this file, but without the filter `generateStaticParams` could emit a param that collides with a static route at build time.

**`/what-we-do/[slug]`** in `app/(public)/what-we-do/[slug]/page.tsx`

Two sources under one URL space. `generateStaticParams` (`:16-26`) unions `getCmsInitiatives()` and `getCmsWhatWeDoDynamicPages()`. At request time the page tries the initiative first (`:51`), falls back to the dynamic page (`:57`), then `notFound()` (`:60`).

**The initiative slug space is capped by the seed array.** `lib/cms/initiatives.ts:144` reads `seedInitiatives.map((seed) => cmsBySlug.get(seed.slug) ?? seed)`. It iterates the eight seed slugs and looks each up in Firestore. A Firestore initiative created under a slug not in the seed array is silently discarded: it never appears in the list, never gets prerendered, and never resolves. The eight seed slugs in `lib/content/site-config.ts:394` are a hard ceiling on initiatives.

Publishing a genuinely new What We Do page therefore requires creating a `whatWeDoDynamicPage` in `siteContent`, not an initiative. That path is unbounded and works. This is a CMS-authoring constraint that is invisible from the admin UI, and it should be documented for editors or removed by making `getCmsInitiatives` union Firestore-only slugs instead of mapping over seeds.

`RESERVED_WHAT_WE_DO_SLUGS` (`lib/cms/site-pages.ts:53`) is derived from the initiative slugs, so a dynamic page cannot shadow an initiative. Correct.

**`/departments/[slug]`** in `app/(public)/departments/[slug]/page.tsx`

`generateStaticParams` (`:15`) and the page (`:42`) both read `getCmsDepartments()` (`lib/cms/departments.ts:177`), which returns Firestore departments or the published seed set when Firestore is absent or the collection is empty (`:180-197`). `getCmsDepartmentBySlug` (`:214`) filters that same list, so params and lookup cannot disagree. Unknown slug hits `notFound()` (`:47`).

Unlike initiatives, a Firestore-only department **does** resolve: `getCmsDepartments` maps the snapshot directly rather than over the seed array. Departments are the one CMS collection where adding a record produces a public page.

Runtime risk: `components/shared/team-directory.tsx:65` and `app/(admin)/admin/team/page.tsx:23` build `/departments/${member.departmentSlug}`. A team member with an empty or missing `departmentSlug` yields `/departments/` or `/departments/undefined`, the first hitting the index and the second a 404. Worth a guard at the link site.

**`/for-organisations/[slug]`** in `app/(public)/for-organisations/[slug]/page.tsx`

`generateStaticParams` (`:12`) maps the static `organisationServices` seed. The page resolves through `getCmsOrganisationService` (`lib/cms/organisations.ts:37`), which returns `undefined` immediately when the slug has no seed entry (`:38-39`) and otherwise merges the Firestore doc over the seed. Unknown slug hits `notFound()` (`:34`).

**The seed array is a hard ceiling.** Firestore can only override the four seed services, never add a fifth. Same defect class as initiatives.

Note the split source: `generateMetadata` (`:16-29`) reads the raw seed, while the body reads the CMS-merged record. A Firestore override of a title or description shows in the page but not in the `<title>`. Fix by making `generateMetadata` async and calling `getCmsOrganisationService`.

**`/partner-with-us/[slug]`** in `app/(public)/partner-with-us/[slug]/page.tsx`

`generateStaticParams` (`:12`) maps the static `partnershipTracks` seed. The page calls `getCmsPartnershipTrackBySlug` (`lib/cms/partnerships.ts:47`), which falls back to `seedTracks.find(...)` when Firestore is absent or the doc is missing (`:49`, `:52`). Unknown slug with no doc hits `notFound()` (`:33`).

Same metadata split as for-organisations: `generateMetadata` (`:16`) reads the seed, the body reads the merge.

**Content-identity bug.** `normalizeTrack` (`lib/cms/partnerships.ts:25-28`) resolves its fallback as `seedTracks.find((t) => t.slug === slug) ?? seedTracks[0]!`. If a Firestore doc exists whose id is a slug not in the seed array, the lookup at `:51-53` finds it and merges it over **seed track zero**. The page then renders at that new URL with the first partnership track's unspecified fields silently filling the gaps. Unlike for-organisations, the ceiling here leaks: an unseeded slug does not 404, it renders a hybrid. Replace `?? seedTracks[0]!` with a null return and let the caller `notFound()`.

**`/news-and-updates/[category]/[slug]`** in `app/(public)/news-and-updates/[category]/[slug]/page.tsx`

Best-behaved of the set. `generateStaticParams` (`:18`) emits real `{category, slug}` pairs from `getCmsPublishedArticles()`. The body validates the category against `isArticleCategory` (`:60`) before the lookup, then `getCmsArticleBySlug(category, slug)` (`:64`) matches on both fields (`lib/cms/articles.ts:271`). Two `notFound()` paths, one for a bad category and one for a missing article. `lib/cms/articles.ts:117` normalises every stored category to `"blogs"` or `"news"`, so the pair space is closed.

`/news-and-updates/[category]` (the listing) validates identically at `:44` and its `generateStaticParams` (`:20`) maps `articleCategories`.

**`/apply-for-training/courses/[slug]`**, the outlier

No `generateStaticParams`. `export const dynamic = "force-dynamic"` at `:1`, so nothing is prerendered and every request is live. That is defensible for an externally-sourced catalogue.

**No `notFound()`.** `getCourseBySlugMixed` (`lib/api/training.ts:55`) returns `null` after the API 404s and both fallbacks miss, and the page hands that `null` straight to `CourseDetailCard` (`:45`). The card's null branch (`components/programs/course-detail-card.tsx:69-85`) renders an `<h1>` built from the slug plus the text "This course route is active, but the course API did not return details for this slug. The browse catalogue remains wired for runtime requests from the configured endpoint."

Three problems.

1. **HTTP 200 on a nonexistent course.** A classic soft 404. `/apply-for-training/courses/anything-at-all` returns 200 with an `<h1>Anything At All</h1>`. Verified against the live API: `GET /api/courses/nonexistent-course` returns 404, and the catalogue fallback at `lib/api/courses.ts:122` then finds nothing. Crawlers will index whatever URLs they discover.
2. **`generateMetadata` fabricates a title from the slug.** `:24` does `course?.title ?? titleFromSlug(params.slug)`, so the 200 also carries a plausible-looking unique title. That is the exact pattern that gets a site flagged for thin auto-generated content.
3. **The copy is developer-facing.** "The browse catalogue remains wired for runtime requests from the configured endpoint" is a note to an engineer, shown to the public.

**Fix:** call `notFound()` when the course is `null`, in both the page and, by returning a not-found title, `generateMetadata`. Keep `CourseDetailCard`'s null branch, since the component is shared and defensive, but stop reaching it from the route. Add a gate test asserting the page throws `NOT_FOUND` for an unresolvable slug with the API stubbed to 404.

This is the single highest-value correctness fix in this document after the canonical URL decision, and it is roughly four lines.

### The 404 page itself

`app/not-found.tsx` lives at the app root, outside the `(public)` group. A 404 from any public route renders with no `SiteHeader`, no `SiteFooter` and no announcement bar, since those are mounted by `app/(public)/layout.tsx:36-40`. The only escape is a "Return home" link.

The copy also reads "This route does not exist in the rebuilt information architecture yet" (`app/not-found.tsx:11`), which describes the migration to the visitor.

**Fix:** add `app/(public)/not-found.tsx` so public 404s keep the site chrome, and rewrite the copy for a visitor rather than for the team. Leave the root `not-found.tsx` as the bare fallback for admin and auth.

## 7. Internal link integrity, and an audit of `scripts/discover-routes.mjs`

### The finding holds, on a much wider scan

The previous "zero dead internal links" result came from `scripts/discover-routes.mjs`, which only reads six files under `lib/content/` (`scripts/discover-routes.mjs:125`). That is the seed copy, not the application.

Re-verified across the whole codebase. Method: walk every `.ts`/`.tsx` under `app/`, `components/` and `lib/`; extract literal internal hrefs matching `href="/..."`, `href: "/..."` and `href={"/..."}`; strip fragments and query strings; resolve each against the filesystem route table (static routes, dynamic route patterns by segment arity and literal-segment match), files under `public/`, and the 25 redirect sources in `next.config.mjs`.

```
literal internal hrefs scanned: 522 across 353 files
distinct dead targets:          0
```

**Zero dead internal links.** The finding holds and is now backed by 522 links rather than the subset the existing script checks.

Template-literal hrefs cannot be resolved statically. All 44 were listed and read by hand; every one targets a real dynamic route shape. Two carry a runtime risk rather than a routing defect:

- `components/shared/team-directory.tsx:65` and `app/(admin)/admin/team/page.tsx:23` build `/departments/${member.departmentSlug}`. An empty slug yields `/departments/`, a missing one yields `/departments/undefined` and a 404. Guard at the link site.
- `app/(admin)/admin/articles/page.tsx:84` builds `/news-and-updates/${article.category}/${article.slug}`. Safe, because `lib/cms/articles.ts:117` normalises category to `news` or `blogs`.

The scan script is in the scratchpad, not committed. It should be committed as a gate test: pure filesystem, no network, no Firebase, well under a second. That converts "zero dead links" from a claim someone re-checks by hand into a build failure.

### `scripts/discover-routes.mjs` is wrong in four ways

The brief flagged incorrect totals and expansions. Confirmed, with specifics.

**a. It reads the wrong article array.** `scripts/discover-routes.mjs:91` calls `slugsIn(siteConfig, "articles")`, reading `articles` from `lib/content/site-config.ts:1918`, which holds 5 entries. The application reads a different array: `lib/cms/articles.ts:1-4` imports `articles as seedArticles` from `lib/content/news-config.ts:161`, which holds 7.

The two arrays disagree on content, not just count:

| slug | site-config (script) | news-config (application) |
|---|---|---|
| cohort-8-scholarship-campaign | yes | yes |
| community-tech-clubs-expansion | yes | yes |
| why-homepage-clarity-matters | yes | yes |
| why-partnership-storytelling-builds-trust | yes | yes |
| cohort-8-now-open | yes | **no** |
| rebuild-foundation-update | **no** | yes |
| digital-skills-fair-preview | **no** | yes |
| what-young-people-need-after-the-first-workshop | **no** | yes |

So the script reports one article URL that does not exist and misses three that do.

Two seed article arrays existing at all is the underlying problem. `lib/content/site-config.ts:1918` appears to be dead: `lib/cms/articles.ts` imports from `news-config`, and `app/sitemap.ts:3` reads `getCmsPublishedArticles`. Per the constitution's dead-code rule this needs a dynamic-import and runtime-reference check before deletion, but one of the two arrays should go.

**b. It hardcodes the article category.** `scripts/discover-routes.mjs:91` maps every article slug to `news/${s}`. Two of the five it finds are `category: "blogs"`. The article lookup matches on category **and** slug (`lib/cms/articles.ts:271`), and the page validates the category before looking up (`app/(public)/news-and-updates/[category]/[slug]/page.tsx:60-68`), so the script's own expansion list contains two URLs that 404:

```
/news-and-updates/news/why-homepage-clarity-matters
/news-and-updates/news/why-partnership-storytelling-builds-trust
```

A route-inventory tool emitting 404s as discovered routes is worse than emitting nothing.

**c. `missingFromSitemap` is a false positive, and is never printed.** With `--json` the script reports `missingFromSitemap: ["/our-impact"]`. That is wrong: `/our-impact` is in the sitemap via the `publicNavigation` spread at `app/sitemap.ts:45`, as the independent check in section 2 confirms. The script's sitemap regex (`scripts/discover-routes.mjs:116`) only captures string literals from the sitemap source and cannot see values arriving through a spread or a `.map()`.

Compounding it, the finding is computed at `:167` and included in the JSON at `:196`, but the human-readable branch at `:227-235` prints `deadInternalLinks`, `unreachableFromNavOrCopy` and `redirects` and silently drops `missingFromSitemap`. Anyone reading the terminal output or `docs/audit/route-inventory.md` never sees it. A finding computed and then discarded is the failure mode the constitution's deterministic-work rule exists to prevent.

**d. It expands partnerships from the wrong array.** `scripts/discover-routes.mjs:88` reads `partnershipPages` from `lib/content/site-config.ts:1136`. The route reads `partnershipTracks` from `lib/content/partnership-config.ts:142` (`app/(public)/partner-with-us/[slug]/page.tsx:5,13`). Both currently hold the same five slugs, so the count is right by coincidence. A divergence between the two arrays would not be detected. Same two-arrays-for-one-concern smell as (a).

For contrast, three expansion sources are correct: `/departments/[slug]` reads site-config `departments`, which is what `lib/cms/departments.ts:1` imports as `seedDepartments`; `/for-organisations/[slug]` reads organisation-config `organisationServices`, matching `lib/cms/organisations.ts:1`; `/what-we-do/[slug]` reads site-config `initiatives`, matching the initiatives CMS seed.

### Corrected route total

The script prints `public routes (expanded) 53`. Recomputed with the correct article array and the live course catalogue:

```
static public routes                      21
/departments/[slug]                        8
/for-organisations/[slug]                  4
/partner-with-us/[slug]                    5
/what-we-do/[slug]        (initiatives)    8
/news-and-updates/[category]               2
/news-and-updates/[category]/[slug]        7   (script says 5)
/apply-for-training/courses/[slug]         5   (script says 0)
                                          ---
                                          60
```

60, not 53. And that is a **floor**, not a total: `/who-we-are/[slug]` and the dynamic-page half of `/what-we-do/[slug]` are Firestore-only with no seed, so they add an unbounded number that no static analysis can know. The script's single number should be reported as "at least N, plus Firestore-authored pages", which its own `RUNTIME_RESOLVED` map (`:98-104`) already has the vocabulary for but the totals line ignores.

### Recommended changes to the script

1. Point the article expansion at `lib/content/news-config.ts` and carry each article's real `category` instead of hardcoding `news/`.
2. Point the partnership expansion at `lib/content/partnership-config.ts`.
3. Fetch `getCourseCatalog()` behind a `--live` flag so course URLs are counted, with the count clearly marked as live-API-dependent.
4. Print `missingFromSitemap` in the text report, and resolve the sitemap by importing and invoking `app/sitemap.ts` rather than regexing its source. Invoking it also exercises the spread and the CMS reads, which is the only way to get a true answer.
5. Report the total as a floor plus a named runtime remainder.
6. Widen the dead-link scan from the six `lib/content/` files to `app/`, `components/` and `lib/`, per the 522-link method above, and promote it to a gate test.

Until (4) lands, treat `route-inventory.md` as indicative. This document's sitemap and link findings were produced independently and do not depend on it.


---

## Action order

Ordered by risk removed per line changed. Every item is analysis-backed above; none is implemented by this document.

| # | Action | File | Section | Breaks |
|---|---|---|---|---|
| 1 | `notFound()` on unresolvable course slug | `app/(public)/apply-for-training/courses/[slug]/page.tsx:39` | 6 | nothing |
| 2 | Redirect `/programs/course/:slug` and `/programs/:category/:id` to the canonical course URL | `next.config.mjs:47` | 1 | nothing internal |
| 3 | Delete the two redundant course routes and `/programs/[category]` | `app/(public)/programs/` | 1, 4 | nothing internal |
| 4 | Add course URLs to the sitemap | `app/sitemap.ts` | 2 | nothing |
| 5 | Real `lastModified`, or omit it | `app/sitemap.ts:57` | 2 | nothing |
| 6 | Strip the doubled site name from 11 title strings | 6 files under `app/(public)` | 5 | nothing |
| 7 | Noindex `/admin-login`, drop it from the footer | `app/robots.ts:9`, `lib/content/site-config.ts:240` | 2, 3 | staff bookmark still works |
| 8 | `generateMetadata` for `/` and the three `who-we-are` children | 4 files | 5 | nothing |
| 9 | Default OG image on `siteMeta.openGraph` | `lib/content/site-config.ts:62` | 5 | nothing |
| 10 | `app/(public)/not-found.tsx` with site chrome and visitor-facing copy | new file | 6 | nothing |
| 11 | Fix `normalizeTrack`'s `?? seedTracks[0]` fallback | `lib/cms/partnerships.ts:26` | 6 | an unseeded partnership URL starts 404ing, which is correct |
| 12 | Fix the four defects in `scripts/discover-routes.mjs` | `scripts/discover-routes.mjs` | 7 | nothing |
| 13 | Promote the 522-link dead-link scan to a gate test | new test | 7 | nothing |
| 14 | Gate test: every static public route appears in the sitemap | new test | 2 | nothing |

### Open decisions

1. **`/programs`**: alias with a canonical tag, or permanent redirect to `/apply-for-training/courses` and delete the tree. Section 1. Product question about the "Programs Portal" entry point.
2. **Sitemap course source**: `getCourseCatalog()` (advertise only what the live API resolves) or `getTrainingCatalog()` (seed fallback, advertises 8 URLs that render the fallback panel while the API is up). Recommendation is `getCourseCatalog()`. Section 2.
3. **Seed-capped CMS collections**: initiatives, organisation services and partnership tracks cannot gain new slugs from Firestore. Section 6. Either document the constraint for editors or change the merge to union Firestore-only slugs.
