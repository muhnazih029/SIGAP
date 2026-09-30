# API Spec (MVP)

Base: same-origin EJS forms. JSON only for errors / future fetch. All timestamps ISO.

## `POST /lapor`

Multipart form. Fields: `kategori, kronologi, waktu_kejadian, lokasi, bukti?`.

- 201 → redirect `/sukses?ticket=BLY-0001` (render ticket).
- 400 `{ error: "Kronologi minimal 20 karakter" }` (Indonesian messages).
- 429 when rate-limited.

## `GET /cek?ticket=BLY-0001`

- 200 → render `cek.ejs` with `{ ticket_code, kategori, status, urgensi, waktu_kejadian }`.
- 404 → render not-found (no JSON leak).

## Admin Auth

- `POST /admin/login` `{ username, password }` → 302 `/admin` or 401 render with error.
- `POST /admin/logout` → destroy session, 302 `/`.

## Admin Dashboard

- `GET /admin?status=Diterima` → list `[{ ticket_code, kategori, status, urgensi, created_at }]`, newest first.
- `GET /admin/:ticket` → detail + `bukti_url`.
- `PATCH /admin/:ticket` `{ status?, urgensi? }` → 200 `{ ok: true }`, 400 on bad enum, 401 without session, 404 unknown ticket.

## Notifications

- `GET /admin/unread-count` → `{ count }` (rows with `status='Diterima'`). Auth required. Polled 15s.
- `POST /lapor` side effect → Telegram `sendMessage` if `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` set. Failure never fails submit.
