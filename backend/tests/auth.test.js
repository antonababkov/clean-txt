import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

describe("Auth Endpoints", () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "12345678",
  };

  // Удаляем пользователя после всех тестов (чистота)
  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await pool.end();
  });

  describe("POST /auth/register", () => {
    // Перед каждым тестом удаляем пользователя, чтобы тесты не мешали друг другу
    beforeEach(async () => {
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    });

    it("должен зарегистрировать нового пользователя", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("должен вернуть 400, если email или пароль отсутствуют", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: testUser.email })
        .expect(400);
      expect(res.body.message).toMatch(/обязательны/i);
    });

    it("не должен регистрировать дубликат email", async () => {
      await request(app).post("/auth/register").send(testUser);
      const res = await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(409); // ожидаем Conflict
    });
  });

  describe("POST /auth/login", () => {
    // Создаём пользователя один раз перед тестами этого блока
    beforeAll(async () => {
      // Удаляем на всякий случай
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
      // Регистрируем пользователя
      await request(app).post("/auth/register").send(testUser);
    });

    // После всех тестов удаляем пользователя
    afterAll(async () => {
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    });

    it("должен залогинить существующего пользователя", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("должен вернуть 401 при неправильном пароле", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: "wrong" })
        .expect(401);
    });
  });

  describe("GET /auth/me", () => {
    let token;

    // Создаём пользователя и получаем токен перед тестами
    beforeAll(async () => {
      // Удаляем на всякий случай
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
      // Регистрируем
      await request(app).post("/auth/register").send(testUser);
      // Логинимся и получаем токен
      const res = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });
      token = res.body.token;
    });

    afterAll(async () => {
      await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    });

    it("должен вернуть профиль пользователя по токену", async () => {
      const res = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body.email).toBe(testUser.email);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/auth/me").expect(401);
    });
  });
});
