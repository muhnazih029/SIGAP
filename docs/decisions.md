# Decisions (ADR-lite)

| ID | Decision | Why | Status |
|----|----------|-----|--------|
| D-01 | Express + EJS, no React | 3-day deadline, 1 repo, no CORS/build, easy to present | accepted |
| D-02 | Hybrid infra (STB App+DB, Supabase for images P2) | STB disk small, learn self-host without losing demo reliability | accepted |
| D-03 | Single admin (Guru BK) + password change, session+bcrypt | No RBAC table, fastest secure enough | accepted |
| D-04 | Ticket `BLY-XXXX-YYYY` default, `TICKET_MODE=sequential` → plain `BLY-0001` | Secure default, 1-env switch if client insists on plain | accepted |
| D-05 | Local upload P1, `saveEvidence()` abstraction for P2 | Ship offline-capable MVP, flip to cloud via env | accepted |
| D-06 | Client compress (Canvas) + server 2MB hard limit + sharp re-encode | UX smooth, STB disk safe, strips malware without ClamAV | accepted |
| D-07 | Multi-admin (super_admin) deferred | Wait client confirmation on account count | proposed |
| D-08 | Notif admin: badge + 15s polling + Telegram push; student: timeline on re-check | No WS/SMTP/WA gateway, free + NAT-friendly, anonymity kept | accepted |
