# Feature: Report Submission

**Status:** ready
**Route:** `GET /` (form), `POST /lapor`
**Related:** [API](../specs/api.md#post-lapor), [DB](../specs/db-schema.md), [Security](../specs/security.md)

## Story

As a student, I submit a bullying report anonymously and receive a ticket code I can check later.

## Fields

`kategori` (select: Fisik, Verbal, Sosial, Cyber), `kronologi` (textarea, min 20 chars), `waktu_kejadian` (datetime-local), `lokasi` (text), `bukti` (optional file).

## Flow

1. `GET /` renders EJS form.
2. `POST /lapor` validates with Zod, checks file via Multer filter.
3. Server generates ticket `BLY-XXXX-YYYY` (sequential + 4-char random suffix, see db-schema), inserts row with `status='Diterima'`.
4. Responds with success page showing ticket code (print-friendly).

Ticket is issued immediately with `Diterima` (received, not yet verified). Admin approval is a status transition `Diterima → Diverifikasi`, not a gate for ticket creation. Otherwise reporter has nothing to track.

## Anti-spam (one phone spamming)

- Rate limit: 10 submits / hour / IP (school WiFi shares IP, so don't set too low).
- Honeypot field `website` (hidden): if filled → silent 201 fake success, no DB insert.
- Frontend: disable submit button on first click + client compress image first.
- No CAPTCHA in MVP (adds friction). Phase 2 option: Cloudflare Turnstile if spam proven.
- Duplicate guard: same `kronologi` hash within 5 min → 429.

## Validation

- Zod: all fields required except file. Kronologi >= 20 chars.
- File: jpg/png/webp only, max 2MB server hard limit. Client compresses to <1MB first (Canvas resize, max 1600px, JPEG 0.8) so phone photos rarely hit the limit. If still >2MB → 400 "Foto terlalu besar, maksimal 2MB".

## Acceptance

- [ ] Empty kronologi → 400, form re-rendered with error.
- [ ] Valid submit → ticket `BLY-XXXX-YYYY` displayed, row in `reports` with `Diterima`.
- [ ] 11th submit in 1 hour from same IP → 429.
- [ ] Honeypot filled → fake success, no row inserted.
