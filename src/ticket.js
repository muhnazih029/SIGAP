// Ticket format: BLY-XXXX-YYYY (secure default) or BLY-XXXX (sequential, client request).
// Switch via TICKET_MODE env. No code change needed.
import pool from './db.js';

const SUFFIX_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I/L

export function randomSuffix(len = 4) {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += SUFFIX_ALPHABET[Math.floor(Math.random() * SUFFIX_ALPHABET.length)];
  }
  return out;
}

export async function generateTicket() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM reports');
  const seq = String(rows[0].n + 1).padStart(4, '0');
  if (process.env.TICKET_MODE === 'sequential') return `BLY-${seq}`;
  return `BLY-${seq}-${randomSuffix()}`;
}
