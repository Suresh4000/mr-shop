# MR SHOP (dress shop website)

Learning reference project: an online dress store with **Cash on Delivery only**, a customer storefront and a single-admin dashboard. Not intended to go live.

- Documentation: [`docs/README.md`](docs/README.md). AI assistants must read [`AGENTS.md`](AGENTS.md) first.
- Stack: Next.js App Router (JavaScript), Tailwind CSS, Supabase (PostgreSQL, Auth, Storage).

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev
```

Checks: `npm run lint`, `npm run test`, `npm run build`, `npm run test:db`.

## Status

Phases 0 and 1 approved. Phase 2 (technical foundation) in progress, see `docs/phases/02-technical-foundation.md`.
