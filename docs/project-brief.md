# Project Brief

## Goal

Launch an online dress shop where customers can browse, choose a size and colour, and order with Cash on Delivery. The owner manages catalog, stock, orders, shipping and cash collection from a simple admin dashboard.

## Success measures

- A customer can place a COD order on a phone in under 3 minutes.
- No order can oversell stock, even with simultaneous checkouts.
- The owner can add a product, process an order and record a delivery without developer help.
- Revenue figures count only cash that was actually collected.
- Failed deliveries and returns restock correctly and are visible in reports.

## Users

| Role | Can do |
|---|---|
| Guest | Browse, search, filter, keep a cart. Must log in to check out. |
| Customer | Manage profile and addresses, place COD orders, view only their own orders and status, cancel before shipping, request a return |
| Administrator | Manage categories, products, variants, images, stock, orders, tracking, cash collection, returns, COD pincodes |

Initial scope is one authorized administrator.

## In scope (Must)

Category and product browsing, size and colour variants with per-size stock, search and filters, cart, COD checkout with eligibility rules, customer account and order history, admin catalog and inventory, admin order management with manual shipping, cash collection tracking, failed delivery and returns handling, required policy pages, basic SEO and responsive design, transactional email.

## In scope (Should)

Phone OTP verification, CSV product import, printable packing slip and GST invoice, size guide page, basic reports.

## Out of scope (deferred)

Online payments, courier API automation, coupons and discount engine, loyalty and referrals, product reviews, wishlist, multiple admin roles or warehouses, WhatsApp Business API automation, mobile app, recommendations.

## Glossary

| Term | Meaning |
|---|---|
| COD | Cash on Delivery: the customer pays the courier in cash (or as agreed) at delivery |
| RTO | Return to origin: a parcel that could not be delivered and comes back to the shop |
| Variant | One sellable size and colour combination of a product, with its own SKU, price and stock |
| SKU | Unique code for one variant |
| Paise | 1/100 of a rupee. All money is stored as integer paise. |
| Snapshot | A copy of name, price, SKU and address saved on the order so later edits do not change history |
| Idempotency key | A unique token sent with an order request so a repeated request cannot create a second order |
| RLS | Row Level Security: database rules that limit which rows a user can read or change |

## Open questions

Tracked in `decision-log.md`. Each unknown needs an owner and a follow-up date.
