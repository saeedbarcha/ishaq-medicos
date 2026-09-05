# Ishaq Medical, Surgical & Cosmetics — Architecture

This document is the source of truth for product, technical, SEO, and operational decisions.

**Brand:** Ishaq Medical, Surgical & Cosmetics  
**Location:** Gilgit-Baltistan, Pakistan  
**Stack:** React + Vite (frontend) · Express + MongoDB (backend) · shared TypeScript types

Business facts (address, phone, hours, licenses) live only in `storeSettings`. Unverified values are explicit placeholders and must never be invented in copy, schema, or SEO.

---

## 1. Research summary

### Pharmacy ecommerce
Customers evaluate safety before convenience. Winning sites (DVAGO, Dawaai, Servaid, Tata 1mg) make authenticity, prescription rules, and pharmacist review visible without looking like hospital software. Trust patterns that convert:

- Rx badges and clear “prescription required” copy before add-to-cart
- Separate commerce vs clinical surfaces (cart stays familiar; prescription upload is its own flow)
- Fast search by brand, salt, and everyday names
- COD as a first-class payment, not an afterthought
- WhatsApp as a real sales channel in Pakistan

### Pakistani ecommerce behaviour
- Mobile-first, often on slower networks
- JazzCash / Easypaisa / COD / bank transfer / store pickup
- WhatsApp product inquiry is expected
- Guest checkout is essential; accounts are optional
- Delivery area honesty matters more than “nationwide” claims

### Local Gilgit-Baltistan context
National pharmacies list Gilgit as a delivery city but are not local shops. Physical stores in Gilgit (Punjab Medical Store, Afandi, Iqbal, Shah Pharmacy & Surgical, hospital pharmacies) are mostly offline. The opportunity is a **local, trustworthy retail brand** with three verticals — medicines, surgical/equipment, cosmetics — not a Karachi-clone mega-pharmacy.

Hospital pharmacy stock gaps in GB are a documented patient pain. The site should communicate availability and pharmacist review, never clinical diagnosis.

### What we will not copy
- Generic medical-cross templates and dashboard aesthetics
- Fake customer counts, awards, or invented NAP
- Tourism photography as the hero
- Diagnosis-style “shop by symptom” that implies medical advice

---

## 2. Competitor / pattern observations

| Pattern | National pharmacies | Ishaq approach |
| --- | --- | --- |
| Identity | Nationwide chain / marketplace | Local GB retail + three verticals |
| Hero | App download, discounts | Product-forward, three-category promise |
| Search | Salt + brand | Same, plus local spelling variants |
| Rx | Upload then pharmacist builds cart | Upload as dedicated journey; OTC still shoppable |
| Trust | Logos, discounts | Quiet professionalism, placeholders until verified |
| Contact | Call centres | WhatsApp + store contact (from settings only) |
| Cosmetics | Buried wellness aisle | First-class vertical with its own IA |
| Surgical | Devices as SKUs | Dedicated category architecture + spec fields |

---

## 3. Sitemap

### Public (indexable)

- `/` Home
- `/medicines` · `/medicines/:subcategory`
- `/otc`
- `/surgical` · `/surgical/:subcategory`
- `/medical-equipment` (alias intent → surgical equipment content)
- `/cosmetics` · `/cosmetics/:subcategory`
- `/skin-care`
- `/personal-care`
- `/mother-baby`
- `/vitamins-supplements`
- `/health-needs/:need`
- `/brands` · `/brands/:brandSlug`
- `/products/:productSlug`
- `/deals`
- `/prescription` (informational + form; no PHI in HTML)
- `/delivery`
- `/about`
- `/contact`
- `/blog` · `/blog/:articleSlug`
- `/faq`
- `/privacy` · `/terms` · `/returns`

### Utility (noindex)

- `/search`
- `/cart` · `/wishlist` · `/checkout` · `/checkout/success`
- `/track-order`
- `/account/*`
- `/login` · `/register` · `/forgot-password`
- `/admin/*`

