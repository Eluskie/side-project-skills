---
name: ui-before-after
description: Capture real before-and-after UI screenshots using the original worktree state and matching crops with surrounding screen context. Use when showing or reviewing the visual effect of frontend changes or a UI commit.
---

# UI Before and After

Show the changed UI as a natural screenshot of its place on the screen. Deliver two legible images with only **Before** and **After** labels.

## Preserve the source comparison

**Before always means this worktree's original state.** Pin its original revision before editing and reuse that baseline for every later comparison in the same worktree. Never use the preceding commit or `HEAD^` as a substitute.

Run the bundled helper from any repository:

```sh
node <skill-dir>/scripts/worktree-baseline.mjs --repo <worktree-path>
```

It reads an existing pin or the actual worktree creation record and stores `ui-review-baseline.json` in that worktree's Git directory. Its JSON output includes `before`, the full original commit hash. If creation evidence is gone, supply `--before <known-original-revision>`; a guess is insufficient. An explicit ref cannot override an established original baseline.

The helper preserves a **commit**, not uncommitted source. If the original state includes pre-existing uncommitted UI work, save an immutable source snapshot before changing it and record its relationship to the pinned commit. Reuse that snapshot for Before. If the original dirty state was never saved and has already changed, explain what is missing and obtain the original source instead of inventing it.

**After means the requested target.** For current edits, capture the working source including relevant staged, unstaged, untracked files and deletions. For an explicitly requested commit, capture that commit. A runner that archives `HEAD` cannot represent dirty working source.

Render original source in an isolated temporary checkout or source export; render current source in its existing preview or an isolated faithful snapshot. Preserve the user's worktree and existing server sessions. Use appropriate installed dependencies and isolate build caches when sharing dependencies between previews.

## Frame the actual screen

Inspect the approved [Before example](references/framing-before.png) and [After example](references/framing-after.png) when choosing the crop. They demonstrate framing, not content or a required component.

- Capture the real app at normal UI scale with a viewport-region screenshot, such as Playwright `page.screenshot({ clip })`.
- Center the region on the change and include coherent surroundings: a neighboring column or component, the nearby toolbar or header, several rows where relevant, and some screen margin or the table edge.
- Interpret “zoom out 20–30%” as expanding the capture region to show more actual surroundings. Keep the browser zoom and typography unchanged. Choose recognizable context boundaries rather than blindly enlarging a rectangle.
- Avoid a whole-app screenshot, an isolated element/card, clipped fragments that lose context, or a reconstructed UI. If the change is near a screen edge, frame from that edge while keeping meaningful neighboring content.
- Use the same viewport, pixel density, theme, data, route, interaction state, semantic scroll position and crop dimensions for both. Preserve real layout differences. Stable screen landmarks help align the crops across revisions.

Prefer deterministic representative data and a fixed clock when timestamps or loading affect the comparison. Wait for fonts and content, let animations settle, and keep the pointer away from the subject unless hover is the change being reviewed. Use mocks or existing fixtures when they let both revisions show equivalent data.

For Qorelo's result-readability example, read [references/qorelo.md](references/qorelo.md). Other projects should use their available browser and preview tooling with the same source and framing rules.

## Verify and deliver

Inspect both images visually before showing them: the intended change is present, the surroundings are coherent, text is legible, and the two frames are comparable. Confirm each screenshot's source. Store commit/snapshot identity, route, viewport, crop and capture settings in an accompanying manifest when saving artifacts; keep this metadata outside the visible comparison.

Show the two original crops stacked so they remain easy to read. The default final response contains only:

```markdown
**Before**
![Before](<before-image-path>)

**After**
![After](<after-image-path>)
```

Add no visible title, descriptions, hashes, annotations, controls or extra decoration. If a shareable comparison file is requested, compose the same screenshots and the two labels without shrinking them beyond legibility. Honor explicit requests for a different output format.
