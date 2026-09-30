# Feature: Admin Dashboard

**Status:** ready
**Routes:** `GET /admin?status=`, `GET /admin/:ticket`, `PATCH /admin/:ticket`
**Related:** [API](../specs/api.md#admin-dashboard)

## Story

As Guru BK, I filter reports by status, open detail, set urgency and advance status.

## Flow

1. `GET /admin` lists newest first, filter chips: Semua, Diterima, Diverifikasi, Diproses, Selesai.
2. Click row → `GET /admin/:ticket` detail with evidence image + form (status select, urgensi select).
3. `PATCH /admin/:ticket` updates. Allowed transitions: any → any (MVP simple, lecturer can demo freely).

## Validation

- `status` enum: Diterima, Diverifikasi, Diproses, Selesai.
- `urgensi` enum: Ringan, Sedang, Berat (nullable on create, required before Selesai — enforce in UI + Zod).
- All admin routes behind `isAdmin` + CSRF-less (SameSite cookie + same-origin EJS form is enough for MVP).

## Acceptance

- [ ] `?status=Diproses` shows only Diproses.
- [ ] Update status → reflected on `/cek?ticket=` immediately.
- [ ] Invalid status value → 400.
