# Security Baseline (MVP 2026)

Minimum to claim "secure enough for class + LAN deploy". No auth bypass allowed.

1. **Headers:** `helmet()` default on.
2. **Rate limit:** `/lapor` 10/hour, `/admin/login` + `/admin/password` 5 failures/15min, `/cek` 60/min per IP.
3. **Validation:** Zod on every `POST/PATCH`. Reject unknown fields. Honeypot `website` must be empty.
4. **Upload:** Multer 2MB cap, allowlist `image/jpeg|png|webp` by mimetype + extension + magic bytes (`file-type`). Reject SVG. Re-encode via `sharp` to clean JPEG. Filename = ticket code, never user filename. No execute bit in `public/uploads`. Serve with `nosniff`.
5. **SQL:** `pg` parameterized queries only (`$1`). No string concat.
6. **Passwords:** bcrypt 12 rounds. Seed script only, no signup route. Change requires current password + session regenerate.
7. **Session:** httpOnly, SameSite=Lax, `secure` in prod, 2h expiry. Regenerate on login.
8. **Secrets:** `.env` never committed. `.env.example` is the contract.
9. **Error messages:** Indonesian generic messages. No stack trace to client in prod (`NODE_ENV=production`).
