import bcrypt from 'bcryptjs';
import pool from '../src/db.js';

// Usage: ADMIN_USER=gurubk ADMIN_PASS=<min-8-chars> node sql/seed_admin.js
// No defaults on purpose: this file is public on GitHub, a fallback password
// would be a publicly known admin credential.
const username = process.env.ADMIN_USER;
const password = process.env.ADMIN_PASS;

if (!username || !password) {
  console.error('[seed] ADMIN_USER and ADMIN_PASS env are required. Refusing to use defaults.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('[seed] ADMIN_PASS must be at least 8 characters.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
await pool.query(
  `INSERT INTO admins (username, password_hash) VALUES ($1, $2)
   ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  [username, hash]
);
console.log(`[seed] admin '${username}' ready`);
process.exit(0);
