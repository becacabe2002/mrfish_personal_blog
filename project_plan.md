# Personal Blog Project Plan

## 1. Goal
Build a personal blog using **Astro + React**, self-hosted with **Docker Compose**, and securely published to the internet via **Cloudflare Tunnel**, with a separate backend API for **event-sourced view tracking and anonymous reader feedback**.

## 2. Scope
### In scope
- Astro site with React components.
- Blog post system (**Markdown/MDX content stored in Git**).
- Basic pages: Home, Blog index, Post detail, About, 404.
- SEO basics: sitemap, robots.txt, meta tags, Open Graph.
- Backend API (Express.js) for post stats and interactions.
- **Event-sourced view tracking** (counts views + total views).
- **Automatic device detection** (mobile/desktop) for analytics.
- **Anonymous reader feedback** (text field per post).
- Dockerized deployment with an Nginx reverse proxy.
- Cloudflare Tunnel for secure public access.

### Out of scope (initial release)
- User accounts / Likes / Full comment threads.
- Real-time features.
- In-browser content editing (CMS).
- Redis caching (not needed for v1).

## 3. Architecture
- **Frontend**: Astro (static-first) with React islands for dynamic stats/forms.
- **Content**: Local Markdown/MDX collections in Git (Static Content).
- **Backend API**: Standalone Express.js + TypeScript service (Dynamic Metadata).
- **Database**: PostgreSQL as an **Event Store** (View and Feedback events).
- **Serving**: Nginx container serving static build artifacts and proxying `/api` to the Express service.
- **Edge access**: Cloudflare Tunnel (`cloudflared`) container.

## 4. Tech Stack
- Astro (latest stable)
- React + TypeScript
- Astro Content Collections
- Node.js + Express.js + TypeScript
- PostgreSQL
- Docker Compose v2
- Cloudflare Tunnel (`cloudflared`)
- `ua-parser-js` (for automatic device detection)

## 5. Milestones

### Milestone 1: Project Bootstrap
- Initialize Astro project with React integration.
- Configure TypeScript, linting, and formatting.
- Create base layout and navigation.

### Milestone 2: Content System
- Set up Astro content collections for Markdown/MDX.
- Build blog listing and post detail templates.
- Ensure images/media are handled via Astro's asset pipeline.

### Milestone 3: Backend API & Event Store
- Initialize Express + TypeScript service.
- Define Event-Sourced PostgreSQL schema (`view_events`, `feedback_events`).
- Implement automatic device detection in the view-tracking endpoint.
- Implement anonymous feedback submission.

### Milestone 4: Frontend Integration
- Build React "PostStats" component to trigger/fetch views.
- Build React "FeedbackForm" component for anonymous submissions.
- Integrate RSS feed and SEO metadata.

### Milestone 5: Containerization & Tunnel
- Create Dockerfiles for Astro (multi-stage) and Express.
- Write `docker-compose.yml` including Nginx and Cloudflare Tunnel.
- Configure public routing via Cloudflare Zero Trust.

## 6. Repository Structure
```text
.
├─ src/             # Astro frontend
│  ├─ content/blog/ # Markdown/MDX posts
│  ├─ components/   # React islands (Stats, Feedback)
│  └─ pages/
├─ api/             # Express backend
│  ├─ src/
│  └─ package.json
├─ nginx/           # Nginx config (Static + Proxy)
├─ Dockerfile       # Frontend build
├─ api.Dockerfile   # Backend build
├─ docker-compose.yml
└─ .env
```

## 7. API Endpoint Schemas
Base path: `/api`

### 7.1 View Tracking
- `POST /api/views`
- Request: `{ "slug": "my-post" }`
- Logic: Automatically detects `device_type` from `User-Agent`. Deduplicates using an anonymous session hash.
- Response: `{ "slug": "my-post", "views": 150 }`

### 7.2 Post Stats
- `GET /api/stats/:slug`
- Returns total views for a specific slug.
- `GET /api/stats/total`
- Returns total views across all posts.

### 7.3 Reader Feedback
- `POST /api/feedback`
- Request: `{ "slug": "my-post", "message": "Great read!" }`
- `GET /api/feedback/:slug`
- Returns approved feedback messages for a post.

## 8. PostgreSQL Schema (Event-Sourced)
```sql
CREATE TABLE view_events (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  device_type TEXT,            -- 'mobile', 'tablet', 'desktop'
  viewer_hash TEXT,            -- Anonymous hash for deduplication
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feedback_events (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'hidden'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 9. Definition of Done (v1)
- Blog posts render from Markdown with optimized images.
- Views are recorded and counted automatically on page load.
- Readers can submit anonymous text feedback.
- Site is publicly accessible via HTTPS (Cloudflare Tunnel).
- Deployment is fully managed by a single `docker compose up -d`.
