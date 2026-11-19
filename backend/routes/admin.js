const express = require("express");
const pool = require("../db");
const { requireAdmin } = require("../middleware/auth");
const router = express.Router();
router.use(requireAdmin);
router.get("/deletion-requests", async (req, res, next) => {
  try {
    const [rows] =
      await pool.execute(`SELECT t.id, t.title, t.purgeRequestedAt, b.name AS boardName, u.login AS requestedBy
      FROM tasks t JOIN boards b ON b.id = t.boardId LEFT JOIN users u ON u.id = t.purgeRequestedById
      WHERE t.isDeleted = 1 AND b.isDeleted = 0 AND t.purgeRequestedAt IS NOT NULL ORDER BY t.purgeRequestedAt, t.id`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});
router.post("/deletion-requests/:id/reject", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1)
    return res.status(400).json({ error: "Nieprawidłowe ID zadania" });
  try {
    const [result] = await pool.execute(
      `UPDATE tasks t JOIN boards b ON b.id = t.boardId
      SET t.purgeRequestedAt = NULL, t.purgeRequestedById = NULL
      WHERE t.id = ? AND t.isDeleted = 1 AND b.isDeleted = 0 AND t.purgeRequestedAt IS NOT NULL`,
      [id],
    );
    if (!result.affectedRows)
      return res
        .status(404)
        .json({ error: "Nie znaleziono oczekującego zgłoszenia" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
