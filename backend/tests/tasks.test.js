import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

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

  // Создаём обычного пользователя и админа
  beforeAll(async () => {
    // Регистрируем обычного пользователя
    const userRes = await request(app).post("/auth/register").send(testUser);
    userToken = userRes.body.token;

    // Регистрируем админа (вручную меняем роль в БД)
    const adminRes = await request(app).post("/auth/register").send(adminUser);
    adminToken = adminRes.body.token;

    // Повышаем роль до admin
    await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [
      adminUser.email,
    ]);
  });

  afterAll(async () => {
    // Чистка после всех тестов
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
        .send({ originalText: "<p>Hello   world!</p>" })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.cleaned_text).toBe("Hello world!");
      testTaskId = res.body.id; // сохраняем для дальнейших тестов
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
    beforeAll(async () => {
      // Создаём несколько задач для проверки пагинации
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/tasks")
          .set("Authorization", `Bearer ${userToken}`)
          .send({ originalText: `Task ${i}` });
      }
    });

    it("должен вернуть список задач с пагинацией", async () => {
      const res = await request(app)
        .get("/tasks?limit=3&offset=0")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("tasks");
      expect(res.body).toHaveProperty("total");
      expect(res.body.tasks.length).toBeLessThanOrEqual(3);
      expect(res.body.total).toBeGreaterThanOrEqual(6); // 1 (созданная ранее) + 5 = 6
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
    });

    it("должен вернуть 404, если задание не найдено", async () => {
      await request(app)
        .get("/tasks/99999")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });

    it("не должен позволять получить задание другого пользователя", async () => {
      // Создаём задание от админа
      const adminTask = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ originalText: "Admin task" });

      // Пытаемся получить его от обычного пользователя
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

      // Проверяем, что задания нет
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
      // Создаём несколько задач от разных пользователей
      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ originalText: "User task 1" });

      await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ originalText: "Admin task 2" });
    });

    it("должен позволять админу получить все задачи", async () => {
      const res = await request(app)
        .get("/admin/tasks?limit=5")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty("tasks");
      expect(res.body.tasks.length).toBeGreaterThanOrEqual(2);
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
