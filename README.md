# side-project-skills

Personal collection of [opencode](https://opencode.ai) skills — reusable agent
instructions that get loaded automatically when a task matches.

## Skills

| Skill | Description |
| ----- | ----------- |
| [`dokploy-deploy`](skills/dokploy-deploy/SKILL.md) | Deploy / redeploy / fix a web app on your own VPS via Dokploy (Docker Compose + Traefik), including data-preserving redeploys, domain/cert management, and diagnosing "site won't load / keeps bouncing" issues. |
| [`paper-component-from-code`](skills/paper-component-from-code/SKILL.md) | Create a source-accurate Paper component board from implementation code, with a composed Example and only the states the code defines. |
| [`paper-component-handoff`](skills/paper-component-handoff/SKILL.md) | Add concise red developer-handoff measurements to a Paper component's Example surface. |
| [`explore-existing-ui`](skills/explore-existing-ui/SKILL.md) | Explore or refine an existing screen while preserving its visual language, component patterns, interaction conventions, and information density. |
| [`qorelo-reusable-ui`](skills/qorelo-reusable-ui/SKILL.md) | Build or refine Qorelo React UI using canonical shared components, the existing design system, and minimal readable code. |
| [`qorelo-layout-stability`](skills/qorelo-layout-stability/SKILL.md) | Measure and fix unintended layout shifts in Qorelo controls across interaction and loading states. |

## Using these skills

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
