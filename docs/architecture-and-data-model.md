# Architecture and Data Model

## Proposed architecture

- **Next.js App Router:** storefront, admin UI, server-rendered pages and server-side logic (server actions, minimal route handlers).
- **JavaScript** as the project language.
- **Tailwind CSS** for responsive styling.
- **Supabase PostgreSQL:** relational data, constraints, and the atomic `place_order` function.
- **Supabase Auth:** customer and admin identity.
- **Supabase Storage:** product images with explicit access policies.
- **Email service:** transactional email only.
- **GitHub** for source control; **Vercel or suitable host** for deployment.

Keep the system a single modular application. Add services only when a real requirement justifies their cost and operational weight. There is no payment provider integration.

## Directory structure

```text
dress-shop/
├── AGENTS.md
├── docs/
├── src/
│   ├── app/
│   │   ├── (store)/        page.js, products, categories, cart, checkout, orders, account
│   │   ├── admin/          dashboard, products, categories, inventory, orders, returns, pincodes
│   │   └── api/            minimal route handlers
│   ├── actions/            validated server actions
│   ├── components/
│   └── lib/
│       ├── supabase/       server and browser clients
│       ├── pricing/        the only place totals are computed
│       ├── inventory/      stock rules
│       ├── orders/         status transition rules, COD eligibility
│       ├── auth/           requireUser(), requireAdmin()
│       └── validations/    Zod schemas
├── supabase/migrations/
├── tests/                  unit and e2e
├── public/
├── .env.example
└── package.json
```

## Data model

| Table | Purpose | Important considerations |
|---|---|---|
| `admin_users` | Authorized administrator | Linked to auth user; checked server-side |
| `categories` | Dress categories | Unique slug, display order, published flag |
| `products` | Style-level record | Slug, description, fabric and care, GST rate (basis points), published or archived |
| `product_variants` | Size and colour SKUs | Unique SKU, price in paise, one row per size and colour |
| `product_images` | Image metadata | Storage path, display order, optional colour link |
| `inventory` | Stock per variant | Available count; changed only by database functions |
| `inventory_adjustments` | Stock audit trail | Variant, change, reason, actor, time |
| `addresses` | Customer address book | Owned by one customer; RLS enforced |
| `cod_pincodes` | Serviceable COD pincodes | Active flag, optional shipping override |
| `orders` | Order header | Order number, totals in paise, address snapshot, order status, idempotency key |
| `order_items` | Purchased lines | Snapshot of name, SKU, size, colour, unit price, GST rate |
| `payments` | Payment record | Method fixed to `cod`; payment status; collected amount and date |
| `order_events` | Audit history | Actor, from and to state, timestamp, note |
| `returns` | Returns and exchanges | Order item, reason, status, refund details, linked exchange order |
| `phone_flags` | COD risk tracking | Phone hash or number, failed-delivery count, blocked flag |

This is an initial design, not a final migration. Confirm variants, tax, shipping and return rules in the decision log before creating the production schema.

## Data rules

- Money is integer paise. Prices are GST-inclusive unless the decision log says otherwise.
- Recalculate all authoritative totals on the server.
- Snapshot item and address data on the order so later edits never rewrite history.
- Order status and payment status are separate columns, changed only through the allowed transitions.
- Use constraints for required fields, uniqueness, non-negative stock and valid enum values.
- Use foreign keys with deliberate delete behaviour; archive instead of delete for anything referenced by orders.
- Order placement is one Postgres function with row locks and an idempotency key.
- Do not store card data or any online payment identifiers.
- All schema changes are migrations in Git.

## Core modules

- `lib/pricing`: subtotal, shipping, COD fee, GST, total (paise)
- `lib/orders`: eligibility checks and transition table
- `lib/inventory`: reservation and release helpers calling database functions
- `lib/auth`: `requireUser()` and `requireAdmin()`
- `lib/validations`: Zod schemas for every input
- `actions/`: thin server actions that authorize, validate, then call the modules above

## Hosting and cost notes

- Free tiers suit development and limited testing; quotas and terms can change. Verify commercial-use terms, database and storage limits, backups and support before launch.
- Avoid paid analytics, SMS or caching services unless required. SMS is needed only if phone OTP is approved.
