# PRD: SIGAP — Sistem Informasi Gerakan Anti Penindasan

**Version:** 1.0-mvp (2026-09-29)
**Status:** ready
**Deadline:** 3 days
**Owner:** Backend / DB, solo dev

## 1. Vision

Anonymous school bullying reporting web app. Public can report without login and track status via ticket code. One admin role (Guru BK) verifies, sets urgency, and advances status.

Name rationale: `SIGAP` means responsive/alert in Indonesian. Easy to remember for class presentation.

## 2. Actors

| Actor | Access | Auth |
|-------|--------|------|
| Public (student / anonymous) | Submit report, check ticket status | None |
| Admin (Guru BK, single account) | Login, filter dashboard, update status + urgency | Session + bcrypt, seeded once |

No multi-role, no OAuth, no email. Out of scope for MVP.

## 3. MVP Scope (must ship)

1. Public report form: kategori, kronologi, waktu, lokasi, photo upload (1 file).
2. Auto ticket code: `BLY-XXXX-YYYY` default (secure, unguessable). One-env switch `TICKET_MODE=sequential` → plain `BLY-0001` if client insists. Shown once after submit + printable.
3. Ticket check: input ticket → status timeline + urgency (read-only, evidence hidden).
4. Admin login: username + password, session cookie, password change.
5. Admin dashboard: list + filter by status (`Diterima, Diverifikasi, Diproses, Selesai`), update status + urgensi (`Ringan, Sedang, Berat`).
6. Notifications: admin unread badge + 15s polling + Telegram push on new report; student sees timeline update on re-check (no push, anonymous).

## 4. Non-goals (explicitly excluded)

- React / SPA frontend. Server-rendered EJS is enough.
- Multi-admin roles, audit log table, WA gateway / email SMTP / FCM push.
- Optional student contact (`kontak_wa`) for proactive push — deferred, anonymity default.
- Image moderation / face blur. Manual review by Guru BK.
- Full Supabase migration. Hybrid only: images offloaded, DB stays local.

## 5. User flows

**Public:** Open `/` → fill form → receive ticket → check at `/cek?ticket=BLY-0001-K7Q9` (timeline updates on re-check).
**Admin:** `GET /admin/login` → session → `/admin` → badge shows new `Diterima` count (+ Telegram ping) → filter `?status=Diproses` → open detail → set status/urgency → save.

## 6. Success criteria (demo to lecturer)

- Submit with 2MB JPG succeeds and returns ticket in <3s on STB LAN.
- Wrong file type / >2MB rejected with clear Indonesian message.
- `/admin` without session redirects to login.
- Status change reflects immediately on ticket check page.
- New report increments admin badge + sends Telegram message (if configured).
