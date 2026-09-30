# Feature: Ticket Check

**Status:** ready
**Route:** `GET /cek?ticket=BLY-0001-K7Q9`
**Related:** [API](../specs/api.md#get-cek)

## Story

As a reporter, I check my report status using the ticket code without login.

## Anti-enumeration (sequential guessing)

Ticket format is `BLY-XXXX-YYYY` where `XXXX` is sequential (readable for lecturer) and `YYYY` is 4-char random (A-Z, 2-9, no ambiguous 0/O/1/I). Entropy ~1.6M combos per sequence number. Brute force is blocked by 60 req/min/IP rate limit.

No password/PIN in MVP — two codes to remember kills UX for students and adds 0.5 day (PIN hash column + reset flow). Accepted tradeoff: ticket itself is the secret.

## Flow

1. Public enters ticket at `/cek`.
2. Server normalizes input (trim, uppercase).
3. Lookup by exact `ticket_code`. Return kategori, status, urgensi (or `-` if unset), waktu + truncated kronologi (first 200 chars) + status timeline.
4. Unknown ticket → generic 404 "Tiket tidak ditemukan" with constant-time response (no timing leak).

Privacy: do not expose full kronologi, lokasi detail, or bukti_url to public. Evidence image is admin-only. No list/enumeration endpoint. Rate-limit 60/min/IP.

## Acceptance

- [ ] `BLY-0001-K7Q9` valid → shows `Diterima/Diverifikasi/Diproses/Selesai` + urgensi.
- [ ] Unknown ticket → 404 page "Tiket tidak ditemukan" (same render time, no leak).
- [ ] Lowercase `bly-0001-k7q9` still resolves.
- [ ] Public page never shows full lokasi or bukti image URL.
