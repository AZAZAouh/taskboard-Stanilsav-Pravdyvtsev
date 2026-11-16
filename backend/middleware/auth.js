function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Zaloguj się, aby kontynuować'
    });
  }

  next();
}

module.exports = { requireAuth };