const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const login = typeof body.login === "string" ? body.login.trim() : "";
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";
    const password = body.password;
    const fields = {};
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(login))
      fields.login = "Login: 3–30 liter, cyfr lub znaków . _ -";
    if (!firstName || [...firstName].length > 50)
      fields.firstName = "Imię: od 1 do 50 znaków";
    if (!lastName || [...lastName].length > 50)
      fields.lastName = "Nazwisko: od 1 do 50 znaków";
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    )
      fields.password = "Hasło: minimum 8 znaków, maksymalnie 72 bajty";
    if (Object.keys(fields).length)
      return res.status(400).json({ error: "Popraw zaznaczone pola", fields });

    const [exists] = await pool.query("SELECT id FROM users WHERE login = ?", [
      login,
    ]);

    if (exists.length > 0) {
      return res.status(409).json({
        error: "Ten login jest już zajęty",
        fields: { login: "Ten login jest już zajęty" },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (login, passwordHash, firstName, lastName, role) VALUES (?, ?, ?, ?, 'viewer')",
      [login, passwordHash, firstName, lastName],
    );

    req.session.userId = result.insertId;

    res.status(201).json({
      id: result.insertId,
      login,
      firstName,
      lastName,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({
        error: "Ten login jest już zajęty",
        fields: { login: "Ten login jest już zajęty" },
      });
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { login, password } = req.body ?? {};
    if (
      typeof login !== "string" ||
      !login.trim() ||
      login.length > 30 ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({ error: "Podaj login i hasło" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE login = ?", [
      login,
    ]);

    const user = rows[0];

    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({
        error: "Nieprawidłowy login lub hasło",
      });
    }

    req.session.userId = user.id;

    res.json({
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.status(204).end());
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, login, firstName, lastName, role FROM users WHERE id = ?",
      [req.session.userId],
    );

    if (!rows[0]) {
      return res.status(404).json({
        error: "Nie znaleziono użytkownika",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
