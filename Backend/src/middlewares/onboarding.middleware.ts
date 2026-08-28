import { Request, Response, NextFunction } from "express";
import Partner from "../models/partner";

export function requireOnboardingStep(step: 1 | 2 | 3) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const partner = await Partner.findById(req.user?.id);
			if (!partner) {
				return res.status(404).json({ message: "Partner not found" });
			}

			if (!partner.isEmailVerified) {
				return res.status(403).json({
					message: "Please verify your account before continuing onboarding",
				});
			}

			if (partner.partnerOnBoardingSteps >= 3) {
				return res.status(403).json({
					message: "Onboarding already completed",
					onboardingCompleted: true,
				});
			}

			const requiredCompletedSteps = step - 1;
			if (partner.partnerOnBoardingSteps < requiredCompletedSteps) {
				return res.status(403).json({
					message: "Please complete the previous onboarding step first",
					currentStep: partner.partnerOnBoardingSteps,
				});
			}

			next();
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	};
}
