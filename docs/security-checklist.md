# Security Checklist

Use during implementation and before launch. It is not a substitute for a full security review.

## Identity and authorization

- [ ] Admin access is explicitly allow-listed.
- [ ] Every server action and API route independently verifies authorization.
- [ ] Customers can read only their own addresses and orders.
- [ ] Public signup cannot grant admin privileges.
- [ ] Auth redirect URLs and recovery flows are configured safely.

## Database and storage

- [ ] RLS is enabled on every exposed table.
- [ ] RLS policies are tested as anonymous, customer and admin.
- [ ] Image uploads validate type and size; only the admin can write.
- [ ] Storage policies expose no private data.
- [ ] Schema changes exist as migrations.
- [ ] Constraints protect required fields, uniqueness and non-negative stock.

## Pricing, inventory and orders

- [ ] Prices, shipping, COD fee and GST come from trusted server data.
- [ ] Quantities, variants and COD eligibility are validated on the server.
- [ ] Stock updates are transaction-safe under concurrent orders.
- [ ] Duplicate submissions are handled by an idempotency key.
- [ ] Item and address snapshots are preserved.
- [ ] Order and payment statuses change only through allowed transitions.
- [ ] Revenue counts collected payments only.

## Abuse and privacy

- [ ] Rate limits on checkout, login and OTP endpoints.
- [ ] Honeypot or equivalent bot protection on checkout.
- [ ] Per-phone and per-IP limits enforced.
- [ ] Phone numbers and addresses are not logged or exposed in errors.
- [ ] Only data needed to fulfil orders is collected.

## Secrets and operations

- [ ] `.env.local` is ignored by Git; `.env.example` has placeholders only.
- [ ] Development and production credentials are separate.
- [ ] Service-role key is server-only and absent from client bundles, logs and screenshots.
- [ ] Error responses do not reveal internals.
- [ ] Backups and recovery steps are documented and tested.
- [ ] Dependency updates and error monitoring are planned.

## Release blocker

Do not launch if critical authorization, data exposure, order duplication, order-state or inventory consistency issues remain unresolved.
