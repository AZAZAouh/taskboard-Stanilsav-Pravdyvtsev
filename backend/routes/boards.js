const express = require("express");
const pool = require("../db");

const router = express.Router();
const { requireEditor } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, ownerId, createdAt FROM boards WHERE isDeleted = 0",
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireEditor, async (req, res, next) => {
  const { name: rawName, description = null } = req.body ?? {};
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if ([...name].length < 1 || [...name].length > 80) {
    return res.status(400).json({
      error: "Nazwa musi mieć od 1 do 80 znaków",
      fields: { name: "Nazwa musi mieć od 1 do 80 znaków" },
    });
  }

  if (
    description !== null &&
    (typeof description !== "string" || [...description].length > 255)
  ) {
    return res.status(400).json({
      error: "Opis może mieć maksymalnie 255 znaków",
      fields: { description: "Opis może mieć maksymalnie 255 znaków" },
    });
  }

  const ownerId = req.session.userId;

  try {
    const [result] = await pool.execute(
      "INSERT INTO boards (name, description, ownerId) VALUES (?, ?, ?)",
      [name, description || null, ownerId],
    );

    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireEditor, async (req, res, next) => {
  const id = Number(req.params.id);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const description = req.body?.description ?? null;
  if (!Number.isSafeInteger(id) || id < 1)
    return res.status(400).json({ error: "Nieprawidłowe ID tablicy" });
  const fields = {};
  if (!name || [...name].length > 80)
    fields.name = "Nazwa musi mieć od 1 do 80 znaków";
  if (
    description !== null &&
    (typeof description !== "string" || [...description].length > 255)
  )
    fields.description = "Opis może mieć maksymalnie 255 znaków";
  if (Object.keys(fields).length)
    return res.status(400).json({ error: "Popraw zaznaczone pola", fields });
  try {
    const [result] = await pool.execute(
      "UPDATE boards SET name = ?, description = ? WHERE id = ? AND isDeleted = 0",
      [name, description, id],
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: "Nie znaleziono tablicy" });
    res.json({ id, name, description });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireEditor, async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Nieprawidłowe ID tablicy" });
  }

  try {
    const [result] = await pool.execute(
      "UPDATE boards SET isDeleted = 1, deletedAt = NOW(), deletedById = ? WHERE id = ? AND isDeleted = 0",
      [req.session.userId, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Nie znaleziono tablicy" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/:boardId/trash", async (req, res, next) => {
  const id = Number(req.params.boardId);
  if (!Number.isSafeInteger(id) || id < 1)
    return res.status(400).json({ error: "Nieprawidłowe ID tablicy" });
  try {
    const [boards] = await pool.execute(
      "SELECT id FROM boards WHERE id = ? AND isDeleted = 0",
      [id],
    );
    if (!boards.length)
      return res.status(404).json({ error: "Nie znaleziono tablicy" });
    const [rows] = await pool.execute(
      "SELECT id, title, status, deletedAt, purgeRequestedAt FROM tasks WHERE boardId = ? AND isDeleted = 1 ORDER BY deletedAt DESC, id DESC",
      [id],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:boardId/tasks", async (req, res, next) => {
  const boardId = Number(req.params.boardId);

  if (!Number.isSafeInteger(boardId) || boardId < 1) {
    return res.status(404).json({ error: "Nie znaleziono tablicy" });
  }

  try {
    const [boards] = await pool.execute(
      "SELECT id FROM boards WHERE id = ? AND isDeleted = 0",
      [boardId],
    );
    if (!boards.length)
      return res.status(404).json({ error: "Nie znaleziono tablicy" });
    const { priority, assigneeId, q } = req.query;
    if (priority !== undefined && !["low", "medium", "high"].includes(priority))
      return res.status(400).json({ error: "Nieprawidłowy priorytet" });
    if (
      assigneeId !== undefined &&
      (!/^\d+$/.test(assigneeId) ||
        !Number.isSafeInteger(Number(assigneeId)) ||
        Number(assigneeId) < 1)
    )
      return res.status(400).json({ error: "Nieprawidłowa osoba" });
    if (q !== undefined && typeof q !== "string")
      return res.status(400).json({ error: "Nieprawidłowe wyszukiwanie" });
    let sql =
      "SELECT id, title, description, status, priority, deadline, boardId, assigneeId, createdAt FROM tasks WHERE boardId = ? AND isDeleted = 0";
    const params = [boardId];
    if (priority) {
      sql += " AND priority = ?";
      params.push(priority);
    }
    if (assigneeId) {
      sql += " AND assigneeId = ?";
      params.push(Number(assigneeId));
    }
    if (q) {
      sql += " AND title LIKE ?";
      params.push(`%${q}%`);
    }
    sql += " ORDER BY id";
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
