import express from "express";
import { UserRegister, UserLogin, UserLogout, UserProfile } from "../controllers/user.controller.js";
import { UserAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/logout", UserLogout);
router.get("/profile", UserAuthMiddleware, UserProfile);
export default router;
