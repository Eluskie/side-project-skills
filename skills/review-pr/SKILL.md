---
name: review-pr
description: Review a PR or local change against its user job, correctness, and code simplicity. Use for a requested full review or cleanup covering regressions, duplication, unused code, clear semantics, and justified component reuse.
---

# Review PR

Review whether the change solves the user's actual problem with the smallest clear implementation that preserves intended behavior.

## Establish the job and scope

- Recover the user's goal from the request, issue, PR, and relevant product context. State who needs to do what, why it matters, and the observable outcome. Do not infer intent solely from the implementation or justify a change because it already exists.
- Separate the behavior being changed from existing journeys that must still work. Turn both into concrete review checks; include the original reported failure.
- Establish the correct comparison base and inspect the complete proposed change: branch commits, staged and unstaged changes, and relevant untracked files. Identify pre-existing unrelated work without modifying it. Follow applicable repository instructions.
- A request to review authorizes investigation and validation. Apply fixes or refactors only within the user's authorized scope; report findings when the request is read-only. Review does not itself authorize commits, PR publication, merging, deployment, or unrelated cleanup.

## Trace behavior and simplify deliberately

- Follow each changed user action through its real callers, shared components, state, API contract, and persisted result where applicable. Inspect enough surrounding code and dependencies to understand the effect; reviewing changed lines alone is insufficient.
- Check that entry points and shared logic agree. Look for hidden conditions, stale state, invalid assumptions, missing error paths, asynchronous races, and changes that solve one path while breaking an existing sibling path. Consider validation and permission boundaries where the change touches them.
- Search for redundant conditions, duplicate responsibilities, obsolete props, unused imports/exports, abandoned state, unreachable branches, and orphaned files. Before deleting, check actual callers and less obvious uses such as routes, dynamic imports, configuration, and tests.
- Prefer the established canonical component or helper when it already owns the behavior. Extract a component or helper only when a coherent responsibility is genuinely repeated or the extraction materially clarifies the current code. Give it a human-readable name and a narrow interface.
- Remove unnecessary code and indirection. Avoid speculative reuse, new layers for a single trivial use, broad refactors, and code compression that obscures meaning. Fewer lines are useful only when correctness and readability remain clear.
- Keep names, conditions, and ownership semantically honest: a reader should understand what the code does and why the behavior belongs there without reconstructing the conversation.

## Verify and report

- Use checks proportionate to the change. For fixes, reproduce or otherwise demonstrate the original failure and verify the corrected outcome plus nearby behavior that must remain intact. For UI changes, exercise the actual interaction when practical and follow repository evidence requirements.
- Run the relevant existing tests and required checks. Add or adjust tests only for meaningful behavior or invariants; avoid tests that restate the implementation. Recheck affected paths after edits and review the final diff for accidental changes.
- Distinguish confirmed failures from pre-existing failures and checks that could not run. Do not claim the absence of all errors from a partial check or silently dismiss unrelated failures.
- Present actionable findings first, ordered by impact, with file locations, the triggering scenario, and the consequence. If fixes were authorized, explain what changed and the validation. State remaining uncertainty and whether unresolved findings remain; omit speculative nitpicks and generic cleanup lists.
