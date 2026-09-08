---
name: explore-existing-ui
description: "Explore or refine a screen in an existing product by discovering and preserving its visual language, component patterns, interaction conventions, and information density. Use for UI explorations, layout changes, and simplification within an established interface. Excludes creating a new brand or visual identity from scratch."
---

# Explore Existing UI

Explore the product problem using the product's existing visual language. Discover that language from the current task's artifacts; this skill contains no product-specific palette, typography, components, or reference files.

## Discover the local design language

Before editing, inspect the target and enough nearby, relevant examples to distinguish established patterns from an isolated design choice. Use what the task makes available: design files, running screens, screenshots, component implementations, or design-system resources.

Prefer references explicitly selected or approved by the user, followed by current, established patterns in the same product area. Use available task history to distinguish approved references from adjacent experiments; an earlier generated screen is not automatically a precedent. When references disagree, follow the clearest relevant source and state any consequential assumption briefly.

Build a compact working baseline from observed evidence:

- Typography: title, label, body, caption, weight, line height, and text color.
- Geometry and density: spacing rhythm, padding, row heights, column widths, alignment, and use of empty space.
- Visual treatments: surfaces, borders, radii, shadows, icons, and semantic colors.
- Components and interactions: buttons, fields, statuses, tabs, lists, disclosure, comments, and editing patterns.
- Content conventions: naming, sentence length, label treatment, amount of detail, and where actions live.

Record useful source locations or node references with these observations so they can guide edits. Read exact styles and component structure when available; use screenshots to understand and compare appearance. Inspect only what informs the requested change, without starting a full design-system audit.

If access is partial, proceed with the evidence available and keep uncertain choices conservative. If no meaningful visual reference can be found, request the minimum missing reference before inventing a product style.

## Define the screen's purpose

Identify what the user must understand or do here. Select content by its contribution to that task, rather than by the number of available fields or domain concepts.

For each proposed section, field, or action, ask: what question does this answer, or what decision does it enable? Combine or remove repeated answers. Place secondary detail behind the product's existing disclosure patterns when useful. Preserve information required to act correctly.

Keep research, internal reasoning, methodology, and implementation details out of screen copy unless the product user needs them. Write concise labels and direct statements consistent with surrounding screens. Preserve the distinction between source facts, proposed changes, and unresolved questions; do not invent evidence, approvals, metrics, or confirmed outcomes to make an example appear complete.

## Explore through established patterns

Explore content, grouping, hierarchy, layout, and interactions while anchoring visual choices in the observed baseline. Broad freedom to improve a screen keeps this baseline in effect; an explicit request for a new visual direction overrides it.

Reuse or adapt existing components and native design nodes where practical. Preserve familiar type sizes, controls, spacing relationships, and semantic treatments. Introduce a new pattern when an essential interaction has no suitable existing expression, and explain that specific reason briefly.

Choose the smallest useful composition that fulfills the task. A cards-and-dashboard layout, workflow stepper, checklist, summary panel, or explanatory banner should earn its place through the user's task and the product's conventions. These patterns are available when appropriate, never automatic additions.

Use side panels for a distinct secondary activity when that arrangement helps. Comments, evidence, or history are possibilities; there is no prescribed sidebar content. Let empty space remain when more content would add no value.

Work incrementally in the requested artifact and preserve unrelated work. Keep the exploration within the requested deliverable; a design edit does not imply a code migration or a new design-system project. Follow the active environment's tool requirements without requiring a particular design app or code framework.

## Review for purpose and consistency

Compare the edited view with its references at a comparable scale, using rendered views or screenshots when possible.

- Purpose: can the intended user find the essential information and next action without reading an explanation of the design?
- Consistency: do the typography, controls, density, surfaces, and interaction patterns belong beside the reference screens?
- Restraint: has any information been repeated, turned into unnecessary decoration, or given more prominence than its importance warrants?
- Usability: are text, alignment, wrapping, contrast, and content boundaries sound? Correct defects without copying incidental problems from a reference.

When the result feels overdesigned, remove unnecessary content and structures, restore the established type and control scale, and simplify grouping. Merely shrinking text does not resolve excess information.

Apply the user's feedback directly. Review the revised artifact, then briefly report the meaningful changes and any unresolved limitation. Keep the edited UI as the primary deliverable; avoid lengthy design rationales or extra review artifacts unless requested.
