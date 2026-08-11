import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import {
  getDailyStats,
  getHourlyStats,
  getDailyStatsAll,
  getHourlyStatsAll,
  getTotalCount,
} from "../controllers/statsController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(auth);

/**
 * @swagger
 * /stats/daily:
 *   get:
 *     summary: Получить ежедневную статистику запросов текущего пользователя
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Количество дней для статистики
 *     responses:
 *       200:
 *         description: Массив с днями и количеством запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: string
 *                     format: date
 *                   count:
 *                     type: integer
 *       401:
 *         description: Не авторизован
 */
router.get("/stats/daily", auth, getDailyStats);
/**
 * @swagger
 * /stats/hourly:
 *   get:
 *     summary: Получить почасовую статистику запросов текущего пользователя за сегодня
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив с часами и количеством запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   hour:
 *                     type: integer
 *                   count:
 *                     type: integer
 *       401:
 *         description: Не авторизован
 */
router.get("/stats/hourly", auth, getHourlyStats);
/**
 * @swagger
 * /admin/stats/daily:
 *   get:
 *     summary: Получить ежедневную статистику запросов всех пользователей
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Массив с днями и общим количеством запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: string
 *                     format: date
 *                   count:
 *                     type: integer
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён (не админ)
 */
router.get("/admin/stats/daily", auth, isAdmin, getDailyStatsAll);
/**
 * @swagger
 * /admin/stats/hourly:
 *   get:
 *     summary: Получить почасовую статистику запросов всех пользователей за сегодня
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив с часами и общим количеством запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   hour:
 *                     type: integer
 *                   count:
 *                     type: integer
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён (не админ)
 */
router.get("/admin/stats/hourly", auth, isAdmin, getHourlyStatsAll);
/**
 * @swagger
 * /admin/stats/total:
 *   get:
 *     summary: Получить общее количество запросов (только для админа)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Общее количество запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён (не админ)
 */
router.get("/admin/stats/total", auth, isAdmin, getTotalCount);

export default router;
