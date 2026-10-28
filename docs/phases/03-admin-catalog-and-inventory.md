# Phase 3: Admin Catalog and Inventory

**Estimate:** 5 working days (6 with bulk import)  
**Dependency:** Phase 2 complete  
**Status:** In progress (Tasks 3.1 & 3.2 complete, moving to Task 3.3)  
**Purpose:** Build the admin side of the catalog first so the storefront has real data.

## Tasks

| ID | Task | Priority |
|---|---|---|
| 3.1 | Admin authentication and `requireAdmin()` | Must |
| 3.2 | Category management | Must |
| 3.3 | Product management with size and colour variants | Must |
| 3.4 | Product images | Must |
| 3.5 | Inventory by variant | Must |
| 3.6 | Bulk CSV import | Should |

## Requirements

**Authentication (3.1):** Admin routes and actions are restricted to the allow-listed administrator, enforced on the server, denied by default. Provide a safe way to create the first admin; public signup never grants admin access.

**Products (3.3):** Create, edit, publish, unpublish, archive. Fields: name, slug, description, fabric and care, category, GST rate, SKU per variant, price per variant (paise), size and colour. Prevent duplicate SKUs. Archive instead of deleting products that appear in orders.

**Images (3.4):** Upload, reorder, delete. Validate type and size. Storage policies allow public read of product images and admin-only write.

**Inventory (3.5):** Stock per variant, low-stock warnings, adjustments recorded with reason and actor. Stock changes go through validated server functions.

**Bulk import (3.6):** CSV with validation and a preview of errors before saving.

## Acceptance criteria

- Unauthorized users cannot reach admin pages or actions.
- Admin can create, update, publish and archive products with variants and images.
- Stock adjustments are validated and auditable.
- Historical order data stays intact when products change.

**Gate:** Verify authorization independently for every server action and route.

## Notes for AI assistants

Every server action starts with `requireAdmin()`. Validate input with Zod. Never use client-supplied IDs without checking they exist and are allowed.

## Progress (2026-10-28)

| ID | State | Evidence |
|---|---|---|
| 3.1 Admin authentication and `requireAdmin()` | Done | `requireAdmin()` and `verifyAdmin()` guards in `src/lib/auth/`, server actions in `src/actions/auth.js`, `/admin/login` page, `/admin/(dashboard)` protected layout, `scripts/create-admin.mjs` setup script, unit tests in `tests/unit/auth.test.js`. Build and tests pass. |
| 3.2 Category management | Done | Category schema validation in `src/lib/validations/category.js`, server actions in `src/actions/categories.js` (create, update, toggle visibility, safe delete), modal & listing UI at `/admin/categories`, unit tests in `tests/unit/category.test.js`. Build and tests pass. |
| 3.3 Product management with size and colour variants | Up next | |

