// Redirect GET to login, 401 for mutating methods. Single admin, no roles.
export function isAdmin(req, res, next) {
  if (req.session?.admin) return next();
  if (req.method === 'GET') return res.redirect('/admin/login');
  return res.status(401).json({ error: 'Unauthorized' });
}
