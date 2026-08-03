---
name: dokploy-deploy
description: Use when deploying, re-deploying, or fixing a web app on the user's own VPS via Dokploy (Docker Compose / Traefik). Covers Dokploy-managed compose deploys from git, data-preserving redeploys, domain/cert management, and diagnosing "site won't load / keeps bouncing" issues. Triggers: "deploy to dokploy", "deploy to my VPS", "redeploy", "dokploy compose", "traefik 404", "redirect loop", "login redirect loop", "Cargando", "stuck loading".
---

# Deploy to Dokploy (own VPS)

Deploy and operate apps on a self-hosted Dokploy instance running on the user's
VPS, with Traefik terminating TLS and domains managed through Dokploy.

## Environment facts (verify each run, don't assume)

- Dokploy runs as a Docker service on the VPS. `dokploy` publishes **host port
  3000** — that is the Dokploy UI/API, **not** the app being deployed.
- Apps live on the internal `dokploy-network` and are reachable **only through
  Traefik / the Dokploy-managed domain**, never via a host port.
- Local Docker (Docker Desktop) and VPS Docker are separate worlds. Always run
  VPS commands through `ssh root@<vps>`; never mix `docker ps` output between
  the two. `localhost:3000` on the VPS is Dokploy, not the app.
- Dokploy DB is Postgres in a container. Config rows live in tables `project`,
  `environment`, `compose`, `domain`.
- Compose deploys are driven from git (branch + SSH deploy key), built by
  Dokploy, and can be triggered via a webhook.

## Golden rules

- **Back up the Dokploy DB before any direct DB surgery.**
- **Keep volumes.** Named volumes `external` in compose are the only thing that
  preserves app data across teardown/redeploy. `docker compose -p <proj> down`
  (no `-v`) keeps them.
- **Never bake Traefik labels into compose** when Dokploy manages the domain.
  Domains are DB rows; Dokploy generates the Traefik routers.
- **A broken `compose` DB row orphans the running stack.** Fix/create rows
  completely, with valid `createdAt` and every column populated.
- **Verify data after redeploy** (row counts in the app DB), not just
  container health.

## Workflow: fresh Dokploy-managed compose deploy from git

1. **Dockerfile / compose**: create `docker-compose.dokploy.yml` at the repo
   root. Conventions:
   - Services named `app`, `db`, etc. Referenced by Dokploy domain rows via
     `serviceName`.
   - Volumes must be `external: true` with exact names
     `<project>_<volume>` so the existing app volumes are reused:
     ```yaml
     volumes:
       app-data:
         external: true
         name: <project>_app-data
     ```
   - Mount host paths via env substitution, e.g. `- ${CERTS_PATH:-./certs}:/certs:ro`.
   - Do not add `labels:` (traefik.*) — Dokploy manages routing.
2. **SSH key / git access**: Dokploy clones the repo over SSH. If the GitHub App
   install used by Dokploy does not cover the repo, register an SSH key in
   Dokploy (Dashboard → SSH Keys) and add its public key as a **deploy key** on
   the repo. Reference the key by its Dokploy id.
3. **Create rows in Dokploy DB** (if UI is broken) or via the UI:
   - `project` (name) → `environment` (production) → `compose` with
     `sourceType='git'`, `customGitUrl`, `branch`, `customGitSSHKeyId`,
     `composePath` (e.g. `./docker-compose.dokploy.yml`), `refreshToken`,
     `autoDeploy=true`, and all env vars in the `env` column.
4. **Deploy**: trigger via the webhook (matches what a git push does):
   ```bash
   curl -X POST http://127.0.0.1:3000/api/deploy/compose/<refreshToken> \
     -H 'x-github-event: push'
   ```
   Or push to the branch. Watch `deployment` / `composeStatus` rows until `done`.
