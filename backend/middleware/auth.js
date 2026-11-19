function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Zaloguj się, aby kontynuować",
    });
  }

  next();
}

async function requireAdmin(req, res, next) {
  if (!req.session?.userId)
    return res.status(401).json({ error: "Zaloguj się, aby kontynuować" });
  try {
    const pool = require("../db");
    const [users] = await pool.execute("SELECT role FROM users WHERE id = ?", [
      req.session.userId,
    ]);
    if (users[0]?.role !== "admin")
      return res
        .status(403)
        .json({ error: "Ta funkcja jest dostępna tylko dla administratora" });
    next();
  } catch (error) {
    next(error);
  }
}
async function requireEditor(req, res, next) {
  if (!req.session?.userId)
    return res.status(401).json({ error: "Zaloguj się, aby kontynuować" });
  try {
    const pool = require("../db");
    const [users] = await pool.execute("SELECT role FROM users WHERE id = ?", [
      req.session.userId,
    ]);
    if (!["editor", "admin"].includes(users[0]?.role))
      return res
        .status(403)
        .json({ error: "Twoje konto ma dostęp tylko do podglądu" });
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = { requireAuth, requireAdmin, requireEditor };
