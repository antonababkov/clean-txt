import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

describe("Stats API", () => {
  let userToken;
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    // Регистрируем пользователя
    const registerRes = await request(app)
      .post("/auth/register")
      .send(testUser);
    userToken = registerRes.body.accessToken; // <-- accessToken вместо token
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await pool.end();
  });

  describe("GET /stats/daily", () => {
    it("должен вернуть статистику за последние 7 дней", async () => {
      const res = await request(app)
        .get("/stats/daily?days=7")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      // Проверяем структуру ответа (может быть пустой массив)
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("day");
        expect(res.body[0]).toHaveProperty("count");
      }
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/stats/daily").expect(401);
    });
  });

  describe("GET /stats/hourly", () => {
    it("должен вернуть почасовую статистику за последние 24 часа", async () => {
      const res = await request(app)
        .get("/stats/hourly")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("hour");
        expect(res.body[0]).toHaveProperty("count");
      }
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/stats/hourly").expect(401);
    });
  });
});
