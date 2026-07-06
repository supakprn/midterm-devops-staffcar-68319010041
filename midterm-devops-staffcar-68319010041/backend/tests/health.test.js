// tests/health.test.js
const request = require("supertest");

jest.mock("../db", () => ({
  pool: { query: jest.fn(), on: jest.fn() },
  initDb: jest.fn().mockResolvedValue(),
}));

const { app } = require("../index");

describe("GET /health", () => {
  it("ควรตอบกลับ status ok และ version เป็น JSON", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("version");
  });
});
