# MovoX — Digital Growth Agency Website

A premium, modern, responsive corporate website for MovoX, a digital growth agency.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- React Hook Form + Zod
- Framer Motion

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Type check
npm run typecheck
```

## Environment

Create a `.env` file from `.env.example`. Live form submission requires `VITE_FORM_ENDPOINT` and optional `VITE_EMAIL_SERVICE_KEY`. Without these, forms use a documented local integration boundary and do not submit live.

### Start a Project enquiry backend

The `/start-a-project` wizard posts through a single integration layer: `src/lib/enquiryApi.ts`.

1. Copy `.env.example` to `.env` and set `VITE_ENQUIRY_ENDPOINT` to your API URL (optional `VITE_ENQUIRY_API_KEY`).
2. Implement a `POST` endpoint that accepts the JSON payload built by `buildPayload()` and returns:
   - `200`/`201` → `{ "ok": true, "referenceId": "MVX-…" }`
   - `409` → duplicate submission (returns the existing `referenceId`)
   - `429` → rate limited
   - `4xx`/`5xx` → `{ "ok": false, "error": "message" }`
3. On the server, persist to a `project_enquiries` table with columns for the enquiry ID, contact info, goal, services, business info, description, budget range, timeline, contact method, `submitted_at` timestamp and `lead_status` (default `'New'`).

Server-side responsibilities (not part of this SPA):

- Re-validate payloads with the same rules as the client.
- Rate limit per IP.
- Honeypot (`company_website`) and time-trap spam checks.
- Duplicate prevention on `submissionToken` (or email).
- Keep secrets out of client code — `VITE_*` values are always browser-visible.

**If the endpoint is unset, the wizard runs in demo mode:** submissions are saved to the browser's local storage so they appear in the admin dashboard's Leads inbox, and the UI tells the user their enquiry was saved locally (not sent to a server). Success is never faked.

## Admin dashboard

A role-based admin area lives at `/admin` (linked from the footer's bottom bar). It is backed by a **real database**: a Cloudflare Worker API reading/writing Neon Postgres, with Cloudflare R2 for file storage. If the API is unreachable it transparently falls back to browser local storage.

**Real stack**

- **Cloudflare Worker** (`worker/`) — Hono API on the existing Neon schema. Never exposes DB credentials to the browser.
- **Neon Postgres** — the production database (`admin_users`, `enquiries`, `works`, `blogs`, `projects`, `agreements`, `invoices`, `quotations`, `policies`, `settings`, `team_members`, `project_*`).
- **Cloudflare R2** (`beyonddigital` bucket) — stores uploaded files; public URLs come from the R2 public domain.
- **Frontend** (`src/store/`) — an observable store that is remote-first with a local fallback.

**Running it**

```bash
# 1. Install (root + worker)
npm install
npm --prefix worker install

# 2. Apply the schema to Neon
npm run db:migrate

# 3. Start both the API and the site (Vite :5174, Worker :8787)
npm run dev
```

Vite proxies `/api` → `http://127.0.0.1:8787`, so the browser talks to same-origin `/api/*`. In production set `VITE_API_URL` to the deployed Worker URL.

**Admin login**

- `admin@heymovox.com` · password `MovoX@2026` (reset via `npm --prefix worker run db:adopt`; the hash is PBKDF2-SHA256, verified in the Worker with Web Crypto).

**Worker secrets** live in `worker/.dev.vars` (local) and `wrangler secret put` (production):

- `DATABASE_URL` — Neon connection string.
- `SESSION_SECRET` — reserved for signed sessions.
- `ALLOWED_ORIGIN` — CORS origin (defaults to `http://localhost:5174`).
- R2 is accessed through the `BUCKET` binding — no S3 keys in code.

**Modules and roles**

| Module | Admin | Ops Manager | Project Manager | Developer | Sales |
|---|---|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| Leads (enquiries) | ✓ | | | | ✓ |
| Blog / Portfolio (CMS) | ✓ | | | | |
| Projects | ✓ | ✓ | ✓ | ✓ | |
| Agreements | ✓ | ✓ | ✓ | | |
| Invoices | ✓ | ✓ | | | |
| Quotations | ✓ | ✓ | | | |
| Revenue | ✓ | ✓ | | | |
| File Manager | ✓ | | | ✓ | |
| Team & Clients (user + role management) | ✓ | | | | |

The admin surfaces the database's real data — the Work page shows the published case study, Insights shows the articles, and the Leads inbox shows genuine enquiries. Writes (CMS edits, new leads, uploads) go straight to Neon/R2.

**Deploying**

1. `npm --prefix worker run deploy` (set secrets first with `wrangler secret put DATABASE_URL`).
2. Set `VITE_API_URL` to the Worker URL and `npm run build`.
3. Serve `dist/` from any static host.

**Useful scripts**

- `npm run db:migrate` — create/update tables in Neon.
- `npm run worker:deploy` — deploy the API.
- `npm run dev:worker` / `npm run dev:client` — run one side only.

## Project Structure

See `src/` for components, pages, data, styles and types. Public assets live in `public/`.

- `worker/` — the Cloudflare Worker: API routes, Neon repository, R2 helpers, migration scripts.
- `src/store/` — remote-first data layer, role/permission matrix and React bindings.
- `src/lib/adminApi.ts` — the typed client for the Worker API.
- `src/admin/` — the dashboard: layout, guards, reusable UI primitives and one page per module.
- `src/lib/enquiryApi.ts` — enquiry submission boundary and env contract.
- `src/data/projectEnquiry.ts` — wizard options, labels and defaults.
- `src/components/project/` — reusable wizard components (progress, option cards).
