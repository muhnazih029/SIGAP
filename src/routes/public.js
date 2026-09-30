import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import crypto from 'node:crypto';
import pool from '../db.js';
import { generateTicket } from '../ticket.js';
import { saveEvidence } from '../storage.js';
import { notifyAdminNewReport } from '../notify.js';
import { laporLimiter, cekLimiter } from '../middleware/limits.js';
import { asyncHandler } from '../middleware/async.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Tipe file ditolak. Gunakan JPG, PNG, atau WebP.'));
  },
});

const laporSchema = z.object({
  kategori: z.enum(['Fisik', 'Verbal', 'Sosial', 'Cyber']),
  kronologi: z.string().trim().min(20, 'Kronologi minimal 20 karakter.'),
  waktu_kejadian: z.string().min(1, 'Waktu kejadian wajib diisi.'),
  lokasi: z.string().trim().min(3, 'Lokasi wajib diisi.'),
  website: z.string().max(0).optional(), // honeypot
});

const recentHash = new Map(); // kronologi hash -> timestamp (duplicate guard, in-memory MVP)

router.get('/', (req, res) => res.render('form', { error: null, old: {} }));

router.post('/lapor', laporLimiter, upload.single('bukti'), async (req, res) => {
  try {
    const parsed = laporSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).render('form', { error: parsed.error.issues[0].message, old: req.body });
    }
    if (parsed.data.website) {
      // honeypot filled: fake success, no insert
      return res.redirect('/sukses?ticket=BLY-0000-XXXX');
    }

    const hash = crypto.createHash('sha256').update(parsed.data.kronologi).digest('hex');
    const last = recentHash.get(hash);
    if (last && Date.now() - last < 5 * 60 * 1000) {
      return res.status(429).render('form', { error: 'Laporan serupa baru saja dikirim.', old: req.body });
    }
    recentHash.set(hash, Date.now());

    const ticket = await generateTicket();
    let buktiUrl = null;
    if (req.file) {
      buktiUrl = await saveEvidence(req.file.buffer, ticket);
    }

    await pool.query(
      `INSERT INTO reports (ticket_code, kategori, kronologi, waktu_kejadian, lokasi, bukti_url)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [ticket, parsed.data.kategori, parsed.data.kronologi, parsed.data.waktu_kejadian, parsed.data.lokasi, buktiUrl]
    );

    notifyAdminNewReport({ ticket, kategori: parsed.data.kategori, lokasi: parsed.data.lokasi });
    res.redirect(`/sukses?ticket=${ticket}`);
  } catch (err) {
    if (err.message?.includes('File too large') || err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).render('form', { error: 'Foto terlalu besar, maksimal 2MB.', old: req.body });
    }
    return res.status(400).render('form', { error: err.message || 'Gagal mengirim laporan.', old: req.body });
  }
});

router.get('/sukses', (req, res) => res.render('sukses', { ticket: req.query.ticket || '-' }));

router.get('/cek', cekLimiter, asyncHandler(async (req, res) => {
  const raw = String(req.query.ticket || '').trim().toUpperCase();
  if (!raw) return res.render('cek', { result: null, error: null, ticket: '' });
  try {
    const { rows } = await pool.query(
      'SELECT ticket_code, kategori, status, urgensi, waktu_kejadian, LEFT(kronologi, 200) AS ringkasan FROM reports WHERE ticket_code = $1',
      [raw]
    );
    if (!rows.length) return res.status(404).render('cek', { result: null, error: 'Tiket tidak ditemukan.', ticket: raw });
    res.render('cek', { result: rows[0], error: null, ticket: raw });
  } catch {
    res.status(500).render('cek', { result: null, error: 'Database tidak tersedia. Coba lagi nanti.', ticket: raw });
  }
}));

export default router;
