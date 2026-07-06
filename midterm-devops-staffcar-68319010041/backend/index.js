// index.js
// Express API สำหรับระบบบันทึกข้อมูลรถของบุคลากร (staffcar)
// ผู้จัดทำ: ศุภกรณ์ ศรีเขียว รหัสนักศึกษา 68319010041

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool, initDb } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const VERSION = "1.0.0";

// ---------- Health check ----------
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: VERSION });
});

// ---------- CRUD: /api/cars ----------

// GET /api/cars - ดูรายการทั้งหมด
app.get("/api/cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลรถได้", detail: err.message });
  }
});

// GET /api/cars/:id - ดูรายละเอียดตาม id
app.get("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรถ" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลรถได้", detail: err.message });
  }
});

// ฟังก์ชันตรวจสอบข้อมูลก่อนบันทึก (แยกออกมาเพื่อให้ทดสอบ unit test ได้ง่าย)
function validateCarPayload(body) {
  const errors = [];
  if (!body.plate_no || typeof body.plate_no !== "string") {
    errors.push("plate_no is required");
  }
  if (!body.type || typeof body.type !== "string") {
    errors.push("type is required");
  }
  if (!body.owner || typeof body.owner !== "string") {
    errors.push("owner is required");
  }
  return errors;
}

// POST /api/cars - เพิ่มข้อมูลรถใหม่
app.post("/api/cars", async (req, res) => {
  const errors = validateCarPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน", details: errors });
  }
  const {
    plate_no,
    type,
    brand_model = null,
    color = null,
    owner,
    department = null,
    status = "รออก",
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cars (plate_no, type, brand_model, color, owner, department, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [plate_no, type, brand_model, color, owner, department, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูลรถได้", detail: err.message });
  }
});

// PUT /api/cars/:id - แก้ไขข้อมูลรถ
app.put("/api/cars/:id", async (req, res) => {
  const { id } = req.params;
  const errors = validateCarPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน", details: errors });
  }
  const { plate_no, type, brand_model = null, color = null, owner, department = null, status = "รออก" } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cars SET plate_no=$1, type=$2, brand_model=$3, color=$4,
       owner=$5, department=$6, status=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [plate_no, type, brand_model, color, owner, department, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรถ" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถแก้ไขข้อมูลรถได้", detail: err.message });
  }
});

// DELETE /api/cars/:id - ลบข้อมูลรถ
app.delete("/api/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM cars WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรถ" });
    }
    res.json({ message: "ลบข้อมูลสำเร็จ", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถลบข้อมูลรถได้", detail: err.message });
  }
});

module.exports = { app, validateCarPayload };

// เริ่มเซิร์ฟเวอร์เฉพาะตอนรันไฟล์นี้โดยตรง (ไม่ใช่ตอนถูก require ใน test)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`staffcar API listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("ไม่สามารถเชื่อมต่อฐานข้อมูลเริ่มต้นได้:", err.message);
      process.exit(1);
    });
}
