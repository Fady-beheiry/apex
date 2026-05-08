# APEX Sportswear

A premium luxury sportswear e-commerce platform. Full-stack app with cinematic storefront, product catalog, cart/checkout (COD), admin dashboard, and PostgreSQL backend.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/sportswear run dev` — run the frontend (port 25296)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — JWT signing secret for admin auth

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter routing
- API: Express 5, bcryptjs + jsonwebtoken for admin auth
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all endpoints)
- `lib/db/src/schema/` — Drizzle DB schema (categories, products, orders, reviews, admins, banners)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/sportswear/src/` — React frontend
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas (do not edit)

## Admin Access

- URL: `/admin/login`
- Email: `admin@apex.com`
- Password: `admin123`

## Architecture decisions

- Cart is fully client-side (React context + localStorage) — no server-side cart
- Checkout uses Cash on Delivery (COD) — no payment gateway integration
- Admin auth uses JWT tokens stored in localStorage
- Order numbers are auto-generated with format `APEX-{timestamp36}-{random}`
- Product prices stored as NUMERIC in DB, returned as Number in API responses

## Product

Premium luxury sportswear e-commerce with:
- Cinematic homepage with featured/best-seller/new-arrival carousels
- Full product catalog with category/search filtering
- Product detail with image gallery, size/color selector, quick-add drawer
- COD checkout flow (no payment gateway)
- Order tracking by order number
- Admin dashboard with analytics, product/order/banner management

## Gotchas

- After any OpenAPI spec change: run `pnpm --filter @workspace/api-spec run codegen`, then immediately fix `lib/api-zod/src/index.ts` to only have `export * from "./generated/api"` (orval regenerates this with duplicate exports)
- The `orval.config.ts` has the `schemas` option removed to avoid duplicate export issues
- Run codegen before launching the design subagent so hooks are available