---

## 4. Information architecture

Three merchandising trees (Medicines, Surgical, Cosmetics) plus cross-cutting discovery (health needs, brands, deals, search). Navigation is audience-based; URLs are intent-based for SEO.

```
Shop
├── Medicines (prescription + OTC)
├── OTC & Health Needs
├── Surgical & Medical Equipment
├── Cosmetics & Skin Care
├── Personal Care
├── Mother & Baby
└── Vitamins & Supplements

Discover
├── Brands
├── Deals
├── Health needs (cold, pain, first aid, …)
└── Blog / Health guides

Service
├── Upload prescription
├── Delivery
├── Track order
└── Contact / WhatsApp
```

---

## 5. User journeys

1. **OTC buy** — Search/category → product → cart → guest checkout → COD/pickup.
2. **Prescription medicine** — Product (Rx locked) or `/prescription` → upload → pharmacist review → quoted order → checkout.
3. **Surgical device** — Category → specs/warranty → WhatsApp or cart → delivery/pickup.
4. **Cosmetics routine** — Concern/skin type → product → related routine → cart.
5. **Caregiver** — Search salt name → compare packs → WhatsApp confirm stock.
6. **Reorder** — Account orders → reorder (API) or demo orders (local).

---

## 6. Homepage section plan

1. Announcement bar  
2. Header  
3. Hero (three verticals + GB availability)  
4. Trust indicators (no invented stats)  
5. Shop by category  
6. Prescription upload CTA  
7. Featured / popular  
8. Medicines  
9. Surgical & equipment  
10. Cosmetics & skin care  
11. Mother & baby  
12. Shop by health need (discovery, not diagnosis)  
13. Featured brands  
14. Deals  
15. Why choose us  
16. GB service area  
17. Reviews (demo flagged; no JSON-LD ratings)  
18. Blog  
19. FAQ  
20. Newsletter / contact CTA  
21. Footer  

---

## 7. Category architecture

See `frontend/src/data/categories.ts`. High-level:

- Medicines: prescription, OTC, pain, cold & flu, digestive, allergy, first aid  
- Surgical: BP, glucometers, nebulizers, thermometers, mobility, ortho, dressings, instruments, PPE, respiratory, home care  
- Cosmetics: skin, face, hair, body, sun, medicated cosmetics, grooming  
- Personal care, Mother & baby, Vitamins  

Health needs are tagged, not a fourth catalog.

---

## 8. Design system

- **Primary:** deep teal (`--color-primary`)  
- **Secondary:** deep navy  
- **Surfaces:** white + cool gray  
- **Accent:** mint  
- **Semantic:** red error, amber warning — never red as brand  
- **Type:** Manrope  
- **Radius:** 12–16px cards, 999 pills  
- **Shadow:** low elevation only  
- **Motion:** opacity/transform, `prefers-reduced-motion` respected  
- **Motif:** single thin mountain line, used sparingly  

---

## 9. Frontend architecture

Vite SPA with:

- Feature folders, not page-god-components  
- Redux Toolkit for auth, cart, wishlist, checkout, store settings, data-source status  
- RTK Query as the **only** UI-facing remote API  
- Custom `smartBaseQuery`: local | api | auto (API then local fallback)  
- Repositories behind local/API adapters so components never branch on data source  
- React Router data-router objects (prerender-friendly)  
- Helmet-async + build-time prerender of public routes  

---

## 10. Backend architecture

Express layered monolith (HeyCarla pattern):

`routes/v1 → controllers → services → models → MongoDB`

Supporting layers: `middlewares` (admin JWT, Joi `validate`, rate limiter, error converter), `validations`, `utils` (`catchAsync`, `ApiError`, `pick`), `helpers` (response, slug, CRUD, audit).

Public catalog lives at `/api/v1/*`. Staff APIs live at `/api/v1/admin/*` (login, dashboard, products, categories, brands, inventory, orders, prescriptions, banners, blog, FAQs, delivery zones, reviews, coupons, inquiries, settings, users, audit logs).

