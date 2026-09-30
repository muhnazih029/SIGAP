# Feature: Evidence Upload

**Status:** ready
**Related:** [Security](../specs/security.md), [Deploy](../ops/deploy.md)

## Story

As a reporter, I attach one photo as evidence. As an operator (STB), I don't run out of disk.

## Phase 1 (MVP, ship this)

Local disk: `public/uploads/<ticket>.jpg`. Served read-only via Express static. Multer memory → validate → write file. Max 2MB, jpg/png/webp.

Client compresses first (Canvas → max 1600px, JPEG 0.8, <1MB typical) so the 2MB server limit rarely triggers. Server limit is a hard backstop, not the primary UX.

Why local first: zero external dependency, works on STB offline LAN demo.

## Malware stance (no ClamAV in MVP)

Multer alone does NOT scan viruses. Full AV (ClamAV container) is overkill for STB RAM + 3-day deadline. MVP standard for image upload (2026 baseline):

1. Allowlist mimetype + extension, reject SVG (XSS vector).
2. Magic-bytes check (`file-type` lib): `.exe` renamed to `.jpg` fails here.
3. Re-encode via `sharp` → strips embedded payloads / polyglots, outputs clean JPEG.
4. Store with ticket-based filename (never user filename), no exec bit, serve with `X-Content-Type-Options: nosniff`.

This blocks 99% of image-borne attacks without AV daemon. ClamAV is Phase 3 if school IT demands it.

## Phase 2 (hybrid, after MVP passes)

Same interface `saveEvidence(buffer, ticket)` switches to Supabase Storage bucket `bukti` via `SUPABASE_URL/KEY`. DB `bukti_url` stores public URL instead of `/uploads/...`. No route change.

Abstraction:

```js
// src/storage.js
export async function saveEvidence(file, ticketCode) // returns URL string
```

## Acceptance

- [ ] 5MB file → rejected before save, 400.
- [ ] `.exe` renamed to `.jpg` → rejected by magic-bytes check.
- [ ] Uploaded image is re-encoded (stored file differs in bytes from upload, no EXIF payload).
- [ ] Phase 2: setting `SUPABASE_URL` flips storage without code change in routes.
