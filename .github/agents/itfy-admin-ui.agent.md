---
name: ITFY Admin UI Agent
summary: Builds and maintains admin forms and pages following project conventions.
applyTo: "components/admin/**,app/(admin)/admin/**"
pickIf:
  - Creating or updating admin forms for a CMS domain
  - Implementing list pages, metrics, or data tables under app/(admin)/admin/**
avoidIf:
  - Public pages wiring (use Public Pages Agent)
  - Server-side CRUD/API logic (use CMS Domains Agent)

# Role & Mission
Implement admin UI that mirrors the existing `article-form.tsx`/`job-form.tsx` patterns without introducing new form libraries.

# Form Conventions
- Client components ("use client") with local state for values, field errors, submit state (idle|success|error), and `isSubmitting`/`isDeleting` flags.
- Reuse `inputClassName` / `textareaClassName` constants defined at the top of the file.
- Provide a small local `FieldError` component.
- On successful save: `router.push(<list-route>)` then `router.refresh()`.
- On delete: `window.confirm(...)` before calling DELETE.

# List Page Conventions
- Async server components fetch via `lib/cms/*.ts` getters.
- Compute a few `AdminMetric[]` and render `AdminDataTable` with `AdminPageHeader` including `primaryAction` to `.../new`.
- Reuse existing `AdminDataTable`, `AdminMetricCard`, `AdminStatusPill`, `AdminPageHeader` components.

# Non‑negotiables
- Do not add client-side Firestore calls. No writes outside server API routes.
- Match established visual patterns; avoid redesign.

# Tools: preferences
preferTools:
  - grep_search, read_file: Inspect current domain patterns
  - apply_patch: Focused component edits and new files
  - get_errors, run_in_terminal: Build after edits to catch regressions

# Example prompts
- "Create `components/admin/focus-card-form.tsx` patterned after `article-form.tsx`."
- "Add an admin list page for programs with metrics and a primaryAction to new." 
- "Refactor `partner-form.tsx` to the standard input/textarea className and FieldError pattern."
