# Ishaq Medical, Surgical & Cosmetics

Production-quality MERN storefront for a Gilgit-Baltistan medical, surgical and cosmetics retailer.

The React app is designed to run **without** Express or MongoDB. Set `VITE_DATA_SOURCE=local` or leave `auto` (API, then local catalog fallback).

## Quick start (frontend only)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Data sources

| `VITE_DATA_SOURCE` | Behaviour |
| --- | --- |
| `local` | Always use `frontend/src/data` |
| `api` | Always use Express `/api/v1` |
| `auto` (default) | Try API, fall back on network/5xx/timeout |

Cart, wishlist and recently viewed persist in the browser. Demo checkout and prescription upload do **not** send money or files to a server.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

MongoDB is optional for bringing the HTTP server up. If Mongo is down, catalog endpoints return 503 and the frontend `auto` mode uses local data.

```bash
npm run seed            # requires MongoDB — upserts admin, settings, sample catalog
npm run migration:up    # migrate-mongo + __migrations_backup summaries
npm run migration:status
```

Default staff login after seed/migration: `admin@ishaq.local` / `Admin123!`

## Architecture

See `docs/ARCHITECTURE.md`.

Do not invent NAP. Business facts live in `frontend/src/data/storeSettings.ts` and the `storeSettings` collection.

## Deploy on Vercel

The live site is the Vite storefront. On Vercel it builds with `VITE_DATA_SOURCE=local`, so the catalog, team, cart and admin demo work without Mongo.

1. Push this repo to GitHub.
2. [Import the project](https://vercel.com/new) and leave the root as the repo root (`vercel.json` is already here).
3. Deploy. After the first build, Vercel gives you a `*.vercel.app` URL.

To point the same site at a live API later, add these environment variables in the Vercel project (Production) and redeploy:

- `VITE_DATA_SOURCE` = `auto`
- `VITE_API_URL` = `https://your-api-host/api/v1`
- `VITE_SITE_URL` = your Vercel domain

The Express API is not hosted on Vercel in this setup. Run it on Railway, Render, or a VPS if you need real orders and Mongo.

## Scripts

Frontend: `npm run dev` · `npm run build` · `npm run preview`  
Backend: `npm run dev` · `npm run seed` · `npm run migration:up`
