import express from "express";
import { body } from "express-validator";
import { UserRegister, UserLogin, UserLogout, UserProfile } from "../controllers/user.controller.js";
import { UserAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
	"/register",
	[
		body("name")
			.isLength({ min: 3 })
			.withMessage("Name must be at least 3 characters"),
		body("email").isEmail().withMessage("Invalid email"),
		body("phone")
			.isLength({ min: 10 })
			.withMessage("Phone must be at least 10 digits"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
	],
	UserRegister
);
router.post(
	"/login",
	[
		body("password").notEmpty().withMessage("Password is required"),
		body().custom((value, { req }) => {
			if (!req.body.email && !req.body.phone) {
				throw new Error("Email or phone is required");
			}
			return true;
		}),
		body("email").optional().isEmail().withMessage("Invalid email"),
		body("phone").optional().isLength({ min: 10 }).withMessage("Invalid phone"),
	],
	UserLogin
);
router.get("/logout", UserAuthMiddleware, UserLogout);
router.get("/profile", UserAuthMiddleware, UserProfile);

export default router;
