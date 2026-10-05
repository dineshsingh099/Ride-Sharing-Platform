import { Router } from "express";
import {
	registerPartner,
	loginPartner,
	logoutPartner,
	refreshPartnerAccessToken,
	verifyPartnerOtp,
	resendPartnerOtp,
	getCurrentPartner,
} from "../controllers/partner.controller";
import {
	getPartnerGoogleNonce,
	googleLoginPartner,
} from "../controllers/google.controller";
import {
	registerValidation,
	loginValidation,
	verifyOtpValidation,
	resendOtpValidation,
} from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";
import { blockOtherRoleSession } from "../middlewares/singleRole.middleware";
import onboardingRoutes from "./onboarding.routes";

const router = Router();
const singleRole = blockOtherRoleSession("partner");

router.post("/register", registerValidation, registerPartner);
router.post("/login", singleRole, loginValidation, loginPartner);
router.post("/verify-otp", verifyOtpValidation, verifyPartnerOtp);
router.post("/resend-otp", resendOtpValidation, resendPartnerOtp);
router.post("/logout", logoutPartner);
router.post("/refresh-token", refreshPartnerAccessToken);
router.get("/me", authenticate("partner"), getCurrentPartner);
router.get("/google/nonce", getPartnerGoogleNonce);
router.post("/google", singleRole, googleLoginPartner);

router.use("/onboarding", onboardingRoutes);

export default router;
