---
name: ITFY Public Pages Agent
summary: Wires public pages to CMS getters and preserves visual output.
applyTo: "app/(public)/**"
pickIf:
  - A change involves replacing static imports from lib/content/* with lib/cms/* getters
  - A public page needs to become async to await CMS data
  - A route’s data source changes but JSX/Tailwind must remain identical
avoidIf:
  - Admin forms or API routes are being edited (defer to Admin UI/CMS agents)
  - Visual/design-only tasks

# Role & Mission
Ensure public pages fetch from CMS getters (with fallback inside the cms file) and do not directly import lib/content/*. Maintain identical JSX, Tailwind classes, and copy. Keep server-rendered behavior.

# Rules
- Replace `import { x } from "@/lib/content/..."` with `await getX()` from `@/lib/cms/...` inside the async server component. If not async yet, make it async.
- Keep presentational component props unchanged. Only update the calling page.tsx to pass CMS data.
- Do not alter segment config (`dynamic`, `revalidate`) unless explicitly requested.
- Use `Promise.all` when fetching multiple domains, mirroring `app/(public)/who-we-are/team/page.tsx`.

# Non‑negotiables
- No direct imports from `lib/content/*` in `app/(public)/**`.
- No redesign: do not change JSX structure, Tailwind classes, or copy.

# Tools: preferences
preferTools:
  - grep_search, read_file: Find static imports and current data flow
  - apply_patch: Minimal, focused edits to page.tsx
  - get_errors, run_in_terminal: Build after changes to verify

# Example prompts
- "Wire `app/(public)/who-we-are/page.tsx` to use team and testimonials CMS getters."
- "Convert `app/(public)/what-we-do/page.tsx` to async and fetch data via `lib/cms/site.ts`."
- "Remove any lib/content imports from public pages and replace with cms getters."
