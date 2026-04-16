# MrFish Personal Blog (Hybrid Artisan)

A modern personal blog built with a **Swiss-Japandi** aesthetic, featuring a **Vue 3 + PrimeVue (Unstyled) + Tailwind CSS 4** frontend and a **TypeScript Express** backend.

## 🚀 Project Status
- [x] Initial design and project planning
- [x] Frontend initialized with Astro + Vue
- [x] PrimeVue (Unstyled) + Tailwind CSS 4 integrated
- [x] Backend development in progress
- [x] Docker orchestration setup

---

## 📅 Roadmap & TODOs

### Milestone 1: Base Infrastructure
- [x] Initialize `frontend/` (Astro + Vue)
- [x] Initialize `backend/` (Express + TypeScript)
- [x] Configure `nginx/default.conf` for reverse proxy
- [x] Create root `docker-compose.yml`
- [x] Verify "Hello World" connectivity (Frontend -> Nginx -> Backend)

### Milestone 2: Backend Development (Event Store)
- [x] Install Prisma and initialize schema
- [x] Configure PostgreSQL database connection
- [x] Define Event Schema (Views, Feedback, Devices)
- [x] Implement `POST /api/views` (Event-sourced view tracking)
- [x] Implement `POST /api/feedback` (User feedback ingestion)
- [x] Add device detection middleware via `User-Agent`

### Milestone 3: Frontend Development (Design System)
- [x] Configure **Tailwind CSS 4** and **PrimeVue** (Unstyled Mode)
- [ ] Build core `Layout.astro` component (Grid, Navigation, Footer)
- [x] Implement global theme variables (Bone, Ink, Indigo Slate) in `global.css`
- [ ] Create UI components using PrimeVue `pt` (Button, Input, Card)
- [ ] Implement Blog Index page (List of posts)
- [ ] Implement Blog Post Detail page (Markdown rendering)

### Milestone 4: Feature Integration
- [ ] Connect Vue components to Backend API for view counts
- [ ] Implement dynamic feedback forms in the footer/sidebar
- [ ] Build theme-switching logic (Light/Dark mode sync)
- [ ] Configure SEO metadata management
- [ ] Set up RSS feed generation

### Milestone 5: Deployment & Tunneling
- [ ] Finalize production `Dockerfile` for Frontend (Nginx build)
- [ ] Finalize production `Dockerfile` for Backend
- [ ] Configure `cloudflared` container in `docker-compose.yml`
- [ ] Secure public access via Cloudflare Tunnel (Zero Trust)
- [ ] Verify production-ready build and networking

---

## 🛠 Tech Stack
- **Frontend**: Vue 3, PrimeVue (Unstyled), Tailwind CSS 4, Astro, Vite, Pinia.
- **Backend**: Node.js, Express, TypeScript, Prisma (ORM).
- **Database**: PostgreSQL.
- **Infrastructure**: Docker, Nginx, Cloudflare Tunnel.

---

## 🎨 Design Reference
See [design.md](./design.md) for detailed aesthetic guidelines and color palettes.

## 📝 Plan Reference
See [project_plan.md](./project_plan.md) for the high-level architecture and scope.
