import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

describe("Stats API", () => {
  let token;
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await pool.end();
  });

  it("should return daily stats", async () => {
    const res = await request(app)
      .get("/stats/daily?days=7")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return hourly stats", async () => {
    const res = await request(app)
      .get("/stats/hourly")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return total count", async () => {
    const res = await request(app)
      .get("/stats/total")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty("total");
  });
});
