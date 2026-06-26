import bcrypt from "bcrypt";
import User from "../models/User.js";
import { ConflictError, AuthenticationError } from "../utils/errors.js";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const registerUser = async (email, password) => {
  const existing = await User.findByEmail(email);
  if (existing) {
    throw new ConflictError("Пользователь с таким email уже существует");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await User.create({ email, passwordHash });
  return newUser;
};

export const loginUser = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new AuthenticationError("Неверный email или пароль");
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new AuthenticationError("Неверный email или пароль");
  }

  return user;
};
