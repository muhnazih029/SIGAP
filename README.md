# SIGAP — Sistem Informasi Gerakan Anti Penindasan

Anonymous school bullying reporting web app (college assignment MVP).

Public: submit report (kategori, kronologi, waktu, lokasi, photo) → get ticket `BLY-XXXX` → check status at `/cek`.
Admin (Guru BK, single account): login → filter dashboard by status → set urgency + advance status.

## Stack

Express.js + EJS + PostgreSQL (STB Docker) + Supabase Storage for images (Phase 2). See [docs/](./docs/README.md).

## Quickstart

```bash
cp .env.example .env
npm install
# start postgres (STB / local)
docker compose up -d db
psql $DATABASE_URL -f sql/schema.sql
npm run dev
```

Open `http://localhost:3000`.

## Docs

- [PRD](./docs/PRD.md)
- [Features](./docs/features/README.md)
- [API](./docs/specs/api.md) · [DB](./docs/specs/db-schema.md) · [Security](./docs/specs/security.md)
- [Deploy](./docs/ops/deploy.md)

## Project status

MVP, 3-day deadline. Intentionally simple: no React, no multi-role.
