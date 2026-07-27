import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import { registerUser, loginUser } from "../services/userService.js";
import User from "../models/User.js";

// При регистрации и логине отправляем access token в теле, refresh token – в httpOnly cookie
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // только HTTPS в проде
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }
    const user = await registerUser(email, password);
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    setRefreshTokenCookie(res, refreshToken);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }
    const user = await loginUser(email, password);
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    setRefreshTokenCookie(res, refreshToken);
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// Новый эндпоинт для обновления access token
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token отсутствует" });
    }
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Недействительный или просроченный refresh token" });
    }
    // Проверяем, существует ли пользователь
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    // Генерируем новый access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
// Эндпоинт для выхода (очищает refresh cookie)
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
};