Schema changes use **migrate-mongo**. Each migration writes a summary row to `__migrations_backup` (in_progress → completed/failed). Down scripts may remove those backup rows; they do not blindly delete collection backups.

Helmet, CORS, rate limits, Joi validation, central errors, activity logs. Prices recalculated server-side. No Docker.

---

## 11. Frontend standalone / fallback

`VITE_DATA_SOURCE=local | api | auto` (default `auto`).

- **local:** always demo datasets in `frontend/src/data`  
- **api:** always backend; show recovery UI on failure for persistence actions  
- **auto:** try API; on network/5xx/timeout/invalid payload, use local catalog  

Cart/wishlist persist via redux-persist. Prescription demo validates locally and **does not** store files. Production payments never silently succeed.

---

## 12. API architecture

`GET/POST/PATCH/DELETE /api/v1/{resource}`

Success: `{ success, message, data, meta }`  
Error: `{ success: false, message, errors }`

Query: `search, category, brand, minPrice, maxPrice, inStock, prescriptionRequired, sort, page, limit`

---

## 13. MongoDB data model

Collections: users, addresses, products, categories, brands, manufacturers, inventoryBatches, carts, wishlists, orders, prescriptions, prescriptionFiles, reviews, coupons, promotions, payments, deliveryZones, blogPosts, banners, contactInquiries, newsletterSubscribers, storeSettings, notifications, auditLogs.

Product cost price is admin-only. Expired batches are not sellable.

---

## 14. Redux architecture

Slices: `auth`, `cart`, `wishlist`, `checkout`, `ui`, `dataSource`, `recentlyViewed`.  
RTK Query apis injected into `baseApi`. Local UI state stays in components.

---

## 15. Search architecture

API mode: MongoDB text + indexed fields (name, generic, salt, brand, sku, barcode, tags).  
Local mode: `searchLocalProducts()` with synonym/spelling map.  
Same suggestion UI: products, categories, brands, recent, popular.

---

## 16. Prescription workflow

Statuses: received → under_review → needs_clarification | approved | unavailable | ready_for_order → completed.

Demo: client-side validation only; no upload; no localStorage of files.  
Production: private storage, authz (pharmacist/admin), no public URLs.

---

## 17. Checkout / order workflow

Guest or account. Backend recomputes totals. Rx/controlled items cannot complete without prescription linkage. Payments: COD, pickup, bank transfer, JazzCash, Easypaisa (provider adapter; secrets server-only). Demo checkout is labelled and not persisted to a real server.

---

## 18. Admin architecture

Role-gated `/admin`. Metrics from API or demo dashboard. Mutations in api mode hit backend; in local mode they are clearly non-persistent.

---

## 19–20. SEO & local SEO

See keyword map in `frontend/src/seo/keywordMap.ts`.  
Prerender public HTML. Unique titles/H1s. Canonical without facet params. JSON-LD only with verified facts. NAP from `storeSettings` only.

---

## 21–25. Security, a11y, performance, responsive, testing

Documented in code: Helmet/CORS/rate-limit/Zod; WCAG 2.2 AA; route splitting; mobile-first nav; Vitest + Playwright + API tests for local/api/auto modes.

---

## 26. Folder structure

`frontend/` Vite app · `backend/` Express app · `shared/` types & constants · `docs/` this file.

---

## 27. Development phases

Follow the master prompt Phases 3–23. Frontend must run with `npm run dev` in `frontend/` with no backend.

---

## 28. Production-readiness checklist

- [ ] Real NAP replaces placeholders  
- [ ] `VITE_DATA_SOURCE=api` in production  
- [ ] Demo mode off  
- [ ] Secrets only in server env  
- [ ] Sitemap submitted  
- [ ] Staging `noindex`  
- [ ] Prescription storage private  
- [ ] Payment webhooks verified  
- [ ] Accessibility pass  
- [ ] Load test search + checkout  
