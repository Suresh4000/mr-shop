# Decision Log

Record decisions here. Replace `Pending` only when the decision is agreed. If a decision changes, add the date and reason rather than rewriting history. AI assistants must not mark a decision Approved.

| Topic | Status | Decision / notes | Owner | Follow-up |
|---|---|---|---|---|
| Payment method | Approved | Cash on Delivery only; no online payments in MVP | Owner | |
| Product range | Pending | Dress categories and rough catalog size | | |
| Brand and store name | Approved | MR SHOP | Owner | |
| Design direction | Approved | Draft in `phase-1-draft.md` (plum and rose palette, Playfair Display and Inter, 4:5 images) | Owner | |
| Launch strategy | Proposed | MVP first, then improve | | |
| Variants | Proposed | Size and colour variants from day one | | |
| Customer accounts | Proposed | Login required before checkout; guests browse and keep a cart | | |
| Delivery area | Approved | India-wide, approved by owner 2026-10-28. Pincode allow-list still needed for COD eligibility | Owner | |
| COD limits | Approved | Approved by owner 2026-10-28: max COD order INR 5,000; max 10 items; max 2 open COD orders per phone; auto-cancel unconfirmed after 48 hours; COD fee INR 0. Stored as settings, not hard-coded | Owner | |
| Shipping charges | Approved | Flat INR 79; free at or above INR 1,999 subtotal (approved 2026-10-28; boundary read as >=) | Owner | |
| Phone verification | Approved | Skipped for this learning build (decided 2026-10-28). Phone format validation, per-phone limits and admin confirmation still apply | Owner | Revisit if ever live |
| Returns and exchanges | Approved | 3-day window, approved by owner 2026-10-28. Conditions and refund method still open | Owner | Define conditions and refund method |
| Tax and invoice | Pending | GST rates per product; invoice format; confirm with accountant | | |
| Coupons | Approved | Excluded from MVP | | |
| Admin model | Proposed | One authorized administrator | | |
| Shipping workflow | Proposed | Manual courier booking and tracking entry | | |
| Notifications | Proposed | On-screen plus email; WhatsApp or SMS later | | |
| Hosting | Approved | Learning reference project, not going live. Vercel free (Hobby) is acceptable for this purpose. If the project ever goes live, move to a commercial-use plan first (Vercel Pro or another host) | Owner | |
| Domain | Pending | | | |
| Launch date | Pending | | | |
| Budget | Pending | Hosting, database, email, SMS, domain, photography | | |

## Approval record

- Phase 0 and 1 approved by: Owner (Suresh)
- Approval date: 2026-10-28
- Approved scope version: Pending
- Open blockers: Pending

## Change log

- 2026-10-28: Initial planning draft created. Payment method set to COD only.
- 2026-10-28: Owner selected India-wide delivery, a 3-day returns window and Vercel free hosting. Hosting flagged as conflicting with commercial-use requirement; left Pending.
- 2026-10-28: Owner approved India-wide delivery and 3-day returns window. Project declared a learning reference, not for live use, so Vercel free hosting approved. Store name set to MR SHOP.
- 2026-10-28: Phase 1 draft created (`phase-1-draft.md`): sitemap, seven wireframes, visual direction proposal, policy drafts. Not approved.
- 2026-10-28: Owner approved COD limits, shipping rule and the Phase 1 draft; phone verification skipped. Phase 2 started.
