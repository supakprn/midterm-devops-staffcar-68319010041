# ระบบบันทึกข้อมูลรถของบุคลากร (staffcar)

**ชื่อ-นามสกุล:** ศุภกรณ์ ศรีเขียว
**รหัสนักศึกษา:** 68319010041
**รหัสโปรเจกต์:** `staffcar`

![CI](https://github.com/<github-username>/midterm-devops-staffcar-68319010041/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> ระบบบันทึกข้อมูลรถของบุคลากรวิทยาลัยเทคนิคเลย สำหรับเข้า-ออกวิทยาลัยต้องมีสติกเกอร์เท่านั้น
> รองรับการบันทึก ทะเบียนรถ, ประเภท, ยี่ห้อ/รุ่น/สี, เจ้าของ/แผนก และสถานะสติกเกอร์

---

## 📦 โครงสร้างโปรเจกต์

```
midterm-devops-staffcar-68319010041/
├── backend/          # REST API (Node.js + Express + PostgreSQL)
├── frontend/         # หน้าเว็บ CRUD (HTML + Vanilla JS)
├── docker-compose.yml       # สำหรับ dev (build เอง)
├── docker-compose.prod.yml  # สำหรับ prod (pull image จาก Docker Hub)
└── .github/workflows/ci.yml # CI Pipeline: lint -> test -> build
```

## 🚀 วิธีรันโปรเจกต์

### แบบ Development (build เอง)

```bash
# 1. คัดลอกไฟล์ env ตัวอย่าง แล้วแก้ค่าตามต้องการ
cp .env.example .env

# 2. สั่งรันทั้งระบบ (frontend + backend + db)
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- Health check: http://localhost:3000/health

### แบบ Production (pull image จาก Docker Hub)

```bash
# แก้ <dockerhub-username> ใน docker-compose.prod.yml ให้เป็นของจริงก่อน
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d
```

## 🗄️ Database

- ชื่อฐานข้อมูล: `staffcar`
- ตารางหลัก: `cars`

| Field | ชนิดข้อมูล | คำอธิบาย |
|---|---|---|
| id | SERIAL | Primary key |
| plate_no | VARCHAR | ทะเบียนรถ |
| type | VARCHAR | ประเภท (รถยนต์ / จักรยานยนต์) |
| brand_model | VARCHAR | ยี่ห้อ/รุ่น |
| color | VARCHAR | สี |
| owner | VARCHAR | ชื่อเจ้าของรถ |
| department | VARCHAR | แผนกที่สังกัด |
| status | VARCHAR | สถานะสติกเกอร์ (ออกแล้ว / รออก / หมดอายุ) |

## 🔌 API Endpoints

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| GET | `/health` | ตรวจสอบสถานะเซิร์ฟเวอร์ → `{ status, version }` |
| GET | `/api/cars` | ดึงรายการรถทั้งหมด |
| GET | `/api/cars/:id` | ดึงข้อมูลรถตาม id |
| POST | `/api/cars` | เพิ่มข้อมูลรถใหม่ |
| PUT | `/api/cars/:id` | แก้ไขข้อมูลรถ |
| DELETE | `/api/cars/:id` | ลบข้อมูลรถ |

## 🐳 Docker Hub

- Backend image: `<dockerhub-username>/staffcar-api` (tags: `latest`, `v1.0.0`)
- Frontend image: `<dockerhub-username>/staffcar-web` (tags: `latest`, `v1.0.0`)
- Repository: https://hub.docker.com/r/<dockerhub-username>/staffcar-api

## 🧪 การทดสอบ

```bash
cd backend
npm install
npm run lint    # ตรวจสอบโค้ดด้วย ESLint
npm test        # รัน unit tests ด้วย Jest + Supertest
```

## ⚙️ CI Pipeline

Workflow `.github/workflows/ci.yml` ทำงานตามลำดับ: **Lint → Test → Build**
Trigger เมื่อ push ไปที่ `develop` / `feature/*` และเมื่อเปิด Pull Request เข้า `main`
