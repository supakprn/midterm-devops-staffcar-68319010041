// tests/validate.test.js
jest.mock("../db", () => ({
  pool: { query: jest.fn(), on: jest.fn() },
  initDb: jest.fn().mockResolvedValue(),
}));

const { validateCarPayload } = require("../index");

describe("validateCarPayload", () => {
  it("ควร return error เมื่อไม่ส่ง plate_no, type, owner มา", () => {
    const errors = validateCarPayload({});
    expect(errors).toContain("plate_no is required");
    expect(errors).toContain("type is required");
    expect(errors).toContain("owner is required");
  });

  it("ควรไม่มี error เมื่อข้อมูลครบถ้วน", () => {
    const errors = validateCarPayload({
      plate_no: "กข-1234",
      type: "รถยนต์",
      owner: "สมชาย ใจดี",
    });
    expect(errors).toHaveLength(0);
  });
});
