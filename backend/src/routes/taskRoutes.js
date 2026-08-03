import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  adminGetTasks,
  adminDeleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(auth);

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// Админские маршруты
router.get("/admin/tasks", isAdmin, adminGetTasks);
router.delete("/admin/tasks/:id", isAdmin, adminDeleteTask);

export default router;
