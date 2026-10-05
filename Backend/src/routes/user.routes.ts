import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	getCurrentUser,
	verifyUserOtp,
	resendUserOtp,
} from "../controllers/user.controller";
import {
	getUserGoogleNonce,
	googleLoginUser,
} from "../controllers/google.controller";
import {
	registerValidation,
	loginValidation,
	verifyOtpValidation,
	resendOtpValidation,
} from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";
import { blockOtherRoleSession } from "../middlewares/singleRole.middleware";

const router = Router();
const singleRole = blockOtherRoleSession("user");

router.post("/register", registerValidation, registerUser);
router.post("/login", singleRole, loginValidation, loginUser);
router.post("/verify-otp", verifyOtpValidation, verifyUserOtp);
router.post("/resend-otp", resendOtpValidation, resendUserOtp);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate("user"), getCurrentUser);
router.get("/google/nonce", getUserGoogleNonce);
router.post("/google", singleRole, googleLoginUser);

export default router;
