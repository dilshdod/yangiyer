// db.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false },
});

export async function initDB() {
   await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

// ✅ B I T T A  user qo‘shish
export async function insertUser(user) {
  // user oddiy JS obyekt bo‘lishi kerak
  // masalan: { name: "Ali", phone: "99899...", password: "1234" }

  const result = await pool.query(
    `INSERT INTO users (data)
     VALUES ($1::jsonb)
     RETURNING id, data, created_at`,
    [JSON.stringify(user)]
  );

  return result.rows[0]; // qo‘shilgan user
}

// ✅ B A R C H A userlarni olish
export async function getAllUsers() {
  const result = await pool.query(
    `SELECT id, data, created_at
     FROM users
     ORDER BY id DESC`
  );

  return result.rows; // massiv qaytaradi
}

export default pool;

