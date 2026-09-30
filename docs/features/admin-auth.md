# Feature: Admin Auth (Single Guru BK + Password Change)

**Status:** ready
**Routes:** `GET /admin/login`, `POST /admin/login`, `POST /admin/logout`, `GET /admin/password`, `POST /admin/password`
**Related:** [API](../specs/api.md#admin-auth), [Security](../specs/security.md)

## Story

As Guru BK, I log in with username + password. I can change my password securely. No registration page.

## Design

- One seeded admin via `sql/seed_admin.js` (bcrypt hash, 12 rounds). No signup route.
- `express-session`: httpOnly, SameSite=Lax, `secure=true` in prod, 2h maxAge.
- Middleware `isAdmin` redirects `GET` to `/admin/login`, returns 401 for `POST/PATCH`.
- Password change: requires current password + new password min 8 chars, bcrypt compare, regenerate session after change, rate-limited 5 attempts/15min.

## Multi-admin note (pending client confirmation)

Current contract: 1 admin. If client (school) asks for Kepala Sekolah view-only or multiple Guru BK, extend with `role` column (`super_admin`, `admin`) + `POST /admin/users` (super only). Cost +0.5 day. Do NOT build until client confirms — ask: "Berapa akun? Siapa saja? Perlu view-only?"

## Acceptance

- [ ] Correct credentials → redirect `/admin`, cookie `connect.sid` httpOnly.
- [ ] `GET /admin` without cookie → 302 to login.
- [ ] 5 failed logins / 15 min / IP → 429.
- [ ] Password change with wrong current password → 401, hash unchanged.
