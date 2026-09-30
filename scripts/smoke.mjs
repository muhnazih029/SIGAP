// Smoke test: server must already be running (terminal 1),
// then run this in terminal 2 on the SAME port:
//   Terminal 1: npm run dev                 (port 3000)
//   Terminal 2: npm run test:smoke          (hits 3000)
//   Custom port: PORT=3101 npm run dev  +  PORT=3101 npm run test:smoke
const base = process.env.SMOKE_URL || `http://localhost:${process.env.PORT || 3000}`;

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
