import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  adminGetAllTasks,
} from "../controllers/taskController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(auth);

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// Админский маршрут
router.get("/admin/tasks", isAdmin, adminGetAllTasks);

export default router;
