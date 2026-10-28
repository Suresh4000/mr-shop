# Order and Payment States

Order status and payment status are stored separately. Only the transitions below are allowed. Each transition is performed by one function in `src/lib/orders`, runs in a transaction, and writes an `order_events` row (actor, from, to, time, note).

## Order statuses

`placed`, `confirmed`, `packed`, `shipped`, `delivered`, `cancelled`, `delivery_failed`, `returned_to_origin`, `return_requested`, `returned`

## Payment statuses

`cod_pending`, `collected`, `not_collected`, `void`, `refund_due`, `refunded`

## Allowed transitions

| From (order) | To (order) | Triggered by | Stock effect | Payment after |
|---|---|---|---|---|
| (new) | placed | Customer, via `place_order` | Decrement | cod_pending |
| placed | confirmed | Admin after confirmation | Stays reserved | cod_pending |
| placed | cancelled | Customer, admin, auto-cancel | Restock | void |
| confirmed | cancelled | Customer or admin before shipping | Restock | void |
| confirmed | packed | Admin | None | cod_pending |
| packed | shipped | Admin (tracking required) | None | cod_pending |
| shipped | delivered | Admin | None | collected |
| shipped | delivery_failed | Admin | None yet | not_collected |
| delivery_failed | returned_to_origin | Admin when parcel is back | Restock after inspection | void |
| delivered | return_requested | Customer within window | None | collected |
| return_requested | returned | Admin after receiving and inspecting | Restock if resellable | refund_due |
| returned | (payment) refunded | Admin after manual transfer | None | refunded |

Any other transition is rejected on the server.

## Invariants (must always hold)

- Stock never goes below zero.
- Every `placed` order has exactly one stock deduction; every cancel or return restock happens exactly once.
- `collected` is only set together with `delivered`.
- `shipped` requires courier name and tracking number.
- Revenue figures use `collected` only.
- A cancelled or failed order is never counted as sales.
