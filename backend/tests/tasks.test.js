import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";
import bcrypt from "bcrypt";

describe("Tasks API", () => {
  let userToken;
  let adminToken;
  let testTaskId;

  const testUser = {
    email: `user${Date.now()}@example.com`,
    password: "12345678",
  };

  const adminUser = {
    email: `admin${Date.now()}@example.com`,
    password: "12345678",
  };

  const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  beforeAll(async () => {
    // 1. Создаём обычного пользователя через API
    const userRes = await request(app).post("/auth/register").send(testUser);
    userToken = userRes.body.token;

    // 2. Создаём админа напрямую в БД с ролью admin
    const hashedAdminPassword = await hashPassword(adminUser.password);
    await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [adminUser.email, hashedAdminPassword],
    );

    // Получаем токен для админа через логин
    const adminLogin = await request(app)
      .post("/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = adminLogin.body.token;

    // 3. Создаём тестовое задание для обычного пользователя
    const createRes = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ originalText: "<p>Hello   world!</p>" });

    if (createRes.status === 201) {
      testTaskId = createRes.body.id;
    } else {
      // Если API не сработал, вставляем через SQL
      const userRecord = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [testUser.email],
      );
      const userId = userRecord.rows[0].id;
      const insertRes = await pool.query(
        `INSERT INTO cleaning_tasks (user_id, original_text, cleaned_text)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [userId, "<p>Hello   world!</p>", "Hello world!"],
      );
      testTaskId = insertRes.rows[0].id;
    }
  });

  afterAll(async () => {
    // Удаляем созданные записи
    await pool.query(
      "DELETE FROM cleaning_tasks WHERE user_id IN (SELECT id FROM users WHERE email = $1 OR email = $2)",
      [testUser.email, adminUser.email],
    );
    await pool.query("DELETE FROM users WHERE email = $1 OR email = $2", [
      testUser.email,
      adminUser.email,
    ]);
    await pool.end();
  });

  describe("POST /tasks", () => {
    it("должен создать задание и очистить текст", async () => {
      const res = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "<p>Another   text</p>" })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.cleaned_text).toBe("Another text");
    });

    it("должен вернуть 400, если текст отсутствует", async () => {
      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app)
        .post("/tasks")
        .send({ originalText: "test" })
        .expect(401);
    });
  });

  describe("GET /tasks", () => {
    it("должен вернуть список задач с пагинацией", async () => {
      const res = await request(app)
        .get("/tasks?limit=3&offset=0")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("tasks");
      expect(res.body).toHaveProperty("total");
      expect(res.body.tasks.length).toBeLessThanOrEqual(3);
      expect(res.body.total).toBeGreaterThanOrEqual(1);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/tasks").expect(401);
    });
  });

  describe("GET /tasks/:id", () => {
    it("должен вернуть задание по ID", async () => {
      const res = await request(app)
        .get(`/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.id).toBe(testTaskId);
      expect(res.body.original_text).toBe("<p>Hello   world!</p>");
      expect(res.body.cleaned_text).toBe("Hello world!");
    });

    it("должен вернуть 404, если задание не найдено", async () => {
      await request(app)
        .get("/tasks/99999")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });

    it("не должен позволять получить задание другого пользователя", async () => {
      const adminTask = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ originalText: "Admin task" });

      await request(app)
        .get(`/tasks/${adminTask.body.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("должен обновить задание", async () => {
      const res = await request(app)
        .put(`/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "<b>Updated</b> text" })
        .expect(200);

      expect(res.body.cleaned_text).toBe("Updated text");
      expect(res.body.original_text).toBe("<b>Updated</b> text");
    });

    it("должен вернуть 400, если текст отсутствует", async () => {
      await request(app)
        .put(`/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });

    it("должен вернуть 404, если задание не найдено", async () => {
      await request(app)
        .put("/tasks/99999")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "test" })
        .expect(404);
    });

    it("не должен позволять обновлять задание другого пользователя", async () => {
      const adminTask = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ originalText: "Admin task" });

      await request(app)
        .put(`/tasks/${adminTask.body.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "hack" })
        .expect(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("должен удалить задание", async () => {
      const newTask = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "to delete" });

      await request(app)
        .delete(`/tasks/${newTask.body.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(204);

      await request(app)
        .get(`/tasks/${newTask.body.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });

    it("должен вернуть 404, если задание не найдено", async () => {
      await request(app)
        .delete("/tasks/99999")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });

    it("не должен позволять удалять задание другого пользователя", async () => {
      const adminTask = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ originalText: "Admin task" });

      await request(app)
        .delete(`/tasks/${adminTask.body.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe("Admin endpoints", () => {
    beforeAll(async () => {
      // Создаём ещё одну задачу от обычного пользователя (для пагинации)
      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "User task for admin" });
    });

    it("должен позволять админу получить все задачи", async () => {
      const res = await request(app)
        .get("/admin/tasks?limit=5")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("tasks");
      expect(res.body.tasks.length).toBeGreaterThanOrEqual(1);
      expect(res.body).toHaveProperty("total");
    });

    it("не должен позволять обычному пользователю получать все задачи", async () => {
      await request(app)
        .get("/admin/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });

    it("должен вернуть 401 без токена", async () => {
      await request(app).get("/admin/tasks").expect(401);
    });
  });
});
