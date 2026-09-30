# SIGAP Docs

Single source of truth for MVP. Keep it simple: if it's not in `features/`, it's out of scope.

## Map

- [PRD](./PRD.md) — vision, actors, MVP scope, non-goals.
- [Features](./features/README.md) — 1 file per feature, with acceptance checklist.
- Specs:
  - [API](./specs/api.md) — endpoint index + request/response shapes.
  - [DB Schema](./specs/db-schema.md) — tables, indexes, ticket format.
  - [Security](./specs/security.md) — minimum 2026 baseline for this project.
- Ops:
  - [Deploy](./ops/deploy.md) — STB (App + Postgres) + Supabase Storage for images.
  - [Env](./ops/env.md) — env vars mirror of `.env.example`.
- [Decisions](./decisions.md) — ADR-lite, one table + short rationale.

## Conventions

- Docs are in English (for GitHub). Code comments in English, user-facing UI in Indonesian.
- `features/` files are vertical slices: Story → Flow → Validation → Acceptance.
- `specs/api.md` defines shapes once. Feature files reference, never redefine.
- Status values: `draft` / `ready` / `done`.
