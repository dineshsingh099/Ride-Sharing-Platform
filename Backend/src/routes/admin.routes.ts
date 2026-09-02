import { Router } from "express";
import {
	loginAdmin,
	logoutAdmin,
	refreshAdminAccessToken,
	getCurrentAdmin,
} from "../controllers/admin.controller";
import { loginValidation } from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", loginValidation, loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh-token", refreshAdminAccessToken);
router.get("/me", authenticate("admin"), getCurrentAdmin);

export default router;
