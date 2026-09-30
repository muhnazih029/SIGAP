# Deploy (Hybrid: STB + Supabase Storage)

## Topology

```
Public --(Cloudflare Tunnel)--> Caddy/Nginx :3000 --> Node (Express+EJS)
                                                        ├─ Postgres :5432 (Docker)
                                                        └─ images → local /uploads (P1) → Supabase bucket `bukti` (P2)
```

STB runs App + DB. Only images offload in Phase 2 so eMMC doesn't fill.

## STB quickstart

```bash
cp .env.example .env   # set DATABASE_URL + SESSION_SECRET
docker compose up -d --build
docker compose exec db psql -U sigap -d sigap -f /app/sql/schema.sql
```

Expose: `cloudflared tunnel --url http://localhost:3000` for demo without public IP.

## Vercel fallback (if STB dies before demo)

Same code, set `DATABASE_URL` to Supabase Postgres + `SUPABASE_URL/KEY` for storage. `vercel --prod`. Keep as backup, not primary.
