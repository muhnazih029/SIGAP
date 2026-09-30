import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import pool from '../db.js';
import { isAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/async.js';
import { loginLimiter } from '../middleware/limits.js';

const router = Router();
const STATUS = ['Diterima', 'Diverifikasi', 'Diproses', 'Selesai'];
const URGENSI = ['Ringan', 'Sedang', 'Berat'];

router.get('/login', (req, res) => res.render('admin-login', { error: null }));

router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password || '', admin.password_hash))) {
    return res.status(401).render('admin-login', { error: 'Username atau password salah.' });
  }
  req.session.regenerate(() => {
    req.session.admin = { id: admin.id, username: admin.username };
    res.redirect('/admin');
  });
}));

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/password', isAdmin, (req, res) => res.render('admin-password', { error: null, ok: null }));

router.post('/password', isAdmin, loginLimiter, asyncHandler(async (req, res) => {
  const schema = z.object({ current: z.string().min(1), next: z.string().min(8, 'Password baru minimal 8 karakter.') });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).render('admin-password', { error: parsed.error.issues[0].message, ok: null });

  const { rows } = await pool.query('SELECT * FROM admins WHERE id = $1', [req.session.admin.id]);
  const ok = await bcrypt.compare(parsed.data.current, rows[0].password_hash);
  if (!ok) return res.status(401).render('admin-password', { error: 'Password lama salah.', ok: null });

  const hash = await bcrypt.hash(parsed.data.next, 12);
  await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, req.session.admin.id]);
  req.session.regenerate(() => res.render('admin-password', { error: null, ok: 'Password berhasil diganti.' }));
}));

router.get('/unread-count', isAdmin, asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM reports WHERE status = 'Diterima'`);
  res.json({ count: rows[0].count });
}));

router.get('/', isAdmin, asyncHandler(async (req, res) => {
  const status = STATUS.includes(req.query.status) ? req.query.status : null;
  const { rows } = await pool.query(
    status
      ? 'SELECT * FROM reports WHERE status = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM reports ORDER BY created_at DESC',
    status ? [status] : []
  );
  const unread = await pool.query(`SELECT COUNT(*)::int AS count FROM reports WHERE status = 'Diterima'`);
  res.render('dashboard', { reports: rows, filter: status || 'Semua', unread: unread.rows[0].count });
}));

router.get('/:ticket', isAdmin, asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM reports WHERE ticket_code = $1', [req.params.ticket.toUpperCase()]);
  if (!rows.length) return res.status(404).send('Tiket tidak ditemukan.');
  res.render('detail', { r: rows[0], statusList: STATUS, urgensiList: URGENSI });
}));

router.patch('/:ticket', isAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({ status: z.enum(STATUS).optional(), urgensi: z.enum(URGENSI).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Nilai status/urgensi tidak valid.' });

  const { rows } = await pool.query(
    'UPDATE reports SET status = COALESCE($2, status), urgensi = COALESCE($3, urgensi) WHERE ticket_code = $1 RETURNING *',
    [req.params.ticket.toUpperCase(), parsed.data.status ?? null, parsed.data.urgensi ?? null]
  );
  if (!rows.length) return res.status(404).json({ error: 'Tiket tidak ditemukan.' });
  res.json({ ok: true });
}));

export default router;