5. **Add domain** (Dokploy DB `domain` row or UI): host `<app>.<domain>`,
   `https=true`, `port=3000`, `serviceName=app`, `domainType=compose`,
   `certificateType=letsencrypt`, `composeId` set. Unique config key is
   generated per app — Traefik routers become `<app>-<key>-web` /
   `<app>-<key>-websecure`.
6. **Verify** (see checklist below).

## Workflow: redeploy preserving data

1. Confirm the running stack's project name and volume names:
   ```bash
   ssh root@<vps> 'docker ps --format "{{.Names}} {{.Ports}}"; docker volume ls'
   ```
2. Tear down the old stack **without** `-v`:
   ```bash
   ssh root@<vps> 'docker compose -p <project> down'
   ```
   (If the old stack is orphaned — no `docker-compose.yml` — `cd` into its
   `/etc/dokploy/compose/<id>/` dir and run `docker compose -p <project> down`.)
3. Repoint Dokploy to git (or fix the compose row). Keep the same volume names.
4. Deploy via webhook / push. Migration containers exit 0 and re-apply nothing
   if schema hash already matches.
5. Verify data row counts match the pre-teardown numbers.

## Checklist after any deploy

- Containers healthy: `ssh root@<vps> 'docker ps'` (app healthy, db healthy,
  migration exited 0, no restarting/backoff).
- Domain: `curl -sI https://<app>.<domain>/` → 200 (not 404/502/525), valid
  cert (check expiry). If 404 on the domain but app container is healthy,
  the domain row / router is wrong; check `/etc/dokploy/traefik/` or the
  `domain` row.
- App DB data intact: query row counts via the db container.
- Static chunks load: extract `_next/static/...` URLs from the HTML and curl
  each → all 200 (rules out a stale/mismatched build).
- Auth/session flow works end to end (login → callback → dashboard).

## Diagnosing common failures

- **Domain 404 / app unreachable**: app is only on `dokploy-network`; there is
  no host port. Fix the `domain` row (serviceName/port/composeId) or recreate
  routers via redeploy. Old baked-in traefik labels create stale routers —
  remove them from compose and redeploy so Dokploy's routers take over.
- **`localhost:3000` shows Dokploy, not the app**: that is expected. Test the
  app only via the domain, or from inside the network:
  ```bash
  ssh root@<vps> 'curl -sI -H "Host: <app>.<domain>" http://127.0.0.1:443/'
  ```
  (curl the domain directly is the simplest correct check.)
- **Site stuck on loading spinner / bounces between `/` and `/login`**:
  - These pages call `redirect()` from a server component inside a Suspense
    boundary, so Next.js streams a 200 with `NEXT_REDIRECT;replace;...;307;`
    flight data **plus** a `<meta http-equiv="refresh" content="1;url=...">`
    fallback. If the client fails to process the RSC redirect in time, the
    meta-refresh hard-reloads the page → apparent "/ ↔ /login refresh loop".
  - Check the response stream for both markers:
    ```bash
    curl -s <url>/ | grep -oE 'NEXT_REDIRECT[^"]*|__next-page-redirect" content="[^"]*"'
    ```
  - This is usually transient (deploy churn) and clears once the deploy
    settles and the browser fully reloads. If persistent, the fix is to move
    the session check into `middleware.ts` (real 307 before streaming) instead
    of only inside page/layout server components.
  - Verify from a fresh/incognito session before debugging further.

## Notes on direct DB work (Dokploy)

- Shell into the Dokploy DB container and dump first:
  ```bash
  ssh root@<vps> 'docker exec <dokploy-postgres-container> pg_dump -U <user> <db>'
  ```
- `compose` rows need a non-null valid `createdAt` (a malformed one breaks the
  UI), plus `appName`, `sourceType`, git fields, `refreshToken`, and `env`.
- Deleting a `project` row cascade-deletes its `environment`, `compose`,
  `deployment`, and `domain` rows but does **not** remove the on-disk compose
  folder or the running containers.
