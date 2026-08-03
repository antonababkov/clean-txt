import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import {
  getDailyStats,
  getHourlyStats,
  getDailyStatsAll,
  getHourlyStatsAll,
  getTotalCount,
} from "../controllers/statsController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(auth);

router.get("/stats/daily", auth, getDailyStats);
router.get("/stats/hourly", auth, getHourlyStats);

router.get("/admin/stats/daily", auth, isAdmin, getDailyStatsAll);
router.get("/admin/stats/hourly", auth, isAdmin, getHourlyStatsAll);

router.get("/admin/stats/total", auth, isAdmin, getTotalCount);

export default router;
