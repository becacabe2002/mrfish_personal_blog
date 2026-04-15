# Personal Blog Project Plan

## 1. Goal
Build a personal blog using **Astro + React**, self-hosted with **Docker Compose**, and securely published to the internet via **Cloudflare Tunnel**, with a backend API for **views, comments, and likes**.

## 2. Scope
### In scope
- Astro site with React components.
- Blog post system (Markdown/MDX content).
- Basic pages: Home, Blog index, Post detail, About, 404.
- SEO basics: sitemap, robots.txt, meta tags, Open Graph.
- Backend API for post stats and interactions.
- View tracking/counting per post.
- Comment and like system per post.
- Dockerized deployment with a reverse proxy.
- Cloudflare Tunnel for public access without opening inbound ports.
- CI checks (lint/build) and backup strategy.

### Out of scope (initial release)
- Complex CMS integrations.
- Multi-author workflow.
- Advanced analytics dashboards.
- Full social features (follows, notifications, rich profiles).
- Real-time comment streaming/websocket chat.

## 3. Architecture
- **Frontend**: Astro (static-first) with React islands for interactive UI.
- **Content**: Local Markdown/MDX collections in Git.
- **Serving**: Nginx container serving generated static files and reverse-proxying `/api`.
- **Backend API**: Express.js + TypeScript (REST endpoints for stats/interactions).
- **Database**: PostgreSQL for views (aggregated/unique), comments, and likes.
- **Optional cache/rate-limit store**: Redis for throttling and deduplication windows.
- **Orchestration**: Docker Compose.
- **Edge access**: Cloudflare Tunnel (`cloudflared`) container.
- **DNS/SSL**: Managed by Cloudflare.

High-level flow:
1. Build Astro site into static output.
2. Nginx serves static assets and routes `/api/*` to `api:3000`.
3. API writes/reads interaction data from PostgreSQL (and optionally Redis for throttling).
4. `cloudflared` forwards traffic from Cloudflare edge to Nginx service.
5. Domain points to tunnel route in Cloudflare Zero Trust.

## 4. Tech Stack
- Astro (latest stable)
- React + TypeScript
- Astro content collections (Markdown/MDX)
- Nginx (alpine)
- Node.js + Express.js + TypeScript (API)
- PostgreSQL
- Redis (optional)
- Docker Compose v2
- Cloudflare Tunnel (`cloudflared`)
- Optional: GitHub Actions for CI

## 5. Milestones
## Milestone 1: Project Bootstrap
- Initialize Astro project with React integration.
- Configure TypeScript, linting, formatting.
- Create base layout, header, footer, and navigation.

**Deliverable**: Local dev server with working page structure.

## Milestone 2: Content System
- Set up Astro content collections schema.
- Add sample blog posts and tag/category fields.
- Build blog listing and post detail pages.
- Add pagination and reading-time helper.

**Deliverable**: Fully browsable blog content from Markdown/MDX.

## Milestone 3: UX + SEO
- Implement responsive theme and typography.
- Add SEO meta component, Open Graph defaults, canonical URLs.
- Generate sitemap and robots.txt.
- Add RSS feed.

**Deliverable**: Production-ready static site quality.

## Milestone 4: Backend API + Data Model
- Initialize Express + TypeScript service.
- Define DB schema: posts, view_events/view_aggregates, comments, likes.
- Add endpoints:
  - `POST /api/posts/:slug/view`
  - `GET /api/posts/:slug/stats`
  - `GET /api/posts/:slug/comments`
  - `POST /api/posts/:slug/comments`
  - `POST /api/posts/:slug/like`
  - `DELETE /api/posts/:slug/like`
- Add basic moderation state for comments (`pending`, `approved`, `rejected`).
- Add basic anti-abuse controls (rate limits + dedupe for repeated views).

**Deliverable**: API returns per-post views/comments/likes and supports writes.

## Milestone 5: Containerization
- Create multi-stage Dockerfile (build Astro, serve via Nginx).
- Add Dockerfile for API service.
- Write `docker-compose.yml` for `blog`, `api`, `db`, and optional `redis` services.
- Add health checks and sensible restart policy.

**Deliverable**: `docker compose up -d` serves blog + API stack locally.

