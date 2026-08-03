import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Pool } from "pg";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Список разрешённых origin (для разработки и продакшена)
const allowedOrigins = [
  "http://localhost:5173", // Vite по умолчанию
  "http://localhost:3000", // возможный порт
  "https://ваш-домен.ру", // для продакшена
];

dotenv.config();

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем запросы без origin (например, от curl/Postman) в разработке
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // разрешаем отправку cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Логирование запросов в request_logs
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const userId = req.user ? req.user.userId : null;
    const logQuery = `
      INSERT INTO request_logs (user_id, endpoint, method, status, response_time)
      VALUES ($1, $2, $3, $4, $5)
    `;
    pool
      .query(logQuery, [
        userId,
        req.originalUrl,
        req.method,
        res.statusCode,
        duration,
      ])
      .catch((err) => console.error("Log error:", err));
  });
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/", taskRoutes);
app.use("/", statsRoutes);
app.use("/", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
