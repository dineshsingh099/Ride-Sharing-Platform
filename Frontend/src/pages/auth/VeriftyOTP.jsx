import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userService } from "../../services/userServices";
import { partnerService } from "../../services/partnerServices";
import { extractErrorMessage } from "../../utils/errorHandler";
import FormError from "../../components/FormError";

export default function VerifyOTP() {
	const navigate = useNavigate();
	const location = useLocation();

	const email = location.state?.email;
	const role = location.state?.role === "partner" ? "partner" : "user";
	const initialRetryAfter = location.state?.retryAfter ?? 60;

	const service = role === "partner" ? partnerService : userService;
	const backLink = role === "partner" ? "/partner/signup" : "/signup";

	const [digits, setDigits] = useState(["", "", "", "", "", ""]);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [verifying, setVerifying] = useState(false);
	const [resending, setResending] = useState(false);
	const [cooldown, setCooldown] = useState(initialRetryAfter);

	const inputRefs = useRef([]);

	useEffect(() => {
		if (!email) {
			navigate(backLink, { replace: true });
		}
	}, [email, navigate, backLink]);

	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = setInterval(() => {
			setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(timer);
	}, [cooldown]);

	const focusInput = (index) => {
		inputRefs.current[index]?.focus();
	};

	const handleChange = (index, value) => {
		const digit = value.replace(/[^0-9]/g, "").slice(-1);
		const next = [...digits];
		next[index] = digit;
		setDigits(next);
		setError("");

		if (digit && index < 5) {
			focusInput(index + 1);
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !digits[index] && index > 0) {
			focusInput(index - 1);
		}
	};

	const handlePaste = (e) => {
		const pasted = e.clipboardData
			.getData("text")
			.replace(/[^0-9]/g, "")
			.slice(0, 6);
		if (!pasted) return;
		e.preventDefault();
		const next = pasted.split("");
		while (next.length < 6) next.push("");
		setDigits(next);
		focusInput(Math.min(pasted.length, 5));
	};

	const handleVerify = async () => {
		const otp = digits.join("");
		setError("");

		if (otp.length !== 6) {
			setError("Please enter the complete 6-digit code");
			return;
		}

		setVerifying(true);

		try {
			await service.verifyOtp(email, otp);
			setSuccess("Account verified successfully. Redirecting to login...");
			setTimeout(() => {
				navigate(role === "partner" ? "/partner/login" : "/login", {
					replace: true,
				});
			}, 1500);
		} catch (err) {
			setError(extractErrorMessage(err));
			setDigits(["", "", "", "", "", ""]);
			focusInput(0);
		} finally {
			setVerifying(false);
		}
	};

	const handleResend = async () => {
		if (cooldown > 0 || resending) return;

		setError("");
		setResending(true);

		try {
			const data = await service.resendOtp(email);
			setCooldown(data?.retryAfter ?? 60);
			setDigits(["", "", "", "", "", ""]);
			focusInput(0);
		} catch (err) {
			if (err.response?.status === 429) {
				setCooldown(err.response.data?.retryAfter ?? 60);
			}
			setError(extractErrorMessage(err));
		} finally {
			setResending(false);
		}
	};

	if (!email) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#0A0A0D] flex items-start sm:items-center justify-center px-4 py-10 relative overflow-x-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-[#0A0A0D] to-blue-900/20" />

			<div className="absolute top-20 left-10 w-56 h-56 bg-violet-600/20 rounded-full blur-[120px]" />
			<div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[120px]" />

			<div className="relative z-10 w-full max-w-md bg-[#111118]/95 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-violet-900/30">
				<Link
					to={backLink}
					className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center hover:bg-violet-500/25 transition-all duration-300"
				>
					<ArrowLeft size={17} className="text-violet-200" />
				</Link>

				<div className="flex justify-center mt-5">
					<div className="w-16 h-16 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
						<ShieldCheck size={30} className="text-violet-300" />
					</div>
				</div>

				<h1 className="mt-5 text-3xl font-bold text-white text-center">
					Verify OTP
				</h1>

				<p className="text-gray-400 text-center mt-2 mb-6">
					Enter the 6-digit verification code sent to{" "}
					<span className="text-violet-300">{email}</span>
				</p>

				<div className="flex justify-between gap-1 sm:gap-2" onPaste={handlePaste}>
					{digits.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							disabled={verifying}
							className="w-9 h-11 sm:w-12 sm:h-14 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white text-center text-lg sm:text-xl font-bold focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
						/>
					))}
				</div>

				<FormError message={success || error} type={success ? "success" : "error"} />

				<button
					type="button"
					onClick={handleVerify}
					disabled={verifying || !!success}
					className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{verifying && <Loader2 size={18} className="animate-spin" />}
					{verifying ? "Verifying..." : "Verify OTP"}
				</button>

				<div className="text-center mt-6">
					<p className="text-gray-500 text-sm">Didn't receive the code?</p>

					<button
						type="button"
						onClick={handleResend}
						disabled={cooldown > 0 || resending || !!success}
						className="mt-2 text-violet-300 hover:text-white font-semibold transition-colors disabled:text-gray-600 disabled:hover:text-gray-600 disabled:cursor-not-allowed inline-flex items-center gap-2"
					>
						{resending && <Loader2 size={14} className="animate-spin" />}
						{cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
					</button>
				</div>
			</div>
		</div>
	);
}
