# Qorelo example

The approved example compares the original worktree with the `improved result readability` commit. Its primary capture is the live `/ssot?view=processes` table region, including Module, Result, adjacent data/actions, the real toolbar above and four to five rows. The region is 800 × 449 CSS pixels in a 1440 × 900 viewport, captured at device pixel ratio 2. These dimensions are an example, not a universal crop.

When these helpers are present in the current Qorelo checkout:

- `scripts/ui-review/capture.mjs` exports committed frontend/shared source, serves each version through an isolated temporary Vite preview and invokes the same Playwright scenario.
- `packages/frontend/e2e/ui-review/result-readability.spec.ts` uses mock authentication and deterministic API fixtures. It anchors a viewport crop to the real table and toolbar, scrolls to the table's right edge and keeps the pointer away from result cells.

For an explicitly requested committed version:

```sh
node scripts/ui-review/capture.mjs result-readability --after <commit>
```

Before comes from the original-worktree pin. When unavailable, `--before` accepts only a known original revision. This runner's default After is `HEAD`; it exports commits and **does not include uncommitted changes**. For current edits, render the live working source or adapt its isolated export to preserve changed/untracked source and deletions before invoking the scenario. Do not relabel a HEAD capture as current working source.

Dependencies must be installed. The fixture does not need a live backend. The helper uses a free port in 8082–8085 and cleans up only its own process and temporary source. Inspect the local helper before adapting it: package paths, auth fixture, mocked API shapes, server setup and scenario are Qorelo-specific.

The primary outputs are `before/processes-list.png` and `after/processes-list.png`. Show these with only Before and After labels. `comparison.html` and `before-after-list.png` are optional composed artifacts. The additional grid/card screenshots are not the approved main framing.

If the helpers are absent, use the project's available capture tooling. The bundled framing examples and baseline helper are independent of that checkout; no particular commit hash or fixture is required for a new UI change.
