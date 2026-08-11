import express from "express";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Неверные данные
 *       409:
 *         description: Email уже используется
 */
router.post("/register", register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Неверный email или пароль
 */
router.post("/login", login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление access токена
 *     tags: [Auth]
 *     description: Использует refresh token из httpOnly cookie
 *     responses:
 *       200:
 *         description: Новый access токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token отсутствует или недействителен
 */
router.post("/refresh", refreshToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход пользователя
 *     tags: [Auth]
 *     description: Очищает refresh token cookie
 *     responses:
 *       200:
 *         description: Успешный выход
 */
router.post("/logout", logout);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Получение профиля текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Не авторизован
 */
router.get("/me", auth, getMe);

export default router;
