# Phase 4: Customer Storefront

**Estimate:** 9.5 working days  
**Dependency:** Phase 3 complete  
**Status:** Not started

## Tasks

| ID | Task |
|---|---|
| 4.1 | Shared layout: header, mobile menu, search entry, cart indicator, footer with policy links |
| 4.2 | Home page: hero, featured categories, new arrivals |
| 4.3 | Listing pages: category, filters (size, colour, price), sorting, pagination, out-of-stock tags |
| 4.4 | Search by name, category, SKU |
| 4.5 | Product detail: gallery, size and colour selector, size chart, per-size stock, delivery and returns info |
| 4.6 | Cart: persistence, quantity changes, unavailable or out-of-stock handling |
| 4.7 | Customer login: email magic link or Google |
| 4.8 | Account: profile, addresses, my orders, order details and status |
| 4.9 | Static pages: About, Contact, Privacy, Terms, Shipping and COD, Returns and refund |
| 4.10 | SEO, responsive and accessibility pass |

## Requirements

- Load only published products from the database.
- Show stock per size; disable sold-out sizes; never show negative or hidden stock numbers beyond "low stock".
- Cart total is a display estimate. The server recalculates at checkout.
- Show shipping only when it can be estimated correctly.
- Avoid fake testimonials, unverified claims and placeholder promotions.
- Publish policy pages early; they are needed for customer trust and any later provider review.
- A customer must never read or change another customer's records.

## Responsive and accessible UI

Test narrow mobile, large mobile, tablet and desktop. Use labels on all fields, meaningful alt text, visible keyboard focus, adequate touch targets and contrast. Reserve image space to avoid layout shift.

## Acceptance criteria

- Pages load data from the intended source.
- Filters, search and product details work.
- Cart handles changes and unavailable items.
- Account and order pages follow authorization rules.
- Layout works on mobile and desktop; loading, empty and error states exist.

**Gate:** Checkout must not rely on cart-supplied prices or quantities without server validation.

## Notes for AI assistants

Build mobile first. Use the visual direction from Phase 1. Do not add a UI library without approval.
