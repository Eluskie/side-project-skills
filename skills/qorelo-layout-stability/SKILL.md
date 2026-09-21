---
name: qorelo-layout-stability
description: Diagnose and fix unintended layout shifts in Qorelo React controls and nearby content across hover, focus, pressed, selected, loading, and font or scrollbar changes. Use for Qorelo UI stability cleanup; preserve intentional layout transitions.
---

# Qorelo layout stability

## Goal

Keep the same control and its adjacent content at the same position and size
across interaction states when the interaction is not meant to change layout.
Verify their bounding boxes before and after at the same viewport and scroll
position. Report measured deltas, allowing only normal subpixel rounding.
Separate intentional changes, such as expanding content, from accidental shifts.

## Find the cause and its owner

Read `DESIGN.md` for the current visual and language rules. Inspect computed
styles and the closest canonical component before adding page-level fixes.
Paths below are relative to `packages/frontend/src/`:

- `components/ui/tabs.tsx`: `TabLabel` reserves active font width; keep count badge geometry constant.
- `components/ui/button.tsx`: use `loading` / `loadingText` to reserve both labels; keep caller-owned disabling. The reservation applies to native buttons, not `asChild` links.
- `components/ui/toggle.tsx`: selected styles and outline variants.
- `features/statements/components/RegisterToolbar.tsx`: search clear controls,
  filter counts, select labels, and toolbar sibling movement.
- `features/statements/components/SsotListRow.tsx`: selection, metadata, and row size.
- Search custom selectors and callers for conditional font weights, borders,
  padding, labels, icons, counts, and loading markup that bypass shared controls.

Correct the shared owner when the cause is shared, then check its affected
callers. Keep feature-specific behavior in its feature; avoid cloned fixes.

## Make geometry stable

- Reserve space for actual state-dependent labels, icons, spinners, and counts.
  Prefer intrinsic layout or a targeted minimum size based on supported content;
  check long labels and narrow viewports before choosing a fixed dimension.
- Keep border width, padding, line height, and gaps consistent between states.
  Reserve border space or use a non-layout-changing outline for state emphasis.
  Preserve the design system's selected typography; if weight changes width,
  reserve its larger text footprint without duplicating accessible text.
- Inspect font loading when glyph metrics change. Compare fallback and loaded
  fonts, and wait for fonts to settle when isolating interaction-state movement.
  Fix the font cause locally rather than compensating with unrelated widths.
- Check whether scrollbar appearance changes available width. Apply stable
  gutter behavior to the relevant scroll container when that is the cause.
- Preserve focus indicators, accessible names, keyboard behavior, disabled
  states, and meaningful loading feedback. Keep decorative reserve content
  hidden from assistive technology and out of the tab order.

Do not impose fixed widths across a page, clip content with `overflow-hidden`
to disguise shifts, add a dependency, or remove motion automatically. Preserve
intentional animation and layout changes unless the user asks to change them.

## Verify the result

Reproduce the relevant states in the browser at a fixed viewport. Measure the
control plus neighboring controls or content before and after hover, keyboard
focus, press, selection, and loading where supported. Exercise count and label
changes, then repeat at a narrow viewport if wrapping can affect the result.

Check overflow, readable labels, focus visibility, and loading accessibility.
Run focused existing checks; add tests only for changed behavior or a meaningful
stability regression. Record the state pairs checked, measured outcome, and any
intentional movement. Update `DESIGN.md` only if a design rule changes.
