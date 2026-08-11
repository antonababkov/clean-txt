import express from "express";
import { auth } from "../middleware/auth.js";
import { exportTasksCSV } from "../controllers/exportController.js";

const router = express.Router();
router.get("/export/tasks", auth, exportTasksCSV);

export default router;
