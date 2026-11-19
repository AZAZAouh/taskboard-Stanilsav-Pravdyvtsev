const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const express = require("express");
const session = require("express-session");
const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/admin", requireAuth, require("./routes/admin"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", requireAuth, require("./routes/users"));
app.use("/api/boards", requireAuth, require("./routes/boards"));
app.use("/api/tasks", requireAuth, require("./routes/tasks"));

app.get("/", (req, res) => res.redirect("/login.html"));

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Błąd serwera" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, "127.0.0.1", () => {
  console.log(`Serwer: http://127.0.0.1:${port}`);
});
