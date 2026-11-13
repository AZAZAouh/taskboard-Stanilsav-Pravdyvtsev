const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, ownerId, createdAt FROM boards WHERE isDeleted = 0'
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { name: rawName, description = null } = req.body ?? {};
  const name = typeof rawName === 'string' ? rawName.trim() : '';

  if (name.length < 1 || name.length > 80) {
    return res.status(400).json({
      error: 'Nazwa musi mieć od 1 do 80 znaków'
    });
  }

  if (description !== null &&
      (typeof description !== 'string' || description.length > 255)) {
    return res.status(400).json({
      error: 'Opis może mieć maksymalnie 255 znaków'
    });
  }

  const ownerId = 1;

  try {
    const [result] = await pool.execute(
      'INSERT INTO boards (name, description, ownerId) VALUES (?, ?, ?)',
      [name, description, ownerId]
    );

    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Nieprawidłowe ID tablicy' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE boards SET isDeleted = 1, deletedAt = NOW() WHERE id = ? AND isDeleted = 0',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get('/:boardId/tasks', async (req, res, next) => {
  const boardId = Number(req.params.boardId);

  if (!Number.isSafeInteger(boardId) || boardId < 1) {
    return res.status(404).json({ error: 'Nie znaleziono tablicy' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT t.id, t.title, t.description, t.status, t.priority,
              t.deadline, t.boardId, t.assigneeId, t.createdAt
       FROM boards b
       LEFT JOIN tasks t ON t.boardId = b.id AND t.isDeleted = 0
       WHERE b.id = ? AND b.isDeleted = 0
       ORDER BY t.id`,
      [boardId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }

    res.json(rows[0].id === null ? [] : rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;