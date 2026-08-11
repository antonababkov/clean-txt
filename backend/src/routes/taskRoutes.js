import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  adminGetTasks,
  adminDeleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(auth);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Создать задачу на очистку текста
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalText
 *             properties:
 *               originalText:
 *                 type: string
 *                 description: Исходный текст для очистки
 *     responses:
 *       201:
 *         description: Задача создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Не авторизован
 */
router.post("/tasks", createTask);
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Получить список задач текущего пользователя
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество задач на страницу
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение для пагинации
 *     responses:
 *       200:
 *         description: Список задач
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Не авторизован
 */
router.get("/tasks", getTasks);
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Получить задачу по ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Данные задачи
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Задача не найдена
 */
router.get("/tasks/:id", getTaskById);
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Обновить задачу (изменить исходный текст)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalText
 *             properties:
 *               originalText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновлённая задача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Задача не найдена
 */
router.put("/tasks/:id", updateTask);
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Удалить задачу
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Задача удалена
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Задача не найдена
 */
router.delete("/tasks/:id", deleteTask);

// Админские маршруты
/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Получить все задачи (только для администраторов)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Фильтр по ID пользователя
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Фильтр за последние N дней
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Список задач всех пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён (не админ)
 */
router.get("/admin/tasks", isAdmin, adminGetTasks);
/**
 * @swagger
 * /admin/tasks/{id}:
 *   delete:
 *     summary: Удалить задачу (только для администраторов)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID задачи
 *     responses:
 *       204:
 *         description: Задача успешно удалена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён (не админ)
 *       404:
 *         description: Задача не найдена
 */
router.delete("/admin/tasks/:id", isAdmin, adminDeleteTask);

export default router;
