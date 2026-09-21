import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

describe("Export API", () => {
  let token;
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "12345678",
  };

  beforeAll(async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    token = res.body.accessToken;
    // Создаём задачу для пользователя
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ originalText: "Test text" });
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    try {
      await pool.end();
    } catch (e) {}
  });

  describe("GET /export/tasks", () => {
    it("должен экспортировать задачи в CSV для авторизованного пользователя", async () => {
      const res = await request(app)
        .get("/export/tasks")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(res.headers["content-type"]).toMatch(/text\/csv/);
      // Проверяем, что CSV содержит заголовки (с кавычками, так как json2csv экранирует)
      expect(res.text).toContain(
        '"id","original_text","cleaned_text","remove_hidden_markers","created_at"',
      );
    });

    it("должен вернуть 404, если задач нет", async () => {
      const newUser = {
        email: `empty${Date.now()}@example.com`,
        password: "12345678",
      };
      const reg = await request(app).post("/auth/register").send(newUser);
      const emptyToken = reg.body.accessToken;
      await request(app)
        .get("/export/tasks")
        .set("Authorization", `Bearer ${emptyToken}`)
        .expect(404);
      await pool.query("DELETE FROM users WHERE email = $1", [newUser.email]);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/export/tasks").expect(401);
    });
  });
});
