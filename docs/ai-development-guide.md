# AI Development Guide

How to use AI coding assistants on this project safely and productively.

## Why the documents matter

An AI assistant starts every session with no memory. It will fill gaps with plausible guesses, such as trusting a price from the browser, using floating-point money, or adding a payment library. The documents close those gaps. If a rule is not written down and findable, assume it will be broken eventually.

## Session routine

**Start**
1. Tell the assistant: "Read `AGENTS.md`, `docs/README.md`, and the current phase file."
2. Name one task ID, for example `5.4 Atomic order placement function`.
3. Ask it to restate the task, list files it will change, and name the rules that apply. Correct it before any code is written.

**During**
- One task, one branch or small commit series.
- Ask for the smallest change that meets the acceptance criteria.
- Ask for tests in the same change.

**End**
- Ask for a summary: files changed, tests run and results, unverified items, open questions, next task ID.
- Update the phase `Status` line and any doc whose behaviour changed.

## Prompt template

```text
Task: <ID and name from the phase file>
Context files to read: AGENTS.md, docs/phases/<file>, docs/<relevant rule docs>
Constraints: follow AGENTS.md section 3. COD only. Money in paise.
Do not: add dependencies, change the schema outside a migration, edit unrelated files.
Deliver: code, tests, doc updates, and a summary of what you verified.
If a rule is Pending in the decision log, ask me instead of guessing.
```

## Review checklist for AI output

- Are totals, stock and eligibility decided on the server only?
- Is every server action authorized and validated with Zod?
- Is any stock change outside the database function or transition module?
- Is money an integer anywhere it is stored, calculated or compared?
- Did it add a package, a payment concept, or a new table without approval?
- Are RLS and migrations included for schema changes?
- Are loading, empty and error states present?
- Do tests prove the rule, or do they just run the happy path?
- Did it invent a business rule (COD cap, GST rate, return window)?

## Common AI failure modes here

| Failure | Prevention |
|---|---|
| Calculating totals in React components | Pricing lives only in `lib/pricing`; review for any arithmetic in components |
| Decrementing stock in separate queries | Require `place_order` and transition functions; test concurrency |
| Skipping auth because the page is hidden | Test direct calls to every action |
| Marking an order paid at placement | Payment stays `cod_pending` until collection |
| Adding Razorpay or Stripe by habit | `AGENTS.md` rule 3; reject in review |
| Editing the database by hand | Migrations only |
| Silent doc drift | Docs updated in the same change; ask for a doc diff |
| Inventing policy details | Pending decisions must be asked, not assumed |

## Context hygiene

- Give the assistant only the files it needs; long irrelevant context reduces quality.
- Start a fresh session per task or phase; re-read the docs instead of relying on earlier chat.
- When a decision is made in chat, record it in `decision-log.md` immediately.

## Human responsibilities

AI proposes, a human approves. The owner approves business decisions, policy text, and the launch checklist. A human reviews every migration, RLS policy and payment-state change before merging.
