# Dress Shop Website: Development Plan

> **Status:** Planning complete, implementation not started. Approve Phase 0 and Phase 1 decisions before coding.  
> **Last updated:** 2026-10-28  
> **Goal:** Build a maintainable, responsive dress shop website with **Cash on Delivery only** and a single-admin dashboard.

## Product direction

- **Application:** Next.js App Router, JavaScript, Tailwind CSS
- **Database, auth, image storage:** Supabase (PostgreSQL, Auth, Storage)
- **Payment:** Cash on Delivery only. No online payment gateway in the MVP.
- **Source control:** GitHub (private repository)
- **Deployment:** Vercel or another host suitable for commercial use
- **Shipping:** Manual courier booking, tracking entered by the admin
- **Admin model:** One authorized administrator
- **Architecture:** One modular application. No separate backend service, Redis or microservices unless a demonstrated need emerges.

## Phase plan

Estimates come from the companion spreadsheet `dress-shop-cod-plan.xlsx` (single developer, working days).

| Phase | Focus | Days | Completion evidence |
|---|---|---:|---|
| 0 | Setup and decisions | 1.5 | Decisions approved, accounts created, content plan agreed |
| 1 | Planning and design | 2.5 | Scope, sitemap, wireframes, visual direction, policy drafts approved |
| 2 | Technical foundation | 3.5 | App runs, migrations and RLS verified, seed data, preview deploy |
| 3 | Admin catalog and inventory | 5 (6 with bulk import) | Admin manages categories, products, variants, images and stock |
| 4 | Customer storefront | 9.5 | Browse, search, product page, cart, login, account, policy pages |
| 5 | Checkout and COD | 6.5 (7.5 with phone OTP) | Atomic COD order placement, eligibility rules, emails, cancellation |
| 6 | Admin order management | 5 (6 with invoices) | Status flow, tracking, cash collection, failed delivery, returns |
| 7 | Testing and launch | 6 | Security, functional, device and production checks passed |

**Total:** about 39.5 working days for Must scope, about 45 days (9 weeks) with a 15% buffer. This is a planning estimate, not a commitment. Product photos, design revisions, bugs, courier setup and decision delays can change it.

## Document map: what each document is for

AI assistants have no memory between sessions. These documents are the project memory, so each one has a specific job and a moment when it must be read.

| Document | Purpose | Why it matters | Read when |
|---|---|---|---|
| `../AGENTS.md` | Operating rules for AI assistants | Stops the most damaging mistakes (client-side prices, floats, skipped auth) | Start of every session |
| `README.md` (this file) | Index, phase plan, working rules, status | Tells everyone what is done and what comes next | Start of every session |
| `project-brief.md` | Goal, users, scope, success measures, glossary | Prevents scope drift and shared-vocabulary errors | Before Phase 1, and when scope is questioned |
| `phases/00` to `phases/07` | Tasks, deliverables, acceptance criteria and gate per phase | Defines "done" so work is verifiable | The current phase, every session |
| `architecture-and-data-model.md` | Structure, tables, data rules | Keeps schema and code consistent | Any database or structure work |
| `cod-business-rules.md` | COD eligibility, fees, limits, refusal handling | The business logic that protects margin | Checkout, pricing, admin order work |
| `order-and-payment-states.md` | Allowed order and payment transitions with stock effects | Prevents contradictory records and stock errors | Any order or stock code |
| `security-checklist.md` | Access, data, orders, secrets checks | Release blocker list | Before finishing each feature and before launch |
| `testing-strategy.md` | What to test, how, and minimum coverage | Makes AI output verifiable | When writing or reviewing code |
| `ai-development-guide.md` | How to prompt, review and verify AI work | Keeps AI sessions consistent and safe | Before working with an AI assistant |
| `operations-runbook.md` | Daily admin tasks, COD handling, incident steps | Lets the owner run the shop after launch | Phase 7 handover and after launch |
| `decision-log.md` | Every business and technical decision with status | Single source of truth for choices | Before any rule-dependent work; update on every decision |

## Working rules

- Complete and review one phase before starting the next.
- Do not hard-code secrets or commit real customer data.
- Never trust prices, discounts, stock, shipping, COD eligibility or phone verification supplied by the browser.
- Cash on Delivery only: do not add online payment code, libraries or columns.
- Use database migrations for schema changes and keep them in Git.
- Test critical flows before deploying.
- Documents are the source of truth. If code and documents disagree, resolve it explicitly and update the document in the same change.
- Record every decision in `decision-log.md`. Do not invent business rules that are marked Pending.
- Keep the initial scope focused. Add optional features only after their value and cost are clear.

## Top risks

| Risk | Mitigation |
|---|---|
| Fake or refused COD orders | Phone verification, pincode allow-list, order value cap, per-phone limits |
| Overselling the last size | Atomic `place_order` function, row locks, idempotency key, concurrency test |
| Late product photos and size charts | Start content collection in Phase 0; use seed data meanwhile |
| Inconsistent returns and exchanges | Written policy, defined state flow, returns table |
| Hosting or database free-tier limits | Confirm commercial terms and quotas in Phase 0 |
| Scope creep | Must-only launch scope, deferred list in `project-brief.md`, two design revision rounds |

## Current status

Phases 0 and 1 approved by the owner (2026-10-28). Phase 2 in progress: scaffold, migrations, RLS and seed are done and tested locally; Supabase and hosting accounts are still needed for 2.2 and 2.6. See `phases/02-technical-foundation.md`.
