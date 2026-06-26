import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "Недействительный или просроченный токен" });
  }
  req.user = decoded;
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Доступ запрещён (требуются права администратора)" });
  }
  next();
};
