# Env Contract

Mirror of `.env.example`. Do not add vars without updating this file.

| Var | Required | Example |
|-----|----------|---------|
| PORT | no | 3000 |
| DATABASE_URL | yes | postgres://sigap:sigap@localhost:5432/sigap |
| SESSION_SECRET | yes | min 32 chars random |
| SUPABASE_URL | phase 2 only | https://xyz.supabase.co |
| SUPABASE_KEY | phase 2 only | service_role key (server only, never expose) |
| TICKET_MODE | no | `secure` (default, BLY-0001-K7Q9) or `sequential` (BLY-0001, client request) |
| TELEGRAM_BOT_TOKEN | no | from @BotFather, empty = notif skipped |
| TELEGRAM_CHAT_ID | no | Guru BK chat id, empty = notif skipped |
| NODE_ENV | no | production on STB/Vercel |