## Milestone 6: Cloudflare Tunnel
- Create Cloudflare Tunnel and token/credentials.
- Add `cloudflared` service to Compose.
- Map hostname (e.g., `blog.example.com`) to internal Nginx service (`/` static, `/api` proxied).
- Validate HTTPS access through Cloudflare edge.

**Deliverable**: Public site and API reachable securely without port forwarding.

## Milestone 7: Operations & Hardening
- Configure cache headers in Nginx.
- Add API security headers and strict CORS policy.
- Add DB backup/restore job and retention policy.
- Add automated image update strategy (manual or Watchtower if desired).
- Document backup/restore process.
- Add CI pipeline for frontend lint/build and API lint/test/build.

**Deliverable**: Stable and maintainable deployment workflow.

## 6. Repository Structure (proposed)
```text
.
├─ src/
│  ├─ components/
│  ├─ layouts/
│  ├─ pages/
│  └─ content/
│     └─ blog/
├─ api/
│  ├─ src/
│  ├─ prisma/ or migrations/
│  ├─ package.json
│  └─ tsconfig.json
├─ public/
├─ nginx/
│  └─ default.conf
├─ Dockerfile
├─ api.Dockerfile
├─ docker-compose.yml
├─ cloudflared/
│  └─ config.yml (optional if using token-only mode)
├─ .env
└─ README.md
```

## 7. Docker Compose Plan
Services:
- `blog`: Nginx serving static build artifacts.
- `api`: Express service for view/comment/like endpoints.
- `db`: PostgreSQL persistence.
- `redis` (optional): rate limiting / short-window dedupe.
- `cloudflared`: Connects to Cloudflare Tunnel and forwards to `blog:80`.

Environment variables:
- `CLOUDFLARE_TUNNEL_TOKEN=...`
- `DATABASE_URL=postgresql://...`
- `REDIS_URL=redis://...` (if enabled)
- `API_PORT=3000`
- `CORS_ORIGIN=https://blog.example.com`
- Optional app metadata (site URL, environment).

Networking:
- Internal Docker network shared by `blog`, `api`, `db`, `redis` (optional), and `cloudflared`.
- No public port exposure required in production when tunnel is active.

## 8. API Endpoint Schemas (Draft)
Base path: `/api`

### 8.1 Health
- `GET /health`
- Response `200`:
```json
{ "ok": true }
```

### 8.2 Track View
- `POST /posts/:slug/view`
- Purpose: count 1 view if viewer has not viewed the same post within dedupe window (default 60 minutes).
- Request body: optional (empty JSON allowed)
- Response `200`:
```json
{
  "slug": "my-post",
  "counted": true,
  "dedupeWindowMinutes": 60,
  "views": 42
}
```

### 8.3 Post Stats
- `GET /posts/:slug/stats`
- Response `200`:
```json
{
  "slug": "my-post",
  "views": 42,
  "likes": 7,
  "comments": 3
}
```
- Response `404`:
```json
{ "error": "Post not found" }
```

### 8.4 List Comments
- `GET /posts/:slug/comments`
- Returns approved comments only by default.
- Response `200`:
```json
{
  "slug": "my-post",
  "comments": [
    {
      "id": 101,
      "authorName": "Alice",
      "body": "Nice article!",
      "status": "approved",
      "createdAt": "2026-04-15T09:10:11.000Z"
    }
  ]
}
```

### 8.5 Create Comment
- `POST /posts/:slug/comments`
- Request body:
```json
{
  "authorName": "Alice",
  "body": "Nice article!"
}
```
- Response `201` (default moderation state is `pending`):
```json
{
  "slug": "my-post",
  "comment": {
    "id": 102,
    "authorName": "Alice",
    "body": "Nice article!",
    "status": "pending",
    "createdAt": "2026-04-15T09:10:11.000Z"
  }
}
```

### 8.6 Add Like
- `POST /posts/:slug/like`
- Request body (optional):
```json
{
  "actorId": "user-or-anon-token"
}
```
- Response `200`:
```json
{
  "slug": "my-post",
  "likes": 8
}
```

### 8.7 Remove Like
- `DELETE /posts/:slug/like`
- Request body (optional):
```json
{
  "actorId": "user-or-anon-token"
}
```
- Response `200`:
```json
{
  "slug": "my-post",
  "likes": 7
}
```

