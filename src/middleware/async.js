// Express 4 has no async error catching: a rejected promise inside a route
// crashes the whole process (easiest DoS: restart Postgres mid-demo).
// Wrap every async handler so DB errors become 500 responses, not crashes.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
