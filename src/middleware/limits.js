import rateLimit from 'express-rate-limit';

export const laporLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak laporan dari perangkat ini. Coba lagi 1 jam lagi.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Terlalu banyak percobaan login. Coba lagi 15 menit lagi.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const cekLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Terlalu banyak cek tiket. Tunggu sebentar.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
