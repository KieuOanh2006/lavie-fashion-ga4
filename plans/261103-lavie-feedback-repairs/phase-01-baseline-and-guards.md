# Phase 01 — Baseline and guards

## Context and requirements

See [plan](plan.md) and [README](../../README.md). Preserve product IDs, prices, variant behavior and existing storage schemas. Keep GTM container `GTM-5M5HVX2L`, blank direct Measurement ID and ecommerce event payload implementation.

## Architecture and touchpoints

Baseline: `app.js` product catalog, `itemForAnalytics`, `trackEvent`, storage keys; `index.html` GTM head/noscript snippets; `config.js`. Existing `lavie_cart_v1`, `lavie_wishlist_v1`, `lavie_demo_orders_v1` remain readable; coupon adds `lavie_coupon_v1`.

## Implementation and validation

- [x] Read existing README and nearby implementation; no existing docs tree was present.
- [x] Capture and test catalog identity, tracking implementation and GTM/config against HEAD in `tests/storefront.test.cjs`.
- [x] Cover legacy cart/wishlist/order schemas in Node VM tests.
- [ ] Confirm published GTM behavior with Tag Assistant/DebugView; no real GA requests were made by automated tests.

## Risks and rollback

A second direct tag can duplicate future collection. Keep direct Measurement ID blank for the existing GTM workflow. If a regression appears, restore only affected source changes from the baseline; do not clear browser storage or change analytics property/container IDs. A static deployment cannot remove historical GA4 records.
