// db.js
// เชื่อมต่อฐานข้อมูล PostgreSQL ผ่าน connection pool
// ค่าเชื่อมต่อทั้งหมดอ่านจาก Environment Variables เท่านั้น (ห้าม hardcode รหัสผ่านในโค้ด)

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

// สร้างตาราง cars อัตโนมัติถ้ายังไม่มี (สำหรับความสะดวกตอนรันครั้งแรก)
async function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS cars (
      id SERIAL PRIMARY KEY,
      plate_no VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      brand_model VARCHAR(100),
      color VARCHAR(50),
      owner VARCHAR(100) NOT NULL,
      department VARCHAR(100),
      status VARCHAR(50) NOT NULL DEFAULT 'รออก',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
  await pool.query(createTableQuery);
}

module.exports = { pool, initDb };
