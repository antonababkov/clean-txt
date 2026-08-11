import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

describe("Admin API", () => {
  let adminToken;
  let userToken;
  let adminUserId;
  const adminUser = {
    email: `admin${Date.now()}@example.com`,
    password: "12345678",
  };
  const regularUser = {
    email: `user${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    // Создаём админа
    const adminRes = await request(app).post("/auth/register").send(adminUser);
    adminUserId = adminRes.body.user.id;
    // Повышаем роль до admin
    await pool.query("UPDATE users SET role = $1 WHERE email = $2", [
      "admin",
      adminUser.email,
    ]);
    // Получаем новый токен с правильной ролью
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = loginRes.body.accessToken;

    // Создаём обычного пользователя
    const userRes = await request(app).post("/auth/register").send(regularUser);
    userToken = userRes.body.accessToken;

    // Добавляем тестовые логи для статистики (для админа)
    await pool.query(
      `INSERT INTO request_logs (user_id, endpoint, method, status, response_time, timestamp)
       VALUES ($1, '/tasks', 'POST', 201, 100, NOW() - INTERVAL '1 day'),
              ($1, '/tasks', 'POST', 201, 120, NOW() - INTERVAL '2 days')`,
      [adminUserId],
    );
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1 OR email = $2", [
      adminUser.email,
      regularUser.email,
    ]);
    try {
      await pool.end();
    } catch (e) {}
  });

  describe("GET /admin/users", () => {
    it("должен вернуть список пользователей для админа", async () => {
      const res = await request(app)
        .get("/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("должен вернуть 403 для обычного пользователя", async () => {
      await request(app)
        .get("/admin/users")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/admin/users").expect(401);
    });
  });

  describe("GET /admin/stats/daily", () => {
    it("должен вернуть ежедневную статистику для админа", async () => {
      const res = await request(app)
        .get("/admin/stats/daily?days=7")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("должен вернуть 403 для обычного пользователя", async () => {
      await request(app)
        .get("/admin/stats/daily")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/admin/stats/daily").expect(401);
    });
  });

  describe("GET /admin/stats/hourly", () => {
    it("должен вернуть почасовую статистику для админа", async () => {
      const res = await request(app)
        .get("/admin/stats/hourly")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("должен вернуть 403 для обычного пользователя", async () => {
      await request(app)
        .get("/admin/stats/hourly")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
