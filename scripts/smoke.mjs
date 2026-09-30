// Smoke test: boots expectations without DB.
// Run: PORT=3101 node server.js &  npm run test:smoke
const base = process.env.SMOKE_URL || 'http://localhost:3101';

const checks = [
  ['GET /', '/'],
  ['GET /cek', '/cek'],
  ['GET /cek?ticket=NOPE', '/cek?ticket=BLY-0000-XXXX'],
  ['GET /admin/login', '/admin/login'],
  ['GET /admin (guard)', '/admin'],
  ['GET /manifest', '/manifest.webmanifest'],
];

let fail = 0;
for (const [name, path] of checks) {
  try {
    const res = await fetch(base + path, { redirect: 'manual' });
    // /cek?ticket needs DB: 404 = ticket not found (DB up), 500 = graceful DB-down (no crash). Both pass.
    const ok = path === '/admin' ? res.status === 302
      : path.startsWith('/cek?ticket') ? [404, 500].includes(res.status)
      : res.status < 500;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name} -> ${res.status}`);
    if (!ok) fail++;
  } catch (err) {
    console.log(`FAIL ${name} -> ${err.message}`);
    fail++;
  }
}
process.exit(fail ? 1 : 0);
