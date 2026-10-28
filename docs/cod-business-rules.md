# COD Business Rules

All values marked **Proposed** are defaults to approve in `decision-log.md`. Until approved, AI assistants must treat them as configurable settings, not hard-coded constants. Store them in a settings table or a single config module.

## Why COD needs its own rules

With no prepayment, a customer can order and then refuse or ignore delivery. The shop pays shipping both ways and the stock is tied up. These rules limit that risk without making ordering hard for genuine customers.

## Rules

| Rule | Proposed value | Notes |
|---|---|---|
| Maximum COD order value | 5,000 INR | Above this, COD is not offered |
| Flat shipping charge | 79 INR | Applied below the free-shipping threshold |
| Free shipping above | 1,999 INR | On cart subtotal |
| COD handling fee | 0 INR | Optional; must be shown before ordering |
| Maximum items per order | 10 | Limits bulk fake orders |
| Maximum open COD orders per phone | 2 | Open means not delivered or cancelled |
| Auto-cancel unconfirmed after | 48 hours | Restocks automatically |
| Serviceable pincodes | Allow-list table | Admin-editable |
| Phone verification | OTP or confirmation call | Recommended; decision pending |

## Eligibility check (server side, in order)

1. All variants exist, are published, and have enough stock.
2. Item count is within the limit.
3. Delivery pincode is in the active allow-list.
4. Order total is within the COD value cap.
5. Phone number is present, valid in format, and verified if verification is enabled.
6. Phone has fewer open COD orders than the limit and is not blocked for repeated failed deliveries.

If any check fails, refuse with a specific, polite reason and do not create an order.

## Confirmation

Orders start as `placed`. The admin confirms by phone or WhatsApp before packing. Unconfirmed orders auto-cancel after the approved window.

## Delivery outcomes

| Outcome | Result |
|---|---|
| Delivered and cash paid | Order `delivered`, payment `collected` |
| Refused or unreachable | Order `delivery_failed`, payment `not_collected`; after return, `returned_to_origin` and restock after inspection; increment failure count for the phone |
| Customer cancels before shipping | Order `cancelled`, stock restocked, payment `void` |

## Returns and refunds

- Return window and conditions come from the approved policy (decision pending).
- A refund after a collected COD order is a manual UPI or bank transfer. Collect refund details when the return is approved.
- Exchanges create a linked new order; no second payment unless the price differs.

## Reporting rules

- Revenue equals the sum of `collected` payments only.
- Report failed deliveries, refusals and return rate separately; they show whether COD limits need tightening.

## Tax

Store a GST rate per product and show GST-inclusive prices. Confirm rates and invoice format with the owner's accountant before building invoices. Do not hard-code rates.
