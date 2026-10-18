# IT For Youth Ghana — CMS Completion Plan
### Wiring Firebase end-to-end across every public page, with `lib/content/*` as the fallback layer

---

## 1. Where things actually stand

You already have one fully-working, replicable pattern. Five content types go all the way through: **Firestore read (with seed fallback) → Zod validator → authenticated admin API route → admin list/create/edit UI → `revalidatePath` on save.** That's `articles`, `partners`, `testimonials`, `team`, and `jobs`.

Everything else — and this is most of the site's actual words — is still a direct `import` from `lib/content/*` inside a server component. There's no Firestore document behind it, no admin form to edit it, and no revalidation path wired for it.

| Domain | Public pages | Reads via | Admin write UI | Status |
|---|---|---|---|---|
| Articles (news/blogs) | `/news-and-updates/**` | `lib/cms/articles.ts` | Full (list/new/edit) | ✅ Done |
| Partners | homepage, `/who-we-are/partners`, `/our-impact` | `lib/cms/partners.ts` | Full | ✅ Done |
| Testimonials | homepage, `/our-impact/testimonials` | `lib/cms/testimonials.ts` | Full | ✅ Done |
| Team | `/who-we-are/team` | `lib/cms/team.ts` | Full | ⚠️ No seed fallback — empty Firestore = empty page |
| Jobs | `/who-we-are/careers` | `lib/cms/jobs.ts` | Full | ⚠️ Same — `seedJobs` is `[]` |
| Site hub pages (who-we-are, team, partners, careers, testimonials copy) | 5 pages | `lib/cms/site-pages.ts` | ❌ None | Read path exists, no way to edit it |
| Homepage sections (hero slides, ticker, donation campaign, featured story, join CTA, newsletter copy, floating elements, announcement) | `/` | direct import, `lib/content/site-config.ts` | ❌ None | Fully static |
| What We Do / 8 initiatives | `/what-we-do/**` | direct import, `site-config.ts` | ❌ (scaffold only, no save) | Fully static |
| For Organisations (overview + 4 services) | `/for-organisations/**` | direct import, `organisation-config.ts` | ❌ (scaffold only) | Fully static |
| Partner With Us (overview + 5 tracks) | `/partner-with-us/**` | direct import, `partnership-config.ts` | ❌ | Fully static |
| Apply for Training (landing/eligibility/how-it-works/cohorts) | `/apply-for-training/**` | direct import, `training-config.ts` | ❌ | Fully static (course *catalog* is a separate external API concern) |
| Our Impact (overview/reports/sdgs) | `/our-impact/**` | direct import, `impact-config.ts` | ❌ | Fully static |
| Contact page copy | `/contact` | direct import, `contact-config.ts` | ❌ | Form submission works; page copy doesn't |
| Settings | `/admin/settings` | env vars + hardcoded | ❌ | Display-only, nothing editable |

The admin routes at `app/(admin)/admin/programmes/[initiative]/page.tsx` and `programmes/for-organisations/[service]/page.tsx` look like editors but are read-only tables with an "Edit scaffold" button that has no `onClick`. Same for `admin/content/[section]/page.tsx`. These are the pages that need real forms behind them.

---

## 2. The pattern to replicate (don't invent a new one)

Every finished domain follows this shape — reuse it exactly for everything else:

```
lib/cms/<domain>.ts
  normalize<Domain>(id, data)      // Firestore doc -> typed object, tolerant of missing fields
  get<Domain>s(options?)           // Firestore read -> falls back to seed array/object on empty/missing/error
  get<Domain>ById(id)
  save<Domain>(payload, id?)       // upsert, { configured, written, id }
  delete<Domain>(id)

lib/utils/validators.ts            // add a zod schema for the domain
app/api/admin/<domain>/route.ts        // POST (create)
app/api/admin/<domain>/[id]/route.ts   // PUT (update), DELETE
components/admin/<domain>-form.tsx     // client form, mirrors article-form.tsx / job-form.tsx
app/(admin)/admin/<domain>/page.tsx        // list + metrics
app/(admin)/admin/<domain>/new/page.tsx
app/(admin)/admin/<domain>/[id]/page.tsx
lib/utils/revalidate.ts            // add/confirm the path mapping, call it after every save/delete
```

**Public pages must never import a static content object directly again.** They call `getCms<Domain>()`. The static object from `lib/content/*` moves *inside* the `lib/cms/*.ts` file as the fallback value only — it stays exactly where it is today, it just stops being the primary source.

Good news: `lib/utils/revalidate.ts` **already has entries** for `initiative`, `organisation`, and `partnership` content types, anticipating this work. The plumbing is waiting — you just need the save/delete routes to call it.

---

## 3. Firestore collection plan

`types/firebase.ts` already defines most of what's needed. Two additions:

