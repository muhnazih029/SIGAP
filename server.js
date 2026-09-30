import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import path from 'node:path';
import 'dotenv/config';
import publicRoutes from './src/routes/public.js';
import adminRoutes from './src/routes/admin.js';
import { ensureUploadDir } from './src/storage.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Fail fast: a public fallback secret would let anyone forge session cookies.
if (isProd && !process.env.SESSION_SECRET) {
  console.error('[sigap] SESSION_SECRET is required in production. Refusing to boot.');
  process.exit(1);
}
if (!process.env.SESSION_SECRET) {
  console.warn('[sigap] WARNING: using dev-only session secret. Set SESSION_SECRET.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(helmet({ contentSecurityPolicy: false })); // CSP off for Tailwind CDN simplicity (MVP)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000,
    },
  })
);

// Expose login state to all views: navbar shows "Admin" text when logged out,
// avatar menu when logged in.
app.use((req, res, next) => {
  res.locals.admin = req.session?.admin || null;
  next();
});

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => res.status(404).send('Halaman tidak ditemukan.'));

// Central error handler. Multer errors fire BEFORE the route handler, so the
// try/catch in POST /lapor never sees them — without this, an oversized file
// returns a 500 stack trace instead of a friendly 400.
app.use((err, req, res, next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    if (req.path === '/lapor') return res.status(400).render('form', { error: 'Foto terlalu besar, maksimal 2MB.', old: req.body || {} });
    return res.status(400).json({ error: 'File terlalu besar, maksimal 2MB.' });
  }
  if (err?.message?.startsWith('Tipe file ditolak')) {
    if (req.path === '/lapor') return res.status(400).render('form', { error: err.message, old: req.body || {} });
    return res.status(400).json({ error: err.message });
  }
  console.error('[sigap] unhandled:', err?.message);
  if (res.headersSent) return next(err);
  res.status(500).send('Terjadi kesalahan. Coba lagi nanti.'); // never leak stack to client
});

await ensureUploadDir();
app.listen(PORT, () => console.log(`[sigap] http://localhost:${PORT} (ticket_mode=${process.env.TICKET_MODE || 'secure'})`));
