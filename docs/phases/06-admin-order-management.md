# Phase 6: Admin Order Management

**Estimate:** 5 working days (6 with invoices)  
**Dependency:** Phase 5 complete  
**Status:** Not started

## Tasks

| ID | Task | Priority |
|---|---|---|
| 6.1 | Order list with search and filters | Must |
| 6.2 | Order detail and status flow | Must |
| 6.3 | Courier and tracking entry | Must |
| 6.4 | COD collection and failed delivery | Must |
| 6.5 | Returns and exchanges | Must |
| 6.6 | Dashboard | Must |
| 6.7 | Packing slip and GST invoice | Should |

## Requirements

- **List (6.1):** Search by order number, phone, name; filter by order status, payment status, date.
- **Detail and flow (6.2):** Show items, address snapshot, totals, both statuses, history. Offer only allowed next states. Each change writes an order event with actor and time.
- **Tracking (6.3):** Courier name, tracking number and URL; required before moving to `shipped`; visible to the customer.
- **Collection and failure (6.4):** Mark `delivered` and `collected` with amount and date. For refused or unreachable parcels set `delivery_failed` and `not_collected`; when the parcel is back, mark `returned_to_origin` and restock after inspection. Track failure counts per phone for COD eligibility.
- **Returns (6.5):** Customer requests within the window; admin approves, receives and inspects, restocks if resellable, records the refund due and later `refunded` after manual transfer. Exchanges create a linked new order.
- **Dashboard (6.6):** Pending orders, low stock, recent orders, failed deliveries. Sales totals count only `collected` payments.
- **Invoice (6.7):** Printable packing slip and simple GST invoice with invoice number, after the accountant confirms format.

## Acceptance criteria

- Illegal status jumps are rejected on the server.
- Every change appears in order events.
- Cash collection, failed delivery, return and refund paths each leave stock and payment records consistent.
- Dashboard revenue equals the sum of collected payments for the period.
- Only the admin can use these pages and actions.

**Gate:** Verify authorization and transition rules independently for each server action.

## Notes for AI assistants

Implement transitions in one module (`src/lib/orders`) driven by the table in `../order-and-payment-states.md`. Do not scatter status updates across components.
