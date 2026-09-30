import bcrypt from 'bcryptjs';
import pool from '../src/db.js';

// Usage: ADMIN_USER=gurubk ADMIN_PASS=REDACTED node sql/seed_admin.js
const username = process.env.ADMIN_USER || 'gurubk';
const password = process.env.ADMIN_PASS || 'REDACTED';

const hash = await bcrypt.hash(password, 12);
await pool.query(
  `INSERT INTO admins (username, password_hash) VALUES ($1, $2)
   ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  [username, hash]
);
console.log(`[seed] admin '${username}' ready`);
process.exit(0);
