// tests/cars.test.js
const request = require("supertest");

const mockQuery = jest.fn();

jest.mock("../db", () => ({
  pool: { query: (...args) => mockQuery(...args), on: jest.fn() },
  initDb: jest.fn().mockResolvedValue(),
}));

const { app } = require("../index");

describe("POST /api/cars", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("ควรบันทึกข้อมูลรถสำเร็จและตอบกลับ 201 เมื่อข้อมูลครบถ้วน", async () => {
    const fakeCar = {
      id: 1,
      plate_no: "กข-1234",
      type: "รถยนต์",
      brand_model: "Toyota Vios",
      color: "ขาว",
      owner: "สมชาย ใจดี",
      department: "IT",
      status: "รออก",
    };
    mockQuery.mockResolvedValueOnce({ rows: [fakeCar] });

    const res = await request(app).post("/api/cars").send({
      plate_no: "กข-1234",
      type: "รถยนต์",
      brand_model: "Toyota Vios",
      color: "ขาว",
      owner: "สมชาย ใจดี",
      department: "IT",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ plate_no: "กข-1234", owner: "สมชาย ใจดี" });
  });

  it("ควรตอบกลับ 400 เมื่อข้อมูลไม่ครบถ้วน", async () => {
    const res = await request(app).post("/api/cars").send({ plate_no: "กข-1234" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
