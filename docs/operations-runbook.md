# Operations Runbook

For the shop owner and admin. Used in Phase 7 handover and after launch.

## Daily routine

1. Open Admin > Orders, filter status `placed`.
2. Confirm each order by phone or WhatsApp; mark `confirmed`, or cancel if the customer does not respond within the approved window.
3. Pack confirmed orders; mark `packed`.
4. Book the courier, enter courier name, tracking number and URL; mark `shipped`.
5. Check shipped orders against courier updates; mark `delivered` (cash collected) or `delivery_failed`.
6. Check Admin > Inventory for low-stock items.

## Adding a product

1. Admin > Products > New.
2. Enter name, description, fabric and care, category, GST rate.
3. Add variants (size and colour), SKU, price, stock.
4. Upload images in order; set the first as the main image.
5. Publish after checking the product page on a phone.

## Handling COD outcomes

| Situation | Action |
|---|---|
| Customer paid at delivery | Mark delivered and collected; confirm amount |
| Customer refused or unreachable | Mark delivery failed; when parcel returns, mark returned to origin and restock after inspection |
| Customer wants to cancel before shipping | Cancel the order; stock restocks automatically |
| Customer wants to return | Approve per policy, receive and inspect, restock if resellable, record refund due, send refund by UPI or bank transfer, mark refunded |
| Size exchange | Create the linked exchange order from the return screen |

## Repeat refusals

Review the failed-delivery report weekly. Phones with repeated failures are flagged; block them or reduce COD limits if the return rate is high.

## Incident steps

| Problem | First steps |
|---|---|
| Site down | Check hosting dashboard and status pages; roll back to the last good deployment |
| Wrong stock shown | Do not edit the database by hand; use an inventory adjustment with a reason; report the bug |
| Customer sees another person's data | Treat as critical: take affected pages offline, rotate keys, review RLS, record in decision log |
| Orders not arriving by email | Check email service dashboard; orders still exist in admin |
| Admin cannot log in | Follow the documented admin recovery steps |

## Backups and recovery

Document the backup schedule, who restores, and the last tested restore date here after Phase 7.

## Contacts

Fill in: developer, hosting support, courier support, accountant.