```ts
export const FIREBASE_COLLECTIONS = {
  ...existing,
  partnerships: "partnerships",     // NEW — partner-with-us tracks + overview
  trainingCohorts: "trainingCohorts", // NEW — promote cohorts out of static config
} as const;
```

| Collection | Shape | Doc IDs |
|---|---|---|
| `homepage` | one doc: `{ announcement, heroSlides[], ticker, programmeShowcase[], donationCampaign, featuredStory, joinCtaCards[], newsletterSignup, floatingElements }` | single doc, id `main` |
| `initiatives` | `InitiativePage` shape | slug (`girls-in-tech`, `youth-academy`, …) — matches existing `getCmsArticleById`-style lookup |
| `forOrganisations` | `OrganisationServicePage` shape | slug, + one doc `_overview` for `OrganisationOverviewContent` |
| `partnerships` (new) | `PartnershipTrackPage` shape | slug, + one doc `_overview` for `PartnershipOverviewContent` |
| `trainingCohorts` (new) | `TrainingCohort` shape | auto-id, same CRUD shape as `jobListings` |
| `impactStats` | the 4 headline stats (`heroStats`) | single doc, id `main` |
| `siteContent` | generalize existing `SitePage` pattern | slugs: `who-we-are`, `team`, `partners`, `careers`, `testimonials` (already there) **+ add** `apply-for-training`, `apply-for-training-who-can-apply`, `apply-for-training-how-it-works`, `news-and-updates`, `our-impact`, `our-impact-reports`, `our-impact-sdgs`, `contact` |
| `settings` | editable business content only (see §7) | single doc, id `main` |

