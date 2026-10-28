# Phase 1: Planning and Design

**Estimate:** 2.5 working days  
**Dependency:** Phase 0 gate met  
**Status:** Approved by owner 2026-10-28
**Purpose:** Agree what is built and how it looks before coding.

## Tasks

| ID | Task | Deliverable |
|---|---|---|
| 1.1 | Requirements and sitemap | Final scope and page list (see `../project-brief.md`) |
| 1.2 | Wireframes | Home, listing, product, cart, checkout, order confirmation, admin orders |
| 1.3 | Visual direction | Colours, typography, product card style, image ratios, mobile navigation |
| 1.4 | Policy drafts | Shipping, COD terms, returns and exchange, cancellation, privacy, terms |

## Sitemap

**Storefront:** Home, category listing, product details, search results, cart, checkout, login and signup, account and addresses, my orders, order details, About, Contact, Privacy, Terms, Shipping and COD policy, Returns and refund policy, Size guide.

**Admin:** Login, dashboard, products, create or edit product, categories, inventory, orders, order details, shipping and tracking, returns, COD pincodes, reports, settings.

## Core customer journey

1. Customer opens the storefront and browses or searches.
2. Opens a dress, picks size and colour, sees stock for that size.
3. Adds to cart; logs in if needed.
4. Enters or selects an address and phone.
5. Server validates prices, stock, shipping, COD eligibility.
6. Customer reviews the total and places a "Pay on delivery" order.
7. Order is recorded atomically; customer sees confirmation and receives email.
8. Admin confirms by phone or WhatsApp, packs, books courier, enters tracking.
9. Courier delivers; admin marks cash collected.

## UI planning checklist

- Brand name, logo, colours, typography
- Product card and image style, aspect ratio for dress photos
- Size chart presentation on mobile
- Loading, empty, success and error states
- Accessibility basics: labels, focus, contrast, semantic headings

## Acceptance criteria

- Sitemap and journey approved.
- Wireframes cover the seven key screens.
- Policy drafts exist and match the decision log.
- Visual direction approved with at most two revision rounds.

**Gate:** Do not start Phase 2 until scope and wireframes are approved.

## Notes for AI assistants

You may draft wireframe descriptions and policy text. Policy text with legal effect must be reviewed by the owner.
