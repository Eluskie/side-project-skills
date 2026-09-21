---
name: qorelo-reusable-ui
description: Build or refine Qorelo React screens and components using the existing design system, language, and canonical reusable components. Use for Qorelo UI changes and component refactoring; excludes backend-only work and unrelated products.
---

# Qorelo reusable UI

Keep Qorelo UI code small, readable, and composed from shared components. Reuse
the canonical implementation before creating another version of the same UI.

## Start with the existing implementation

- Read the repository's `DESIGN.md` for current visual and copy rules. Keep those
  rules there; do not duplicate token specifications in this skill or components.
- Find the closest screen and shared component with `rg`, then inspect their
  props, callers, and behavior before editing. Follow current exports if files move.
- Keep the requested scope. A local UI improvement does not require a broad
  design-system rewrite, new framework, or dependency upgrade.

## Canonical components

Paths below are relative to `packages/frontend/src/`.

| Need | Canonical location |
| --- | --- |
| Buttons, fields, menus, tabs, radios, table primitives | `components/ui/` — existing shadcn/ui components styled for Qorelo |
| Stable tab labels and loading buttons | `components/ui/tabs.tsx` (`TabLabel`), `components/ui/button.tsx` (`loading`, `loadingText`) |
| Page header and shared design presentation | `components/design/`, including `PageHeader.tsx` |
| Search, filters, active-filter chips | `features/statements/components/RegisterToolbar.tsx` — `RegisterToolbar`, `ToolbarSearch`, `ToolbarSelect`, `ToolbarFilterButton` |
| Table surface, master/detail layout, table rows | `features/statements/components/SsotTable.tsx` — `SsotTable`, `SsotMasterDetail`, `SsotTableRow` |
| Selectable list row button | `features/statements/components/SsotListRow.tsx` |
| Requirement-specific row content and behavior | `features/statements/components/RequirementCard.tsx` — domain adapter |

Extend an existing canonical component for a real shared presentation variation.
Use children or named slots for content; use a small explicit variant only when
it represents a repeated visual treatment. Avoid cloned markup, page-specific
style overrides that recreate a component, and collections of unrelated flags.
Create a new shared component when current consumers have a coherent reusable
responsibility. Keep unique business content in its feature component.

## Composition and state

- Keep fetching, mutations, permissions, filters, and domain decisions with their
  feature owner. Shared presentation accepts values, content, and callbacks.
- Keep one owner for selection and derive selected objects from IDs and data.
  Preserve URL/deep-link precedence, stable keys, and intentional form resets.
- Preserve native table/list/link/button semantics, accessible names, keyboard
  behavior, focus, disabled states, and independent pane scrolling.
- Favor clear names and ordinary control flow. Reduce duplication, not lines at
  the expense of readability; do not hide simple code in generic abstractions.

## Apply and verify

- `features/statements/components/SsotOverview.tsx`: compose the shared toolbar
  and table surface while keeping overview queries and pagination local.
- `features/statements/components/LobRegister.tsx`: use the shared master/detail
  layout and `RequirementCard`; preserve the authoritative `?req=` selection.
- `features/statements/components/DecisionWorkspace.tsx`: reuse the layout and
  list row while keeping resolution effects and keyed decision forms local.
- When changing a shared API, inspect and update its affected callers. Remove
  obsolete duplicate implementations once callers use the canonical component.
- Run focused existing checks. Add tests only for meaningful behavior affected
  by the change, such as filtering, selection, links, resets, or save payloads.
  Visually inspect layout changes in the relevant screen and responsive states.
- Update `DESIGN.md` when the task changes a design or language rule.
