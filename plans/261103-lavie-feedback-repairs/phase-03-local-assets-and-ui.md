# Phase 03 — Local assets and UI

## Context and requirements

See [plan](plan.md) and [image sources](../../README.md#ảnh-sản-phẩm-cục-bộ-và-nguồn). Remove reliance on external catalog images and clarify shopping controls without changing product IDs/prices.

## Architecture and touchpoints

`assets/images/lv001.jpg` through `lv008.jpg`, `product-placeholder.svg`; catalog paths and one-time image fallback in `app.js`; header cart SVG/labels, `data-demo-orders`, size-guide button and asset query versions in `index.html`; responsive control/touch-target styles in `styles.css`; attribution and upload guidance in `README.md`.

## Implementation and validation

- [x] Save and visually inspect eight local JPGs (800 px wide, about 755 KB total).
- [x] Replace mismatched shirt/trousers/blazer/cardigan images with verified relevant photos.
- [x] Document exact sources and clarify illustrative photos versus demo descriptions/options.
- [x] Add local fallback; Node VM test confirms one source replacement and no retry loop.
- [x] Add desktop/mobile history access, cart icon/labels and explicit size-guide button.
- [ ] Inspect clipping, overlap, scroll and image requests at 1366×768, 768×1024 and 390×844.

## Risks and rollback

Retained dress and bag images are illustrative, not exact matches to materials/options. Real viewport cropping still needs inspection. If necessary restore only problematic UI styles/markup; retain bundled files referenced by the active catalog and deploy the entire assets tree. Never delete another contributor's edits during rollback.