**`impactStats` is high-leverage.** `heroStats` from `site-config.ts` is imported directly into a dozen places (homepage counter, every `SitePage` hub's `stats` field, impact overview). Wire *one* `lib/cms/impact-stats.ts` getter and every one of those callers switches from `heroStats` (static) to `getCmsImpactStats()` — a single small feature unlocks a lot of editable surface.

---

## 4. Handling the deeply nested content (initiatives, services, tracks)

An `InitiativePage` has ~12 nested arrays (gallery, testimonials, partners, FAQs, howItWorks, impactStats, audience groups/eligibility, objectives…). Building a dedicated repeater UI for every array across 8 initiatives + 4 org services + 5 partnership tracks before anything ships is its own multi-week project. Don't front-load that.

**Tier 1 (ships first):** Top-level fields (title, eyebrow, description, tagline, heroImage, mission) get real form inputs. Everything that's an array of objects (gallery, faqs, testimonials, howItWorks, focusCards, scenarios, etc.) goes into a single **structured JSON textarea**, validated with zod on submit (parse → validate shape → reject with a clear field-level error on failure). This is not a new idea in this codebase — `ArticleForm.contentHtml` already does exactly this ("temporary rich text bridge until TipTap lands"). Same move, same honesty about it being a bridge.

**Tier 2 (post-launch iteration):** Replace the JSON bridge one array at a time with a real add/remove/reorder repeater component, prioritized by whichever section your editors actually touch most (my guess: gallery and FAQs first, scenarios/case-studies last).

This keeps Phase 4–5 below to "build the form once, reuse the component for initiatives/services/tracks" instead of three bespoke UIs.

---

## 5. Phased roadmap

| Phase | Scope | Size | Depends on |
|---|---|---|---|
| **0** | Cleanup (§8) + decide team/jobs seed strategy | S | — |
| **1** | Homepage doc + Contact page + Settings | M | Phase 0 |
| **2** | `trainingCohorts` as its own tiny collection (reuse `jobs` pattern almost verbatim — dates/status change often, deserves fast editing) | S | — |
| **3** | Generic "Site Page" admin editor (title/description/intro/stats/sections/ctas/related) + extend `siteContent` fallback map to all hub pages | M | Phase 0 |
| **4** | Initiatives — Tier 1 form, `lib/cms/initiatives.ts`, wire `/what-we-do/**` | L | §4 pattern |
| **5** | Organisation services + Partnership tracks — reuse the Phase 4 form component | M+M | Phase 4 |
| **6** | Impact pages (reports/sdgs/testimonials-page copy) — extends Site Page pattern with a JSON bridge for `reportResources`/`goals` | M | Phase 3 |
| **7** | Training landing/eligibility/how-it-works copy — mostly prose, low complexity | S–M | Phase 3 |
| **8** | Seeding script (§6) + full regression pass + security review | M | everything above |
| **9** (backlog) | Tier 2: replace JSON bridges with real repeaters, prioritized by editor feedback | ongoing | Phase 8 |

Do Phase 0–3 first even though they're not the flashiest — they establish the generic Site Page editor that Phases 6–7 lean on, and they unblock the org from editing contact info and homepage messaging without a deploy, which is probably the actual day-to-day pain point.

---

## 6. Seeding script

Firestore starts empty. Without seeding, "empty collection → fallback to static" is doing all the work and admins would be editing a blank slate instead of real content. Write one script, run it once per environment right after Firebase Admin credentials land:

```ts
// scripts/seed-firestore.ts
// Imports every lib/content/* export and upserts it into the matching
// collection/doc-id using { merge: true } — same idempotent pattern
// already used in lib/cms/articles.ts saveCmsArticle().
```

Seed targets: homepage doc, 8 initiative docs, 4 org-service docs + `_overview`, 5 partnership docs + `_overview`, `trainingCohorts` (3 docs from `trainingCohorts` const), impactStats doc, all `siteContent` slugs listed in §3, contact doc, settings doc.

Re-runnable safely (keyed by slug, `merge: true`), so it doubles as a disaster-recovery reset if a collection gets corrupted.

---

## 7. Settings: split what's actually editable

`adminSettingsGroups` today mixes two different kinds of things — keep them separate going forward:

- **Env-only, never CMS-editable:** Firebase project ID, Brevo API key, admin credentials, portal API URL. These stay exactly as they are (read from `process.env`, shown as configured/missing in the admin UI, no write path — writing secrets through a web form is a bad idea).
- **Actually content, should be CMS-editable:** site title/description, default OG image, contact channels (email/phone/address — currently hardcoded in `contact-config.ts` **and** duplicated in `site-footer.tsx`'s static contact snippet), social links (currently hardcoded in `site-footer.tsx`). Give these a `settings` Firestore doc + a small admin form; have the footer and contact page both read from `getCmsSettings()` instead of each hardcoding its own copy of the phone number.

---

## 8. Cleanup to fold in (small, but worth doing while you're in these files)

- Delete `lib/firebase/admin.ts.bak` — dead file, uses the old `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` env vars instead of the current `FIREBASE_SERVICE_ACCOUNT_BASE64` approach in `admin.ts`. Leaving it around risks someone editing the wrong file later.
- `lib/cms/admin-config.ts` → `adminSettingsGroups` still shows `"FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY missing"` as the fallback label for the Firebase settings group — that's stale, doesn't match how `admin.ts` actually reads credentials now.
- `lib/content/site-config.ts` exports its own `articles` array (5 items) that's separate from and unused compared to `lib/content/news-config.ts`'s `articles` (8 items, richer, actually wired into `lib/cms/articles.ts`). Remove the dead one so nobody edits it thinking it does something.
- `lib/firebase/auth.ts` → `createAdminSessionCookie` has `console.log("Creating admin session cookie for ID token:", idToken)` — logs a raw Firebase ID token server-side. Drop it before this handles real traffic.
- Decide and document: are `team` and `jobs` intentionally "launch empty, CMS-only" (no seed fallback), or do they need real seed content like everything else? Right now it's ambiguous — `getCmsTeamMembers`/`getCmsJobs` silently return `[]` when Firestore isn't configured, which is a different failure mode than the rest of the site (which degrades to real content, not an empty state).

---

## 9. Security notes

- All writes already go through `requireAdminApiSession()` on the server using the Firebase Admin SDK — the client (`lib/firebase/client.ts`) only ever touches Firebase **Auth**, never Firestore directly. Keep it that way as you add new API routes; every new `route.ts` under `app/api/admin/**` needs the same `requireAdminApiSession()` guard as the existing ones.
- Because there's no client-side Firestore access anywhere in this app, you don't strictly need permissive Firestore security rules — but set them to deny-all-by-default in the Firebase console anyway as defense in depth, in case something ever does call the client SDK directly.
- Confirm the admin-role-assignment story (custom claim → `ADMIN_EMAILS` env var → Firestore `users` collection lookup, per `lib/firebase/auth.ts`) is documented somewhere for whoever onboards the next admin — it's a three-tier fallback and easy to get confused by.

---

## 10. QA checklist per domain

For each domain, before calling it done:

- [ ] Firestore populated → correct content renders on the public page
- [ ] Firestore collection exists but empty → seed fallback renders, no crash
- [ ] `FIREBASE_SERVICE_ACCOUNT_BASE64` unset entirely → whole app still renders from static fallback, admin write routes return `503` with the existing "Firebase Admin is not configured yet" message (same pattern as articles/partners today)
- [ ] Saving in admin → public page reflects the change without a full redeploy (revalidation path fires)
- [ ] Deleting in admin → path is revalidated, page doesn't 500 on a missing doc
- [ ] Admin write route rejects an unauthenticated request

---

## 11. Definition of done

- No page or component under `app/(public)/**` imports directly from `lib/content/*`. That import only exists inside the matching `lib/cms/*.ts` file, as the fallback value.
- Every content domain has: zod validator, authenticated create/update/delete routes, admin list + create + edit UI, and a revalidation entry that actually gets called.
- Firestore has been seeded once per environment so the CMS launches with real content, not blank docs.
- The four cleanup items in §8 are resolved.
- `team` and `jobs` fallback behavior is a deliberate decision, not an accident.
