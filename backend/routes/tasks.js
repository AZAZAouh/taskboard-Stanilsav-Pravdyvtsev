const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(404).json({ error: 'Nie znaleziono zadania' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT t.id, t.title, t.description, t.status, t.priority,
              t.deadline, t.boardId, t.assigneeId, t.createdAt
       FROM tasks t
       JOIN boards b ON b.id = t.boardId
       WHERE t.id = ? AND t.isDeleted = 0 AND b.isDeleted = 0`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0 && id <= 4294967295;
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return Number(value.slice(0, 4)) >= 1000 &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

async function validateTask(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const { description = null, status = 'todo', priority } = body;
  const deadline = body.deadline == null || body.deadline === '' ? null : body.deadline;
  const assigneeId = body.assigneeId == null || body.assigneeId === '' ? null : body.assigneeId;

  if ([...title].length < 3 || [...title].length > 100) {
    return { error: 'Tytuł musi mieć od 3 do 100 znaków' };
  }

  if (description !== null && typeof description !== 'string') {
    return { error: 'Opis musi być tekstem' };
  }

  if (!STATUSES.includes(status)) {
    return { error: 'Nieprawidłowy status' };
  }

  if (!PRIORITIES.includes(priority)) {
    return { error: 'Nieprawidłowy priorytet' };
  }

  if (deadline !== null && !isValidDate(deadline)) {
    return { error: 'Termin musi być datą w formacie RRRR-MM-DD' };
  }

  if (assigneeId !== null) {
    if (!isValidId(assigneeId)) {
      return { error: 'Nieprawidłowe ID użytkownika' };
    }

    const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [assigneeId]);
    if (users.length === 0) {
      return { error: 'Wybrany użytkownik nie istnieje' };
    }
  }

  return { task: { title, description, status, priority, deadline, assigneeId } };
}

router.post('/', async (req, res, next) => {
  const body = req.body ?? {};
  const { boardId } = body;

  if (!isValidId(boardId)) {
    return res.status(400).json({ error: 'Nieprawidłowe ID tablicy' });
  }

  try {
    const { task, error } = await validateTask(body);
    if (error) return res.status(400).json({ error });

    const { title, description, status, priority, deadline, assigneeId } = task;
    const [result] = await pool.execute(
      `INSERT INTO tasks (title, description, status, priority, deadline, assigneeId, boardId)
       SELECT ?, ?, ?, ?, ?, ?, id FROM boards WHERE id = ? AND isDeleted = 0`,
      [title, description, status, priority, deadline, assigneeId, boardId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Wybrana tablica nie istnieje' });
    }

    return res.status(201).json({ id: result.insertId, boardId, ...task });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Nieprawidłowe ID zadania' });
  }

  try {
    const { task, error } = await validateTask(req.body ?? {});
    if (error) return res.status(400).json({ error });

    const { title, description, status, priority, deadline, assigneeId } = task;
    const [result] = await pool.execute(
      `UPDATE tasks t JOIN boards b ON b.id = t.boardId
       SET t.title = ?, t.description = ?, t.status = ?, t.priority = ?,
           t.deadline = ?, t.assigneeId = ?
       WHERE t.id = ? AND t.isDeleted = 0 AND b.isDeleted = 0`,
      [title, description, status, priority, deadline, assigneeId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }

    return res.json({ id, ...task });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(404).json({ error: 'Nie znaleziono zadania' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE tasks SET isDeleted = 1, deletedAt = NOW() WHERE id = ? AND isDeleted = 0',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;