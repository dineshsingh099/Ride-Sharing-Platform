import { partnerService } from "../services/partnerServices";

const stepPaths = {
	0: "/onboarding/vehicle",
	1: "/onboarding/docs",
	2: "/onboarding/bank",
};

export async function getPartnerPostAuthRedirect() {
	try {
		const data = await partnerService.getOnboardingStatus();
		const currentStep = data?.currentStep ?? 0;

		if (currentStep >= 3) {
			return "/partner/dashboard";
		}

		return stepPaths[currentStep] ?? "/onboarding/vehicle";
	} catch (err) {
		return "/onboarding/vehicle";
	}
}
