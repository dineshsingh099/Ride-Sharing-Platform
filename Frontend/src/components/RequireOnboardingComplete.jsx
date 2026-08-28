import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { partnerService } from "../services/partnerServices";

const stepPaths = {
	0: "/onboarding/vehicle",
	1: "/onboarding/docs",
	2: "/onboarding/bank",
};

export default function RequireOnboardingComplete({ children }) {
	const [state, setState] = useState({ status: "loading", redirectTo: null });

	useEffect(() => {
		let isMounted = true;

		const check = async () => {
			try {
				const data = await partnerService.getOnboardingStatus();
				if (!isMounted) return;

				const currentStep = data?.currentStep ?? 0;

				if (currentStep >= 3) {
					setState({ status: "ok", redirectTo: null });
				} else {
					setState({
						status: "redirect",
						redirectTo: stepPaths[currentStep] ?? "/onboarding/vehicle",
					});
				}
			} catch (err) {
				if (!isMounted) return;
				setState({ status: "redirect", redirectTo: "/partner/login" });
			}
		};

		check();
		return () => {
			isMounted = false;
		};
	}, []);

	if (state.status === "loading") {
		return (
			<div className="h-screen bg-[#08080C] flex items-center justify-center">
				<div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
			</div>
		);
	}

	if (state.status === "redirect") {
		return <Navigate to={state.redirectTo} replace />;
	}

	return children;
}
