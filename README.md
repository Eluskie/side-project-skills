# side-project-skills

Personal collection of reusable agent skills for Codex and
[opencode](https://opencode.ai). Skills give an agent instructions and supporting
resources for repeatable workflows.

## Skills

| Skill | Description |
| ----- | ----------- |
| [`dokploy-deploy`](skills/dokploy-deploy/SKILL.md) | Deploy / redeploy / fix a web app on your own VPS via Dokploy (Docker Compose + Traefik), including data-preserving redeploys, domain/cert management, and diagnosing "site won't load / keeps bouncing" issues. |
| [`paper-component-from-code`](skills/paper-component-from-code/SKILL.md) | Create a source-accurate Paper component board from implementation code, with a composed Example and only the states the code defines. |
| [`paper-component-handoff`](skills/paper-component-handoff/SKILL.md) | Add concise red developer-handoff measurements to a Paper component's Example surface. |
| [`explore-existing-ui`](skills/explore-existing-ui/SKILL.md) | Explore or refine an existing screen while preserving its visual language, component patterns, interaction conventions, and information density. |
| [`qorelo-reusable-ui`](skills/qorelo-reusable-ui/SKILL.md) | Build or refine Qorelo React UI using canonical shared components, the existing design system, and minimal readable code. |
| [`qorelo-layout-stability`](skills/qorelo-layout-stability/SKILL.md) | Measure and fix unintended layout shifts in Qorelo controls across interaction and loading states. |
| [`ui-before-after`](skills/ui-before-after/SKILL.md) | Capture real before-and-after UI screenshots from the original worktree state with matching framing, coherent screen context, and only Before/After labels. |

## Using these skills

### Codex

To install the UI screenshot skill for all your projects, run:

```sh
npx skills add Eluskie/side-project-skills --skill ui-before-after --agent codex --global
```

With pnpm, the equivalent command is:

```sh
pnpm dlx skills add Eluskie/side-project-skills --skill ui-before-after --agent codex --global
```

These commands use the [skills CLI](https://github.com/vercel-labs/skills).
Omit `--global` to install in the current project. The installer downloads the
complete skill folder from GitHub, including scripts and reference images;
this repository does not need to be published as an npm package.

Alternatively, paste this into Codex:

```text
$skill-installer install ui-before-after from https://github.com/Eluskie/side-project-skills/tree/main/skills/ui-before-after
```

Codex discovers installed skills automatically. If the skill does not appear,
restart Codex. See the [official OpenAI skills documentation](https://learn.chatgpt.com/docs/build-skills).

Once installed, ask Codex:

```text
$ui-before-after Show before-and-after screenshots for this UI change.
```

The skill's baseline helper needs Node.js and Git. Screenshot capture uses your
project's preview server, installed dependencies, and browser tooling. The
Qorelo-specific runner described in the reference is optional; other projects
use their own capture tooling. The generic helper and framing references are
included in the skill.

### opencode

opencode scans for `**/SKILL.md` inside skill directories. Clone this repo and
register it in your global config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": ["~/side-project-skills/skills"]
  }
}
```

or copy individual skill folders into `~/.config/opencode/skills/<name>/`.

General skills are project-agnostic. Skills prefixed with `qorelo-` are scoped
to Qorelo and reference its existing components and design guidance.
