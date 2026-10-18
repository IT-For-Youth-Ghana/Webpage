# IT For Youth Ghana

This branch is the Next.js rebuild foundation for the IT For Youth Ghana website.

## What This Pass Includes

- Next.js App Router scaffold with shared public and admin layouts
- New public information architecture from `ITFY_Complete_Rebuild_Plan_v4.md`
- `/programs/**` compatibility routes backed by a migrated course integration layer
- Static seed content for homepage sections, initiatives, partnerships, and article routes
- Firebase-ready types, validation helpers, middleware, and admin route scaffolding
- Redirect coverage for the major legacy React Router paths

## Getting Started

```bash
npm install
npm run dev
```

## Current Scope

This pass is intentionally a foundation-only rebuild. It does not yet include:

- Full homepage interactions and polished section implementations
- Live Firebase Auth / Firestore / Storage wiring
- Working admin CRUD screens
- Production integrations for contact, newsletter, or application delivery

## Key Routes

- `/`
- `/what-we-do`
- `/apply-for-training`
- `/programs`
- `/partner-with-us`
- `/admin-login`
