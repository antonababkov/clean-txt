import express from "express";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", auth, getMe);

export default router;
