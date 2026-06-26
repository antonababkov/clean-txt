import { registerUser, loginUser } from "../services/userService.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js"; // <-- добавьте эту строку

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email и пароль обязательны" });
    }
    const user = await registerUser(email, password);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    res.status(201).json({ user, token });
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
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
