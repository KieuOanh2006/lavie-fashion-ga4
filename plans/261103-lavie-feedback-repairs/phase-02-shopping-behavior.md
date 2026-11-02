# Phase 02 — Shopping behavior

## Context and requirements

See [plan](plan.md). Make the added item immediately visible, preserve coupons across reloads, restore product choices after reading size help, and expose demo history on desktop/mobile. Preserve checkout and analytics contracts.

## Architecture and touchpoints

`app.js`: cart add handler/`openCart`, `saveCart`, coupon initialization, modal return context and dismissal, `openDemoOrders`, `[data-demo-orders]` bindings. `index.html`: size-guide button and header/history controls. No backend or personal-data storage added.

## Implementation and validation

- [x] Open cart after add; identical variants merge while differing size/color stay distinct.
- [x] Retain increase/decrease/delete controls and correct count/totals.
- [x] Persist normalized `LAVIE10`; reset on empty cart or completed checkout.
- [x] Return from size guide via close/Escape/overlay without resetting choices or replaying `view_item`.
- [x] Wire history entry points; history access never emits `purchase`.
- [x] Cover all above plus invalid checkout and duplicate/restart purchase protection in the 12 Node VM tests.
- [ ] Verify real keyboard, focus and pointer interactions using the [manual checklist](reports/manual-validation-checklist.md).

## Risks and rollback

Modal changes can break focus or dismissal in a real browser despite stub tests. Coupon storage can differ when browser storage is unavailable. Roll back affected functions and matching controls together if needed, preserving existing cart/wishlist/order keys. Do not use real customer details for demo validation.
