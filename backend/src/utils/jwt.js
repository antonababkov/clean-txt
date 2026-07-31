import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "45m";
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "2d";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
