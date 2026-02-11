'use strict';

// Middleware untuk memastikan user sudah login sebelum mengakses route tertentu
function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Middleware untuk membatasi akses berdasarkan role user (admin/petugas/owner)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }
    const role = req.session.user.role;
    if (!allowedRoles.includes(role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
}

module.exports = {
  requireLogin,
  requireRole,
};
