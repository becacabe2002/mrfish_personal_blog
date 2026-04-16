# Personal Blog Project Plan (Vue + Express + Docker)

## 1. Goal
Build a modern personal blog using **Vue 3 + PrimeVue**, powered by a **TypeScript Express backend**, fully containerized with **Docker Compose**, and accessible via **Cloudflare Tunnel**.

## 2. Scope
### Frontend (Vue 3)
- SPA architecture with **Vue Router**.
- **PrimeVue** (Unstyled Mode) + **Tailwind CSS** for a bespoke Swiss-Japandi aesthetic.
- Blog system (fetching JSON-based post metadata + rendering Markdown).
- Interactivity: Dynamic stats, feedback forms, theme toggling.

### Backend (Express + TypeScript)
- **Event-Sourced Architecture** for view tracking and reader feedback.
- Automatic device detection via `User-Agent`.
- PostgreSQL as the primary event store.
- API for post metadata and visitor stats.

### Infrastructure
- **Docker Compose**: Orchestrating Frontend, Backend, Postgres, and Nginx.
- **Nginx**: Serving static frontend assets and proxying `/api` requests.
- **Cloudflare Tunnel**: Secure public access without open ports.

## 3. Tech Stack
- **Frontend:** Vue 3, PrimeVue (Unstyled), Tailwind CSS, Vite, Pinia.
- **Backend:** Node.js, Express, TypeScript, Prisma (ORM).
- **Database:** PostgreSQL.
- **Deployment:** Docker, Nginx, Cloudflare Tunnel.

## 4. Repository Structure
```text
/
├── frontend/           # Vue application (Astro + Vue)
├── backend/            # Express API
├── nginx/              # Nginx configuration
├── docker-compose.yml  # Orchestration
├── design.md           # Design System
└── project_plan.md     # This file
```

## 5. Milestones

### Milestone 1: Base Infrastructure
- Initialize `frontend/` (Astro + Vue) and `backend/` (Express + TS).
- Write `docker-compose.yml` and `nginx/default.conf`.
- Verify the "Hello World" stack (Frontend -> Nginx -> Backend).

### Milestone 2: Backend Development (Event Store)
- Setup Prisma and PostgreSQL schema.
- Implement the `POST /api/views` endpoint (Event-sourced tracking).
- Implement the `POST /api/feedback` endpoint.

### Milestone 3: Frontend Development (Design System)
- Configure **Tailwind CSS** and **PrimeVue** (Unstyled Mode) in the Vue integration.
- Build the core layout (Grid, Navigation, Footer) using Tailwind utility classes.
- Implement the Blog Index and Post Detail pages.

### Milestone 4: Feature Integration
- Connect Vue components to the Backend API for view counts and feedback.
- Implement theme-switching logic (Light/Dark).
- Configure RSS feed and SEO metadata (Vite-SSG or simple meta management).

### Milestone 5: Deployment & Tunneling
- Finalize Dockerfiles for production.
- Configure `cloudflared` in Docker Compose.
- Secure the site with Cloudflare Zero Trust.
