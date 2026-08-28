import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OnboardingGuard from "./components/OnboardingGuard";
import RequireOnboardingComplete from "./components/RequireOnboardingComplete";

const UserLogin = lazy(() => import("./pages/auth/UserLogin"));
const UserSignup = lazy(() => import("./pages/auth/UserSignup"));
const PartnerLogin = lazy(() => import("./pages/auth/PartnerLogin"));
const PartnerSignup = lazy(() => import("./pages/auth/PartnerSignup"));
const VerityOTP = lazy(() => import("./pages/auth/VeriftyOTP"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PartnerVehicleDetails = lazy(() =>
	import("./pages/onboarding/PartnerVehicleDetails"),
);
const PartnerDocs = lazy(() => import("./pages/onboarding/PartnerDocs"));
const PartnerBankDetails = lazy(() =>
	import("./pages/onboarding/PartnerBankDetails"),
);
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
const PartnerDashboard = lazy(() =>
	import("./pages/dashboard/PartnerDashboard"),
);

function PageFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0A0A0D]">
			<div className="w-10 h-10 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
		</div>
	);
}

function App() {
	return (
		<Suspense fallback={<PageFallback />}>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/about" element={<Landing />} />
				<Route path="/services" element={<Landing />} />
				<Route path="/how-it-works" element={<Landing />} />
				<Route path="/contact" element={<Landing />} />
				<Route path="/login" element={<UserLogin />} />
				<Route path="/signup" element={<UserSignup />} />
				<Route path="/partner/login" element={<PartnerLogin />} />
				<Route path="/partner/signup" element={<PartnerSignup />} />
				<Route path="/verify-otp" element={<VerityOTP />} />
				<Route
					path="/onboarding/vehicle"
					element={
						<OnboardingGuard step={1}>
							<PartnerVehicleDetails />
						</OnboardingGuard>
					}
				/>
				<Route
					path="/onboarding/docs"
					element={
						<OnboardingGuard step={2}>
							<PartnerDocs />
						</OnboardingGuard>
					}
				/>
				<Route
					path="/onboarding/bank"
					element={
						<OnboardingGuard step={3}>
							<PartnerBankDetails />
						</OnboardingGuard>
					}
				/>
				<Route path="/dashboard" element={<UserDashboard />} />
				<Route
					path="/partner/dashboard"
					element={
						<RequireOnboardingComplete>
							<PartnerDashboard />
						</RequireOnboardingComplete>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default App;
