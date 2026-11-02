---
title: LAVIE storefront feedback repairs
status: in-progress
priority: P1
effort: medium
branch: fix/lavie-demo-feedback
tags: [storefront, ga4, regression]
created: 2026-11-03
---
# LAVIE storefront feedback repairs

## Overview

Repair demo shopping interactions and catalog imagery while retaining catalog identity, existing browser storage and GTM/GA4 contracts. Local implementation is complete; release validation remains open. The user authorized commit, push and deployment on 2026-11-03; release is in progress and confirmation is pending.

## Phases and dependencies

| Phase | Status | Depends on |
| --- | --- | --- |
| [01 Baseline and guards](phase-01-baseline-and-guards.md) | Local checks complete | None |
| [02 Shopping behavior](phase-02-shopping-behavior.md) | Local implementation/tests complete | 01 |
| [03 Local assets and UI](phase-03-local-assets-and-ui.md) | Local implementation/tests complete | 01 |
| [04 Regression and release validation](phase-04-regression-and-release-validation.md) | In progress; independent review complete | 02, 03 |

## Acceptance criteria

- [x] Preserve product IDs/prices, existing storage keys and GTM configuration.
- [x] Implement cart auto-open, quantity/delete behavior, persistent coupon, size-guide return and accessible order history.
- [x] Ship eight local product images, fallback and documented sources.
- [x] Pass 12 focused Node VM tests; automated tests make no real GA requests.
- [x] Independent source review complete; final affected checks passed.
- [ ] Complete browser checks at 1366×768, 768×1024 and 390×844.
- [ ] Verify actual Tag Assistant/GA4 DebugView delivery and avoid duplicate tags.
- [ ] Complete deployment validation for the release authorized on 2026-11-03; confirmation pending.

Progress: 5/8 acceptance gates complete. See the [manual checklist](reports/manual-validation-checklist.md). Historical GA4 data is stored in the analytics property and is unaffected by deploying static HTML; future collection depends on preserving the same configuration and preventing duplicate tags. Browser and real analytics validation remain pending; the authorized release is in progress with deployment confirmation pending; this plan does not claim live readiness.
