# DB Schema

Postgres 16. Same SQL runs on STB Docker and Supabase. Source: `sql/schema.sql`.

## `reports`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | `gen_random_uuid()` |
| ticket_code | text unique | `BLY-0001-K7Q9`: zero-padded sequence + 4-char random suffix |
| kategori | text | Fisik / Verbal / Sosial / Cyber |
| kronologi | text | min 20 chars (app-level) |
| waktu_kejadian | timestamptz | from form |
| lokasi | text | free text |
| bukti_url | text nullable | `/uploads/BLY-0001-K7Q9.jpg` (phase 1) or Supabase public URL (phase 2) |
| status | text | Diterima (default) / Diverifikasi / Diproses / Selesai |
| urgensi | text nullable | Ringan / Sedang / Berat |
| created_at | timestamptz | default now() |

Indexes: `ticket_code` unique, `status`, `created_at desc`.

## `admins`

`id uuid PK, username text unique, password_hash text (bcrypt)`.

## Ticket generation (MVP, readable + unguessable)

```js
// count+1 for XXXX, nanoid-ish 4 chars for YYYY (no 0/O/1/I)
ticket = `BLY-${String(count+1).padStart(4,'0')}-${randomSuffix(4)}`
// e.g. BLY-0012-K7Q9
```

Race-safe enough for class demo traffic. Documented limitation: switch to sequence if >10 req/s.
