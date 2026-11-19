const mysql = require("mysql2/promise");
let pool;
function getAdminPool() {
  if (!process.env.ADMIN_DB_USER || !process.env.ADMIN_DB_PASSWORD) return null;
  if (!pool)
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8mb4",
      dateStrings: true,
    });
  return pool;
}
module.exports = { getAdminPool };
