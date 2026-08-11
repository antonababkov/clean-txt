import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Получить список всех пользователей (только для админа)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён (не админ)
 */
router.get("/admin/users", auth, isAdmin, getUsers);

export default router;
