import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getDailyStats,
  getHourlyStats,
  getTotalCount,
} from "../controllers/statsController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(auth);

router.get("/stats/daily", getDailyStats);
router.get("/stats/hourly", getHourlyStats);
router.get("/stats/total", getTotalCount);

export default router;
