# Phase 1 Draft: Planning and Design for MR SHOP

**Status:** Draft for owner review (2026-10-28). Nothing here is approved.
**Context:** Learning reference project, not going live. India-wide COD delivery, 3-day returns window, store name MR SHOP.
**Pending inputs:** COD limits and phone verification are not yet approved. Wherever they appear below, values are placeholders from `cod-business-rules.md`.

## 1.1 Scope and sitemap

Scope follows `project-brief.md` (Must items). Should items (phone OTP, CSV import, invoices, size guide, reports) are marked optional below.

**Storefront pages:** Home, category listing, product details, search results, cart, checkout, login and signup, account and addresses, my orders, order details, About, Contact, Privacy, Terms, Shipping and COD policy, Returns and refund policy, Size guide (optional).

**Admin pages:** Login, dashboard, products, create or edit product, categories, inventory, orders, order details, shipping and tracking, returns, COD pincodes, reports (optional), settings.

**Customer journey:** as in `phases/01-planning-and-design.md` (browse, pick size and colour, cart, login, address and phone, server validation, place COD order, admin confirms, ships, delivers, marks cash collected).

## 1.2 Wireframes (text, mobile first)

### Home
```
[ MR SHOP logo ]            [search] [account] [cart (n)]
-------------------------------------------------------
[ Hero image: new arrivals ]   [Shop now]
-------------------------------------------------------
Categories:  [Casual] [Party] [Ethnic] [Office]
-------------------------------------------------------
New arrivals  (2-column grid on mobile)
[card][card]
[card][card]
-------------------------------------------------------
Pay on delivery  |  3-day returns  |  India-wide delivery
Footer: About, Contact, policies
```

### Category listing
```
Breadcrumb: Home > Party dresses
[Filter: size | colour | price]  [Sort: newest | price]
[card][card]
[card][card]
[Load more]
Empty state: "No dresses match these filters" + [Clear filters]
```
Product card: 4:5 image, name, price, small "Few left" tag when stock is low.

### Product details
```
[ image carousel, 4:5 ]
Name
Price (GST inclusive)
Colour:  (o) (o) (o)
Size:    [S] [M] [L] [XL]    <- sold-out sizes greyed out
Stock note for selected size
[ Add to cart ]
Pay on delivery available | 3-day returns
Description | Fabric and care | Size chart (opens sheet)
```

### Cart
```
Item rows: image, name, size/colour, qty stepper, price, remove
Subtotal
Shipping (free above threshold)
Total (pay on delivery)
[ Checkout ]   (prompts login if guest)
Empty state: "Your cart is empty" + [Browse dresses]
```

### Checkout
```
1. Address: saved addresses or new (name, phone, line 1-2, city, state, pincode)
2. Phone verification (if enabled)
3. Order summary: items, shipping, COD fee, total
   "You pay cash to the courier on delivery"
4. [ Place order ]   (disabled while submitting; idempotency key sent)
Errors: specific polite reasons (pincode not serviceable, over COD limit, out of stock)
```

### Order confirmation
```
Order placed
Order number
Items, address, total to pay on delivery
"We will call or message you to confirm"
[View my orders] [Continue shopping]
```

### Admin orders
```
Filters: status | date | search by number or phone
Table: order no | customer | total | order status | payment status | placed at
Row click -> order details:
  Items, address snapshot, timeline (order_events)
  Actions allowed by current status only:
  Confirm | Mark packed | Enter courier and tracking | Mark delivered and cash collected
  | Mark delivery failed | Cancel | Start return
```

## 1.3 Visual direction (proposal)

| Item | Proposal |
|---|---|
| Palette | Warm off-white background `#FAF7F2`, deep plum `#4A1F3D` for text and buttons, rose `#C75B7A` for accents, soft grey `#E8E2DA` for borders |
| Typography | Headings: Playfair Display. Body and UI: Inter. Both free from Google Fonts |
| Product images | 4:5 ratio, plain light background, up to 5 per product, colour-linked images |
| Product card | Image, name, price; hover or tap shows a second image; no heavy shadows |
| Mobile navigation | Top bar with logo, search icon and cart; hamburger drawer for categories; sticky "Add to cart" bar on product pages |
| States | Skeleton loaders, clear empty states, inline form errors, toast on success |
| Accessibility | Labelled fields, visible focus ring, contrast of at least 4.5:1, one `h1` per page |

## 1.4 Policy drafts (owner must review: these have legal effect)

Because this project is a learning reference, these are templates only. Do not publish them as legal text without review.

**Shipping and COD policy**
- We deliver across India. Orders are paid in cash to the courier on delivery.
- Shipping is [₹79] on orders below [₹1,999] and free above, per the approved COD rules.
- COD is not available on orders above [₹5,000] or to pincodes we do not serve.
- We confirm orders by phone or message. Unconfirmed orders may be cancelled after [48 hours].
- Please keep the exact amount ready. Repeated refused or undelivered orders may lead to COD being disabled for that phone number.

**Returns and exchange policy**
- You may request a return or exchange within **3 days** of delivery.
- Items must be unused, unwashed, with tags and original packaging. [Further conditions: owner to define.]
- Refunds for COD orders are sent by UPI or bank transfer after the returned item is inspected. [Refund timeline: owner to define.]
- Exchanges are subject to stock availability.

**Cancellation policy**
- You can cancel an order any time before it is shipped from your order page.

**Privacy policy (outline)**
- Data collected: name, phone, email, delivery address, order history.
- Use: fulfil orders, contact about orders, prevent fraudulent COD orders.
- Not collected: card or payment data, ID numbers.
- Sharing: courier and email service only, as needed to deliver and notify.
- Contact for data requests: [email to be set].

**Terms (outline)**
- Pricing in INR, GST inclusive. Right to cancel orders for stock or pricing errors.
- Account responsibility. Governing law: India. [Owner to confirm wording.]

## Open items for owner

1. Approve COD limits and phone verification choice (blocks Phase 2 gate).
2. Product categories and rough catalog size (decision log: Pending).
3. Return conditions and refund timeline.
4. Visual direction: accept the proposal above or request changes (two revision rounds max).
5. GST handling: Pending; not needed for a learning build beyond storing a rate per product.
