import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Pool } from "pg";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/", taskRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
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

app.use(errorHandler);

export default app;
