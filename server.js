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

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(helmet({ contentSecurityPolicy: false })); // CSP off for Tailwind CDN simplicity (MVP)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'REDACTED',
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

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => res.status(404).send('Halaman tidak ditemukan.'));

await ensureUploadDir();
app.listen(PORT, () => console.log(`[sigap] http://localhost:${PORT} (ticket_mode=${process.env.TICKET_MODE || 'secure'})`));
