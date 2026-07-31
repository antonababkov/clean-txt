import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();
router.get("/admin/users", auth, isAdmin, getUsers);

export default router;
