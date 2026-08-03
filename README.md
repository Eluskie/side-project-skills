# side-project-skills

Personal collection of [opencode](https://opencode.ai) skills — reusable agent
instructions that get loaded automatically when a task matches.

## Skills

| Skill | Description |
| ----- | ----------- |
| [`dokploy-deploy`](skills/dokploy-deploy/SKILL.md) | Deploy / redeploy / fix a web app on your own VPS via Dokploy (Docker Compose + Traefik), including data-preserving redeploys, domain/cert management, and diagnosing "site won't load / keeps bouncing" issues. |

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

Skills are project-agnostic by design — no references to any specific app,
repo, domain, or server.
