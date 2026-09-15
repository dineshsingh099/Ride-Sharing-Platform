import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OnboardingGuard from "./components/guards/OnboardingGuard";
import RequireOnboardingComplete from "./components/guards/RequireOnboardingComplete";

const UserLogin = lazy(() => import("./pages/user/UserLogin"));
const UserSignup = lazy(() => import("./pages/user/UserSignup"));
const PartnerLogin = lazy(() => import("./pages/partner/PartnerLogin"));
const PartnerSignup = lazy(() => import("./pages/partner/PartnerSignup"));
const VerityOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PartnerVehicleDetails = lazy(() =>
	import("./pages/partner/onboarding/PartnerVehicleDetails"),
);
const PartnerDocs = lazy(() => import("./pages/partner/onboarding/PartnerDocs"));
const PartnerBankDetails = lazy(() =>
	import("./pages/partner/onboarding/PartnerBankDetails"),
);
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const PartnerDashboard = lazy(() =>
	import("./pages/partner/PartnerDashboard"),
);
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

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
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin/dashboard" element={<AdminDashboard />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default App;
