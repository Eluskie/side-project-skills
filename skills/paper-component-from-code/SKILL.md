---
name: paper-component-from-code
description: "Create one source-accurate Paper component board from an implementation component, with a composed Example and only the states the code defines. Use when a user points to component code and wants it documented in Paper; use paper-component-handoff separately for pixel measurements."
---

# Paper Component From Code

Document a single visual code component as a reusable Paper component sheet. The finished board should use a code-implementation pattern: code-backed state previews followed by one composed `Example` surface.

## Scope

- Work on the component source the user names. Inspect that file, its local imports, and the tokens or CSS utilities that determine its rendered appearance before touching Paper.
- Treat implementation code as the source of truth for visual properties, dimensions, content structure, variants, interaction states, and responsive changes. Existing Paper boards are layout references only; do not copy values from them.
- Create one component per Paper artboard. Do not create boards for headless hooks, providers, or primitives that produce no visual UI. State that boundary instead.
- Do not modify application code unless the user asks separately.

## Build the component sheet

1. Load the Paper MCP guide. Open the target Paper page, inspect the current selection, file tokens, available fonts, and nearby component boards. Use the linked board as a structural reference when one is supplied.
2. Inspect the implementation with targeted source searches. Record the rendered base appearance plus every real visual state: for example default, variant, hover, focus-visible, disabled, loading, and breakpoint behavior. Omit states that the code does not define.
3. Create an artboard whose title identifies the component and that it is code-derived. Default to the local component-board rhythm: a neutral canvas, clear state labels, a top row of compact state surfaces, and a separate composed `Example` surface. Adapt artboard and surface dimensions to the component instead of forcing a fixed template.
4. Build the board incrementally: create its shell, then its state area, then one state or visual group at a time, and finally the composed example. Use the file's existing tokens and an available font. Preserve component geometry with flex layout; do not use Paper layout as an opportunity to redesign the component.
5. Keep the state row visually compact and comparison-friendly. Each preview should show one meaningful code-defined state. Use an `Example` label and a single composed example surface that demonstrates the default reusable form of the component.
6. Screenshot after each meaningful section. Review spacing, typography, contrast, alignment, artboard fit, and whether the states are visually distinct only where the code makes them distinct. Make targeted corrections before continuing.
7. Finish the Paper working session after the sheet passes review.

## Code-to-Paper fidelity

- Carry over resolved values from the implementation: token references, static dimensions, padding, gaps, radius, typography, borders, opacity, icon sizing, and declared focus styling.
- Represent responsive behavior only when source code defines it; label the affected viewport or breakpoint clearly.
- Surface implementation gaps rather than silently repairing them. If a visual style is library-owned or a referenced token is undefined, say so on the board instead of inventing a substitute.
- Use realistic static example copy only when it is structurally representative. Do not present dynamic text width as a fixed component measurement.

## Measurements

Pixel callouts are a distinct follow-up. When the user requests implementation measurements, run the companion `paper-component-handoff` skill after this board is complete. It annotates the `Example` surface only, leaving the state-comparison surfaces unchanged.

Do not expose Paper node IDs in user-facing messages.
