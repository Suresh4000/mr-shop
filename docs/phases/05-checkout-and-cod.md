# Phase 5: Checkout and COD

**Estimate:** 6.5 working days (7.5 with phone OTP)  
**Dependency:** Phases 3 and 4 complete  
**Status:** Not started  
**Rules reference:** `../cod-business-rules.md`, `../order-and-payment-states.md`

## Tasks

| ID | Task | Priority |
|---|---|---|
| 5.1 | Server pricing module | Must |
| 5.2 | COD eligibility rules | Must |
| 5.3 | Phone verification | Should (recommended) |
| 5.4 | Atomic order placement function | Must |
| 5.5 | Checkout UI | Must |
| 5.6 | Order confirmation page and number | Must |
| 5.7 | Transactional emails | Must |
| 5.8 | Customer cancellation before shipping | Must |
| 5.9 | Abuse protection | Must |

## Server validation (5.1, 5.2)

The server must:
- Load current prices from the database; reject unknown, unpublished or archived variants.
- Validate quantity against current stock and the item limit.
- Calculate shipping, COD fee and GST per approved rules in integer paise.
- Check COD eligibility: allowed pincode, order value cap, phone present and verified (if enabled), open-order limit per phone.
- Reject stale or invalid cart lines with a clear message.

All of this lives in `src/lib/pricing` and `src/lib/orders`. It is the only place totals and eligibility are decided.

## Order placement (5.4)

One Postgres function, called from a server action, that in a single transaction:
1. Locks the stock rows for the variants (`SELECT ... FOR UPDATE`, in a consistent order to avoid deadlocks).
2. Re-checks stock; fails the whole order if any line is short.
3. Creates the order with status `placed` and payment `cod_pending`.
4. Saves the item snapshot (name, SKU, size, colour, unit price, GST rate) and the address snapshot.
5. Decrements stock and writes an order event.
6. Honors the idempotency key: a repeated request returns the existing order instead of creating another.

## Other requirements

- **UI (5.5):** Clear "Pay on delivery" wording, total including shipping and fee, edit-address step, disabled button while submitting.
- **Confirmation (5.6):** Unique order number, summary, expected next steps.
- **Emails (5.7):** Order placed, shipped (with tracking), delivered. Failures to send must not roll back the order; log and retry.
- **Cancellation (5.8):** Allowed before `shipped`; restocks automatically through the same transition rules.
- **Abuse protection (5.9):** Rate limits per IP and phone, honeypot field, auto-cancel of unconfirmed orders after the approved number of hours.

## Acceptance criteria

- Server totals match the displayed checkout for valid carts.
- Tampered prices, quantities or variant IDs are rejected.
- Duplicate submissions create one order and one stock deduction.
- Two simultaneous orders for the last unit: exactly one succeeds.
- Ineligible orders (pincode, value cap, item limit, open-order limit) are refused with a clear message.
- Cancellation and auto-cancel restock correctly.
- Payment state stays `cod_pending` until collection is confirmed in Phase 6.

**Gate:** Concurrency and duplicate-order tests must pass before Phase 6 begins.

## Notes for AI assistants

Never compute totals in components. Never call stock updates from the client. Add no payment gateway code.
