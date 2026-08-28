import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { partnerService } from "../../services/partnerServices";
import { extractErrorMessage } from "../../utils/errorHandler";
import { getPartnerPostAuthRedirect } from "../../utils/onboardingRedirect";
import FormError from "../../components/FormError";

const GoogleAuthButton = lazy(() => import("../../components/GoogleAuthButton"));

export default function PartnerLogin() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setError("");

		if (!email.trim() || !password) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);

		try {
			await partnerService.login(email.trim(), password);
			const redirectTo = await getPartnerPostAuthRedirect();
			navigate(redirectTo, { replace: true });
		} catch (err) {
			if (err.response?.status === 403 && err.response?.data?.isEmailVerified === false) {
				navigate("/verify-otp", {
					state: {
						email: email.trim(),
						role: "partner",
						retryAfter: 60,
					},
				});
				return;
			}
			setError(extractErrorMessage(err));
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleCredential = async (credential, nonce) => {
		setError("");
		setLoading(true);

		try {
			await partnerService.googleLogin(credential, nonce);
			const redirectTo = await getPartnerPostAuthRedirect();
			navigate(redirectTo, { replace: true });
		} catch (err) {
			setError(extractErrorMessage(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0A0A0D] flex items-start sm:items-center justify-center px-4 py-10 relative overflow-x-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-[#0A0A0D] to-blue-900/20" />

			<div className="absolute top-20 left-10 w-56 h-56 bg-violet-600/20 rounded-full blur-[120px]" />
			<div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[120px]" />

			<div className="relative z-10 w-full max-w-md bg-[#111118]/95 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-7 shadow-2xl shadow-violet-900/30">
				<Link
					to="/"
					className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center hover:bg-violet-500/25 transition-all duration-300"
				>
					<ArrowLeft size={17} className="text-violet-200" />
				</Link>

				<h1 className="mt-5 text-3xl font-bold text-white">Partner Login</h1>

				<p className="text-gray-400 mt-2 mb-6">
					Login to your RideX Partner account and start earning.
				</p>

				<Suspense
					fallback={
						<div className="w-full h-[44px] rounded-full bg-[#1A1A24] border border-violet-500/20 animate-pulse" />
					}
				>
					<GoogleAuthButton
						getNonce={partnerService.getGoogleNonce}
						onCredential={handleGoogleCredential}
						onError={(msg) => setError(msg)}
						disabled={loading}
					/>
				</Suspense>

				<div className="flex items-center gap-3 my-6">
					<div className="flex-1 h-px bg-linear-to-r from-transparent to-violet-500/40" />
					<span className="text-xs uppercase tracking-widest text-gray-500">
						OR
					</span>
					<div className="flex-1 h-px bg-linear-to-l from-transparent to-violet-500/40" />
				</div>

				<div className="space-y-4">
					<div className="relative">
						<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email Address"
							disabled={loading}
							className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
						/>
					</div>

					<div className="relative">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							disabled={loading}
							className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7B8CFF] transition-colors cursor-pointer"
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>
				</div>

				<div className="flex justify-end mt-3">
					<Link
						to="/partner-forgot-password"
						className="text-sm text-violet-300 hover:text-white transition-colors"
					>
						Forgot Password?
					</Link>
				</div>

				<FormError message={error} />

				<button
					type="button"
					onClick={handleLogin}
					disabled={loading}
					className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{loading && <Loader2 size={18} className="animate-spin" />}
					{loading ? "Logging in..." : "Login as Partner"}
				</button>

				<p className="text-center text-gray-400 mt-6">
					Don't have a partner account?{" "}
					<Link
						to="/partner/signup"
						className="text-violet-300 hover:text-white font-semibold transition-colors"
					>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
