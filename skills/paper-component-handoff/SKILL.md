---
name: paper-component-handoff
description: "Add clear red developer-handoff measurements to selected Paper component Example frames. Use when a Paper design needs reusable spacing and sizing callouts, not when building the component itself."
---

# Paper Component Handoff

Create a concise, implementation-ready overlay for components already laid out in Paper. The overlay should expose the dimensions that help an engineer reproduce the component while leaving the component itself unchanged.

## Scope

- Work only on components the user selected or explicitly named.
- For a selected component sheet, annotate its `Example` frame by default. Do not add overlays to state-comparison panels unless the user asks for them.
- If a selection contains several component sheets, annotate every selected sheet's `Example` frame using the same visual language.
- Do not infer values from a screenshot. Use the actual Paper hierarchy and computed styles.

## Workflow

1. Before Paper work in a session, load the Paper MCP guide. Then get basic file information and the current selection.
2. Find each `Example` frame with the tree summary. Inspect its relevant label, control, content, and wrapper nodes using computed styles. Take a screenshot to confirm the visual layout.
3. Measure only the values that are meaningful to implement the component, such as:
   - the control's outer width and height;
   - the gap between a label and its control;
   - horizontal and vertical content padding;
   - a static text width when that text is a fixed design primitive.
   Omit dynamic content widths and decorative or redundant measurements.
4. Add one `Developer handoff measurements` overlay inside the example surface. Use absolute positioning so the original component geometry and layout do not change.
5. Take a screenshot after each annotated example. Check that labels, ticks, and outlines do not obscure content, overlap one another, or clip at the frame edge. Make targeted adjustments to the overlay when needed.
6. Finish the Paper working session when the requested examples have passed review.

## Annotation language

- Use the existing `--color-red-600` token when available. Draw 1 px red dimension lines with short perpendicular end ticks, and use small white-backed red labels such as `480 px`.
- Use the file's available sans-serif font. Check font availability before adding annotation text in a new Paper session. Keep labels compact and legible (normally 11–12 px, semibold).
- A light dashed red outline may mark the exact boundary being measured. Place dimension lines outside the content whenever enough space exists.
- Match a padding callout to the true padded boundary. Do not label a combined border, wrapper, and padding distance as only “padding.” If a control has nested wrappers, show the relevant inner edge or label the total inset accurately.
- Keep the style restrained: enough callouts to remove ambiguity, not a complete inventory of every CSS property.

## Review checklist

- Measurements match computed values and their endpoints match the measured edges.
- Red labels are readable over the component surface and remain visually secondary to the component.
- The overlay stays inside its example frame without clipping.
- Existing component layers, content, and state examples remain unmodified.

Do not expose Paper node IDs in user-facing messages.
