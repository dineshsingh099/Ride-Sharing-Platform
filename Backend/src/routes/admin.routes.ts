import { Router } from "express";
import {
	loginAdmin,
	logoutAdmin,
	refreshAdminAccessToken,
	getCurrentAdmin,
} from "../controllers/admin.controller";
import { loginValidation } from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";
import { blockOtherRoleSession } from "../middlewares/singleRole.middleware";

const router = Router();
const singleRole = blockOtherRoleSession("admin");

router.post("/login", singleRole, loginValidation, loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh-token", refreshAdminAccessToken);
router.get("/me", authenticate("admin"), getCurrentAdmin);

export default router;
