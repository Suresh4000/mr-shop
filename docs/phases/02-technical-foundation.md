# Phase 2: Technical Foundation

**Estimate:** 3.5 working days  
**Dependency:** Phase 1 approved  
**Status:** Phase 2 complete. Tasks 2.1-2.5 verified on live Supabase (2026-10-28). Ready for Phase 3 / Phase 4.

## Tasks

| ID | Task | Deliverable |
|---|---|---|
| 2.1 | Project scaffold | Next.js, Tailwind, ESLint, private repo, CI checks |
| 2.2 | Supabase and environments | Dev and prod projects, `.env.example`, redirect URLs |
| 2.3 | Database migrations | All tables in `../architecture-and-data-model.md` |
| 2.4 | Row Level Security | Policies with tests for anonymous, customer, admin |
| 2.5 | Seed script | Sample categories, products, sizes, stock |
| 2.6 | Preview deployment | Build passes on hosting, no secrets in client bundle |

## Setup

Check Node.js LTS compatibility with the chosen Next.js release, then review current `create-next-app` options before running it:

```bash
npx create-next-app@latest dress-shop --js --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Likely packages: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `lucide-react`, plus `vitest` and `@playwright/test` for testing. **Do not install any payment library.** Check current documentation before integrating any package.

## Environment rules

- `.env.local` is never committed. `.env.example` holds placeholders only.
- Public browser variables contain no secrets.
- The Supabase service-role key is server-only.
- Separate development and production credentials.

## Acceptance criteria

- App starts locally and builds.
- Repository is private, clean and connected to preview deployment.
- Migrations are version-controlled and apply from scratch.
- RLS tests prove: anonymous users read only published catalog data; customers read only their own addresses and orders; only admins write catalog and manage orders.
- Seed script creates a usable demo catalog.
- Secrets are absent from the repo and client bundle.

**Gate:** No customer-facing feature may use a production database until access rules and environment separation are verified.

## Notes for AI assistants

Create migrations as files, never by manual dashboard edits. Write RLS tests alongside policies. Ask before adding any dependency not listed here.

## Progress (2026-10-28)

| ID | State | Evidence |
|---|---|---|
| 2.1 Project scaffold | Done | `npm run lint`, `npm run test` (4 unit tests) and `npm run build` pass. CI workflow in `.github/workflows/ci.yml`. Connected to GitHub repo `Suresh4000/mr-shop` on `main` |
| 2.2 Supabase and environments | Done | Supabase project `uvsoljzfwnyfemxpyzqc` connected. Client configured with anon & publishable keys |
| 2.3 Database migrations | Done | Core schema, RLS and storage migrations applied on Supabase |
| 2.4 Row Level Security | Done | Applied and verified on live Supabase |
| 2.5 Seed script | Done | Applied: 4 categories, 8 products, 64 variants with stock, 5 demo pincodes live |
| 2.6 Preview deployment | Not started | Needs hosting account and Supabase project |

Not built yet by design: `place_order` (Phase 5), order status transition functions (Phase 6), pricing module (Phase 5), `requireUser()` and `requireAdmin()` helpers (Phase 3).
