---
status: pending
created: 2026-11-03
---
# Manual storefront and analytics validation

## Current evidence

Controller ran `node --test tests/storefront.test.cjs`: 12 passed, 0 failed (final run: 3.32 s). `node --check app.js` and `git diff --check` passed; Git reported a README line-ending notice only. These tests use Node VM/stubs and make no real GA requests. Independent review found no logic regressions; a potential cramped header prompted a responsive-navigation adjustment, with final source re-review complete and no functional regressions found. Browser rendering, Tag Assistant, DebugView and deployed-site validation remain pending.

## Setup

Use Live Server on a local copy; retain existing GTM/config IDs. Use fictitious checkout values. Record browser/version, URL, viewport, result and screenshot/evidence link for failures. Test at 1366×768, 768×1024 and 390×844, then widths 1200, 1100 and 801 px for the revised navigation breakpoint. A local browser loading the existing GTM can send real analytics events; distinguish these manual events from VM tests.

## Shopping checklist — pending

- [ ] At every viewport, check header controls do not overlap, menu opens/closes, history remains accessible, cards render eight local images, and no horizontal page overflow occurs.
- [ ] Add LV001 size M, first color, quantity 1. Confirm cart opens immediately and count/line/totals update. Add the same variant again: one line quantity 2. Add another size/color: separate line.
- [ ] For each LV001–LV008, add a valid variant, increase quantity, decrease quantity, and delete it. Confirm count, subtotal, discount, shipping and total refresh; last-item removal shows empty state. Ensure close/reopen/reload preserves valid remaining lines.
- [ ] With one LV004 (189,000₫), enter ` lavie10 ` and apply: discount18,900₫, shipping25,000₫, total195,100₫. Reload: coupon and totals remain. Try invalid code and empty cart; inspect clear feedback. Remove last item, add again: prior coupon is cleared.
- [ ] Add one LV006 (699,000₫): shipping0₫. With `LAVIE10`, total629,100₫ (shipping threshold uses pre-discount subtotal). Confirm cart and checkout totals agree.
- [ ] Open a product, choose size L, another color and quantity2. Open size guide, dismiss by close button; repeat with Escape and overlay. Each dismissal returns to that same product with choices intact. Check keyboard focus and no extra `view_item` caused solely by returning.
- [ ] Before ordering, open **Đơn demo** from desktop header, mobile menu and footer if present; confirm empty/history state. After checkout, use confirmation history button and header/menu again; confirm matching ID/date/quantity/total. Reload and reopen: order remains; access creates no new order.
- [ ] Start checkout with items, submit blank/invalid form and unchecked demo consent: show validation and no purchase/order. Use fictitious valid details and consent, then complete once. Confirm one order, cleared cart/coupon, correct confirmation and history. Double-click submit and reload: no duplicate order or replayed purchase. Test both demo payment choices without transferring money.
- [ ] Test wishlist persistence, search/category/sort, image fallback after temporarily blocking one JPG, and closing/reopening cart/checkout with keyboard and pointer. Confirm fallback does not loop requests.

## Analytics checklist — pending

- [ ] In Tag Assistant Preview, verify container `GTM-5M5HVX2L` and intended existing Google tag. Direct `GA_MEASUREMENT_ID` remains blank. Confirm no second hard-coded Google tag duplicates collection.
- [ ] Inspect `window.dataLayer`: correct `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `view_cart`, `remove_from_cart`, checkout events and purchase. Check IDs, variant, quantity, VND currency, discounted value, shipping and transaction ID against UI. Confirm ecommerce reset precedes ecommerce payload as before.
- [ ] Confirm each add produces one `add_to_cart` and its cart opening one `view_cart`; size-guide return produces no additional `view_item`; history produces no `purchase`.
- [ ] In GA4 DebugView, confirm actual delivery of the intended events and one `purchase` for one completed demo order, with matching transaction ID. Invalid checkout, double submission and reload must not create another purchase. Record evidence, not only dataLayer presence.
- [ ] Check published GTM trigger/tag mapping if dataLayer events exist but DebugView is missing events; do not infer delivery from blank/nonblank direct Measurement ID alone.

## Deployment checklist — authorized 2026-11-03; release in progress

- [ ] Deploy a compatible static set including all `assets/images/` files. Check production HTML references current JS/CSS and all eight JPGs/fallback return successfully after reload.
- [ ] Repeat critical add/delete/coupon/size-guide/history/checkout flows on deployed URL and inspect console/network failures.
- [ ] Confirm production GTM/GA4 configuration, duplicate-tag absence and actual event delivery. Preserve rollback artifact. The user authorized commit, push and deployment on 2026-11-03; release is in progress and confirmation is pending.

## Interpretation and next action

Historical GA4 data lives in the existing analytics property and is unaffected by a static HTML/CSS/JS deployment. Future collection still depends on keeping the same IDs/configuration, working published tags/triggers and avoiding duplicate tags. Mark items complete only with actual browser/analytics/release evidence; local tests alone do not establish live readiness.

Unresolved questions: none needed for local implementation; manual evidence and confirmation of the authorized release remain outstanding.
