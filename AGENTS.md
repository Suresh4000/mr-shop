# AGENTS.md: Instructions for AI Coding Assistants

This file is the first thing an AI assistant must read in every session. The project docs are your memory: you do not remember earlier sessions, so the documents are the only reliable record of what was decided and built.

## 1. Project in one paragraph

A dress shop e-commerce site. Customers browse dresses (sizes and colours), add to cart, and place orders paid by **Cash on Delivery only**. One administrator manages the catalog, stock and orders, books couriers manually, and records tracking and cash collection. Stack: Next.js App Router (JavaScript), Tailwind CSS, Supabase (PostgreSQL, Auth, Storage).

## 2. Read order at the start of every session

1. `docs/README.md` (phase plan, current status)
2. The current phase file in `docs/phases/`
3. `docs/decision-log.md` (do not contradict approved decisions)
4. `docs/cod-business-rules.md` and `docs/order-and-payment-states.md` when touching checkout, orders or stock
5. `docs/architecture-and-data-model.md` when touching the database or folder structure
6. `docs/security-checklist.md` before finishing any feature that touches data or access

## 3. Non-negotiable rules

1. **Never trust the browser.** Prices, discounts, shipping, COD fee, stock, COD eligibility and phone verification are always decided on the server.
2. **Money is integer paise.** No floating point for money. Totals are computed only in `src/lib/pricing`.
3. **COD only.** Do not add Razorpay, Stripe or any payment library, route or table column for online payments. Payment method is fixed to COD.
4. **Order state and payment state are separate** and change only through the allowed transitions in `docs/order-and-payment-states.md`.
5. **Order placement is one atomic database function** with row locks and an idempotency key. Never decrement stock from client code or in separate non-transactional calls.
6. **Authorize on the server, every time.** Every server action and API route calls its own auth check (`requireAdmin()` or `requireUser()`). Hiding UI is not security.
7. **Row Level Security stays on** for every exposed table. A customer can only read their own addresses and orders.
8. **No secrets in code or Git.** `.env.local` is ignored; `.env.example` has placeholders only. The Supabase service-role key is server-only.
9. **Schema changes are migrations** in `supabase/migrations/`, committed to Git. Never edit the database by hand and forget the migration.
10. **Preserve history.** Order items and addresses are snapshots. Archive products, never delete ones that appear in orders.
11. **No new dependencies without need.** Check the phase file and ask before adding a package. Record additions in `docs/decision-log.md`.
12. **Do not store card data, ID numbers or anything not needed to fulfil an order.**

## 4. How to work

- Work on **one task ID** at a time (for example `5.4` in `docs/phases/05-checkout-and-cod.md`). Do not start a later phase until the current phase gate is met.
- Before coding, restate the task, list files you will change, and note which rules above apply.
- Keep changes small and reviewable. One feature per commit. Commit messages: `type(scope): summary` (for example `feat(checkout): add place_order function`).
- Write or update tests for pricing, status transitions and access control in the same change.
- Update the relevant doc in the same change when behaviour, schema or decisions change. If code and docs disagree, stop and flag it; do not silently pick one.
- If a requirement is unclear or marked Pending in the decision log, **ask**. Do not invent business rules (COD limits, GST rates, return window, shipping charges).
- Never mark a task done without running lint, build and the relevant tests, and reporting the results honestly.

## 5. Commands

```bash
npm install
npm run dev        # local development
npm run lint
npm run build
npm run test       # unit tests (Vitest)
npm run test:e2e   # end to end tests (Playwright; needs browsers installed)
npm run test:db    # migrations, seed and RLS tests on a local Postgres (needs psql)
```

Update this section if the scripts change.

## 6. Folder map

```text
src/app/(store)/     customer pages
src/app/admin/       admin pages
src/app/api/         route handlers (keep minimal)
src/actions/         validated server actions
src/lib/supabase/    server and browser clients
src/lib/pricing/     the only place totals are computed
src/lib/inventory/   stock rules
src/lib/orders/      status transition rules
src/lib/validations/ Zod schemas
src/components/      reusable UI
supabase/migrations/ versioned SQL
docs/                project documents
```

## 7. Definition of done

- Behaviour matches the phase file and acceptance criteria.
- Server-side validation and authorization are in place and tested.
- Lint and build pass; relevant tests pass.
- Loading, empty and error states exist for UI.
- Mobile layout checked.
- Docs and decision log updated.
- No secrets, no debug logs with personal data.

## 8. When finishing a session

Report: what changed, files touched, tests run and results, anything not verified, open questions, and the next task ID. Update the `Status` line in the phase file.

## 9. Next.js version note

<!-- BEGIN:nextjs-agent-rules -->
This project uses a recent Next.js with breaking changes from older versions. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
