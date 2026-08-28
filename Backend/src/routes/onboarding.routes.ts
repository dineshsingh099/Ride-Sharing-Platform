import { Router } from "express";
import {
	submitVehicleDetails,
	submitPartnerDocuments,
	submitBankDetails,
	getOnboardingStatus,
} from "../controllers/onboarding.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireOnboardingStep } from "../middlewares/onboarding.middleware";
import { uploadPartnerDocs } from "../utils/upload";
import {
	vehicleDetailsValidation,
	bankDetailsValidation,
} from "../validations/onboarding.validation";

const router = Router();

router.get("/status", authenticate("partner"), getOnboardingStatus);

router.post(
	"/vehicle",
	authenticate("partner"),
	requireOnboardingStep(1),
	vehicleDetailsValidation,
	submitVehicleDetails,
);

router.post(
	"/documents",
	authenticate("partner"),
	requireOnboardingStep(2),
	uploadPartnerDocs,
	submitPartnerDocuments,
);

router.post(
	"/bank",
	authenticate("partner"),
	requireOnboardingStep(3),
	bankDetailsValidation,
	submitBankDetails,
);

export default router;
