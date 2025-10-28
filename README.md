FreshCart Rendering Choices (Short Report)

Assignment Overview
- Build a small e‑commerce app in Next.js with frontend pages and backend API routes, integrating a database and demonstrating multiple rendering methods across the app.

Rendering Strategy Summary
- Home Page (`/`) – Static Site Generation (SSG)
  - Data fetched at build time to render a product list. Client-side search/filter on the rendered dataset.
  - Purpose: fast, cacheable homepage optimized for frequent views.
- Product Detail (`/products/[slug]`) – Incremental Static Regeneration (ISR)
  - Pages pre-generated at build; revalidated automatically (e.g., every 60s) to reflect price/stock changes.
  - Purpose: static performance with periodic freshness for dynamic data.
- Inventory Dashboard (`/dashboard`) – Server-Side Rendering (SSR)
  - Fetches live inventory and aggregates on every request directly from the DB.
  - Purpose: always-fresh data and potential protection (e.g., admin-only).
- Admin Panel (`/admin`) – Client-Side Rendering (CSR)
  - Interactive forms to create/update products; client-side fetching from API.
  - Purpose: rich interactivity and optimistic UX for mutations.
- Recommendations (optional bonus, e.g., `/recommendations`) – Server Components + Client Components
  - Server fetches recommended products; a small client component provides “Add to Wishlist”.
  - Purpose: demonstrate hybrid App Router architecture.

Backend API Routes (Next.js /api)
- `GET /api/products` – Fetch all products
- `GET /api/products/[slug]` – Fetch a single product by slug
- `POST /api/products` – Add a new product (admin-protected)
- `PUT /api/products/[id]` – Update a product (price/inventory, admin-protected)
- Protection: simple key-based header (e.g., `x-admin-key`) or mock auth in requests for POST/PUT.

Data Model (Product)
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "price": 0,
  "category": "string",
  "inventory": 0,
  "lastUpdated": "2025-01-01T00:00:00.000Z"
}
- Storage: MongoDB recommended; a JSON file can be used for a mock implementation.

Data Flow
- Build time (SSG/ISR): server fetches from DB/API to generate static HTML + JSON payloads.
- Request time (SSR): server fetches DB on each request; response HTML contains fresh data.
- Client time (CSR): admin UI fetches from `/api` endpoints; mutations trigger revalidation (optional) to refresh ISR pages.

Authentication/Protection (Admin)
- Admin routes guarded by a simple key header or mock auth token. Server validates before processing POST/PUT.

Local Development
- Run: `npm install && npm run dev`
- Environment: provide `.env.example` with DB URL, optional `ADMIN_KEY`, and ISR revalidate seconds.

Challenges & Solutions (examples)
- Keeping product pages fresh without full rebuilds → ISR with a 60s revalidate.
- Fast interactive admin UX → CSR + optimistic UI and toasts.
- Consistent data between ISR pages and admin updates → trigger revalidation or rely on periodic ISR window.

Screenshots (to include)
- Home, Product Detail (ISR), Dashboard (SSR), Admin (CSR), optional Recommendations.

Summary
- The app uses a hybrid approach: SSG for the homepage, ISR for product detail, SSR for live dashboards, and CSR for the admin panel. This balances performance, freshness, and interactivity while keeping implementation complexity reasonable.