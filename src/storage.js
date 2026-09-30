// Phase 1: local disk. Phase 2: same function uploads to Supabase, no route change.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function saveEvidence(buffer, ticketCode) {
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !ALLOWED_MIME.has(type.mime)) {
    throw new Error('Tipe file ditolak. Gunakan JPG, PNG, atau WebP.');
  }

  // Re-encode to clean JPEG: strips EXIF payloads / polyglots.
  const safeName = `${ticketCode}.jpg`;
  const outPath = path.join(process.cwd(), 'public', 'uploads', safeName);
  await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(outPath);

  // Phase 2: if Supabase env set, upload here and return public URL instead.
  // if (process.env.SUPABASE_URL) { ... return publicUrl; }

  return `/uploads/${safeName}`;
}

export async function ensureUploadDir() {
  await fs.mkdir(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
}
