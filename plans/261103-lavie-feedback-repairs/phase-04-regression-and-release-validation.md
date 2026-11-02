# Phase 04 — Regression and release validation

## Context and requirements

See [plan](plan.md) and [manual checklist](reports/manual-validation-checklist.md). Prove local behavior, then inspect the real rendered site and actual analytics delivery before reporting release readiness.

## Architecture and touchpoints

`tests/storefront.test.cjs` uses Node VM and lightweight DOM/storage stubs to execute `app.js`; it does not emulate browser layout or send real GA requests. Independent source review is complete; no functional regressions were found. Planned browser and analytics checks cover existing source/assets without changing GA4 property/container configuration.

## Validation status

- [x] Local implementation complete.
- [x] `node --test tests/storefront.test.cjs`: 12 tests passed, 0 failed in 3.32 s (controller-reported final result, 2026-11-03); syntax and diff checks passed.
- [x] Independent source review complete: no functional regressions; responsive dropdown rules consistent with source cascade.
- [ ] Validate desktop 1366×768, tablet 768×1024 and mobile 390×844 interactions/layout.
- [ ] Inspect Tag Assistant events, ecommerce payloads and GA4 DebugView delivery; check one purchase per completed order and no duplicate tags.
- [ ] Validate deployed files/cache/assets/checkout for the release authorized on 2026-11-03; release in progress, confirmation pending.

## Risks and rollback

VM tests cannot prove focus, pointer behavior, rendering or published GTM settings. Keep release status in progress until evidence exists. On release regression restore the prior static artifact set (HTML/CSS/JS/assets) as one compatible version; preserve GTM configuration and existing storage data. Historical analytics data is unaffected by static files, but future reporting can be damaged by duplicate tags or altered identifiers.
