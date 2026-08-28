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
import { getUserGoogleNonce, googleLoginUser } from "../controllers/google.controller";
import {
	registerValidation,
	loginValidation,
	verifyOtpValidation,
	resendOtpValidation,
} from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/verify-otp", verifyOtpValidation, verifyUserOtp);
router.post("/resend-otp", resendOtpValidation, resendUserOtp);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate("user"), getCurrentUser);
router.get("/google/nonce", getUserGoogleNonce);
router.post("/google", googleLoginUser);

export default router;
