import express from "express";
import { auth } from "../middleware/auth.js";
import { exportTasksCSV } from "../controllers/exportController.js";

const router = express.Router();

/**
 * @swagger
 * /export/tasks:
 *   get:
 *     summary: Экспорт задач в CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV файл со списком задач
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Нет задач для экспорта
 */
router.get("/export/tasks", auth, exportTasksCSV);

export default router;
