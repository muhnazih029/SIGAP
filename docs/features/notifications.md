# Feature: Notifications

**Status:** ready
**Related:** [API](../specs/api.md#notifications), [Dashboard](./admin-dashboard.md), [Ticket Check](./ticket-check.md)

## Story

As Guru BK, I know immediately when a new report arrives without refreshing all day.
As a student, I see a clear status change when I re-check my ticket.

## Scope (200k budget, MVP-fast)

No WA gateway, no email SMTP, no FCM. Two channels only:

### A. Admin — in-app badge + polling (ship first, 30 min)

- Dashboard header shows `Diterima` count badge (unread = `status='Diterima'`).
- `GET /admin/unread-count` returns `{ count }`, polled every 15s via fetch. No WebSocket (overkill for 1 admin + STB).
- Opening detail (`GET /admin/:ticket`) implicitly marks as seen — no separate `read` table in MVP. Count drops when status moves to `Diverifikasi+`.
- Optional sound beep on count increase (1-line JS, toggleable).

### B. Admin — Telegram push (ship second, 20 min, free)

- Outbound only, works behind NAT/STB with no public IP.
- Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Empty = silently skipped (demo still passes).
- On `POST /lapor` success → fire-and-forget `sendMessage`: `🚨 Laporan baru BLY-XXXX — Kategori: Fisik — Lokasi: ...`.
- Failure to send never fails the report submit (try/catch + log).

### C. Student — passive timeline (no push, anonymous by design)

- No contact stored, so no proactive push possible without breaking anonymity.
- `/cek?ticket=` renders status timeline: Diterima → Diverifikasi → Diproses → Selesai with current step highlighted + `urgensi` badge.
- If client later wants proactive student notif: add optional `kontak_wa` field (nullable, never required). Explicitly out of MVP.

## Acceptance

- [ ] New report → `/admin/unread-count` increments within 15s without reload.
- [ ] Telegram env empty → submit still 201, no crash.
- [ ] Telegram env set → Guru BK phone receives message <10s after submit.
- [ ] Student re-checks ticket after admin updates status → timeline shows new step.
