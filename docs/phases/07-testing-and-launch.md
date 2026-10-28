# Phase 7: Testing and Launch

**Estimate:** 6 working days  
**Dependency:** Phases 3 to 6 complete  
**Status:** Not started  
**Reference:** `../testing-strategy.md`, `../security-checklist.md`, `../operations-runbook.md`

## Tasks

| ID | Task |
|---|---|
| 7.1 | Functional testing |
| 7.2 | Security testing |
| 7.3 | Automated tests (Vitest, Playwright) |
| 7.4 | Device and accessibility testing |
| 7.5 | Production setup |
| 7.6 | Monitoring |
| 7.7 | Admin handover |
| 7.8 | Soft launch |

## Functional testing

Browse, filter, search, size and colour selection, cart, login, address validation, checkout totals, COD placement, duplicate submission, cancellation, admin catalog and stock, order status flow, tracking, cash collection, failed delivery, returns, restock.

## Security testing

Access another customer's order or address; reach admin as a customer; call protected actions directly; tamper with price, quantity, discount and IDs; send invalid input; confirm no secrets in repo or bundle; review RLS and storage policies; test rate limits.

## SEO and content readiness

Titles, meta descriptions, product and category metadata, canonical URLs, sitemap, robots, social metadata, alt text, About and Contact details, all policy pages, accurate prices and descriptions.

## Production readiness

Commercial hosting plan, production environment variables, production Supabase with RLS and storage policies, domain and HTTPS, backups and a tested recovery expectation, error monitoring and alert owner, documented admin account recovery.

## Launch checklist

- [ ] All Phase 0 and 1 decisions approved
- [ ] No critical or high issues open
- [ ] Functional and security tests passed
- [ ] RLS and admin authorization reviewed
- [ ] COD rules configured and verified
- [ ] Stock, duplicate-order and concurrency safeguards verified
- [ ] Cancel, failed delivery and return paths restock correctly
- [ ] Policies and contact details published
- [ ] Domain, HTTPS and production environment verified
- [ ] Backup and recovery plan documented
- [ ] Admin trained using the runbook
- [ ] Monitoring owner named
- [ ] Soft-launch real order completed end to end

## Acceptance criteria

All checklist items are complete, critical flows pass in the production configuration, no secrets are exposed, and the admin fulfils a real test order from placement to cash collection.

**Gate:** If any critical access-control, data-loss, inventory or order-state issue remains, do not launch.