### 8.8 Validation and Error Format
- Invalid body/params should return `400`.
- Unknown post for read-only endpoints should return `404`.
- Generic server failure should return `500`.
- Suggested error response:
```json
{
  "error": "Validation failed",
  "details": {}
}
```

## 9. Draft PostgreSQL Schemas (Possible)
Option A below is recommended for v1.

### 9.1 Option A: Event + Relational Tables (Recommended)
```sql
-- Extension useful for case-insensitive unique email/name if needed later
-- CREATE EXTENSION IF NOT EXISTS citext;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comment_status') THEN
    CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_view_events (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewer_hash TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_post_view_events_post_id
  ON post_view_events(post_id);
CREATE INDEX IF NOT EXISTS idx_post_view_events_post_id_viewer_hash_viewed_at
  ON post_view_events(post_id, viewer_hash, viewed_at DESC);

CREATE TABLE IF NOT EXISTS post_likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  actor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_post_like_actor UNIQUE (post_id, actor_hash)
);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id
  ON post_likes(post_id);

CREATE TABLE IF NOT EXISTS post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  status comment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id
  ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id_status_created_at
  ON post_comments(post_id, status, created_at DESC);
```

### 9.2 Option B: Add Daily Aggregates for Scale
Use Option A + an aggregate table populated by cron/worker:
```sql
CREATE TABLE IF NOT EXISTS post_daily_metrics (
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  views_count BIGINT NOT NULL DEFAULT 0,
  likes_count BIGINT NOT NULL DEFAULT 0,
  comments_count BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, metric_date)
);
```
When traffic grows, read stats from `post_daily_metrics` + today’s delta from event tables.

### 9.3 Notes
- Keep only hashed identity keys (`viewer_hash`, `actor_hash`) to reduce PII exposure.
- Consider partitioning `post_view_events` by month if volume increases significantly.
- Add a scheduled cleanup policy if raw events are not needed long-term.

## 10. Security Checklist
- Keep Cloudflare tunnel token in `.env` and never commit secrets.
- Keep DB credentials and API secrets in `.env` or secret manager; never commit.
- Enable Cloudflare security features (WAF, bot mitigation, rate limiting as needed).
- Add API request validation and response sanitization.
- Implement comment moderation workflow to reduce abuse/spam.
- Hash/anonymize identifiers used for view dedupe where possible (privacy by design).
- Run containers as non-root where possible.
- Pin container image versions.
- Regularly patch base images and dependencies.

## 11. Content & Publishing Workflow
1. Write post in `src/content/blog/*.md`.
2. Commit and push changes.
3. Rebuild and redeploy containers.
4. Verify page, metadata, feed, and post stats endpoint.
5. Moderate new comments if moderation is enabled.

Optional automation:
- CI builds Docker image on main branch.
- CI runs DB migration checks and API tests.
- CD step pulls images and restarts compose stack on host.

## 12. Risks and Mitigations
- **Tunnel misconfiguration**: Use a staging hostname first and validate route mapping.
- **Broken deploy from bad content**: Enforce build checks in CI before deploy.
- **Spam/abuse on comments and likes**: Add rate limits, moderation, and optional captcha.
- **Inflated view counts**: Use dedupe windows + basic bot filtering + Cloudflare protections.
- **DB loss/corruption**: Automate backups and test restore regularly.
- **Downtime during updates**: Keep images prebuilt and restart quickly; optionally add blue/green later.
- **Secret leakage**: Use `.env`, host secret manager, and `.gitignore` safeguards.

## 13. Definition of Done (v1)
- Blog pages render correctly on desktop/mobile.
- At least 3 sample posts published.
- SEO essentials active (meta, sitemap, robots, RSS).
- Views increment and can be queried per post.
- Likes can be added/removed and counted per post.
- Comments can be submitted, stored, listed, and moderated.
- Stack runs with `docker compose up -d` (blog + API + DB).
- Domain served through Cloudflare Tunnel over HTTPS.
- Basic runbook documented in `README.md`.

## 14. Next Actions
1. Scaffold Astro project with React and TypeScript.
2. Scaffold Express API + PostgreSQL schema for views/comments/likes.
3. Implement content collections + page templates + API integration.
4. Add Dockerfiles, Nginx config, and Compose services (`blog`, `api`, `db`, optional `redis`).
5. Configure Cloudflare Tunnel and DNS route.
6. Run final production smoke test (pages + API write/read flows).
