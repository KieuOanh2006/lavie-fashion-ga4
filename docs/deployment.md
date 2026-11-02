# Deployment

The static demo is published at https://kieuoanh2006.github.io/lavie-fashion-ga4/ from the `main` branch, repository root (`/`). GitHub Pages serves the HTML, CSS, JavaScript and local assets directly. There is no build command or package installation step. Keep `.nojekyll` at the repository root.

## Release workflow

1. Fetch `origin` and review changes on `origin/main` before integrating a release.
2. Run `node --test tests/storefront.test.cjs`, `node --check app.js` and `git diff --check`.
3. Review and commit application changes, all `assets/images/` files, tests and related documentation. Push the repair branch, integrate it into current `main`, and push `main` without force.
4. Check the GitHub Pages build/deployment and the public URL. Confirm the served HTML includes `app.js?v=2` and `styles.css?v=2`, and product images load from `assets/images/`.
5. Complete the [manual validation checklist](../plans/261103-lavie-feedback-repairs/reports/manual-validation-checklist.md). Node VM tests do not verify actual browser layout, focus behavior or GA4 delivery.

The user authorized this repair release on 2026-11-03 while browser and Tag Assistant/GA4 DebugView checks remain pending. That authorization does not imply those checks have passed. The controller's release report records the actual deployed commit and deployment result.

## Preserved contracts

Keep the original GTM snippets and container `GTM-5M5HVX2L`, unchanged `config.js`, and the empty direct `GA_MEASUREMENT_ID`. Preserve product IDs/names/prices and existing analytics payload schemas. Do not change Pages configuration during this release.

Existing browser storage keys remain `lavie_cart_v1`, `lavie_wishlist_v1` and `lavie_demo_orders_v1`; this release adds `lavie_coupon_v1`. Deployment does not clear browser storage or historical GA4 data. Future analytics collection still depends on the published GTM configuration.

## Rollback

Fetch current `main`, revert the application release commit with `git revert <release-commit>`, run the verification commands, and push the resulting revert commit to `main`. Revert any associated documentation commit if its claims no longer apply. Use a new commit rather than resetting or force-pushing shared history. If integration used a merge commit, revert that merge with `git revert -m 1 <merge-commit>` after checking its first parent. Then verify the Pages deployment and public site again.
