# Testing Strategy

AI-generated code is only trustworthy when it is verified. This document defines what must be tested and how.

## Test layers

| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | Pricing, COD eligibility, status transitions, validation schemas |
| Database | SQL tests or scripted checks | RLS policies, constraints, `place_order` function |
| End to end | Playwright | Browse, cart, login, COD checkout, admin order processing |
| Manual | Checklist | Devices, accessibility, policy pages, emails |

## Must-have tests (block merging if missing)

**Pricing and eligibility**
- Subtotal, shipping, COD fee and GST in integer paise for typical and edge carts.
- Free-shipping threshold boundary (just below, equal, just above).
- COD refused above the value cap, over the item limit, outside the pincode list, over the open-order limit.

**Order placement**
- Valid cart creates one order, deducts stock once.
- Same idempotency key twice returns the same order, deducts once.
- Two simultaneous orders for the last unit: one succeeds, one is refused cleanly.
- Tampered price, quantity or variant ID is rejected.

**Status flow**
- Every allowed transition works and leaves stock and payment correct.
- Every disallowed transition is rejected.
- Cancel, failed delivery and return each restock exactly once.

**Access control**
- Customer cannot read another customer's order or address.
- Customer cannot call admin actions or open admin pages.
- Anonymous user cannot read unpublished products or any order.

**Reporting**
- Revenue equals the sum of collected payments; pending, failed and cancelled orders are excluded.

## Definition of a good test

It fails when the rule is broken, uses realistic data (real sizes, colours, paise amounts), and does not depend on test order or leftover data.

## Verification steps before marking a task done

1. `npm run lint` and `npm run build` pass.
2. Relevant unit and database tests pass.
3. For checkout or admin changes, the Playwright path passes.
4. Manually exercise the feature once on a phone-sized screen.
5. Report exactly what was run and what was not.
