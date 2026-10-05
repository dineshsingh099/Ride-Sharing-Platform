import {
	ArrowLeft,
	CreditCard,
	UserRound,
	Hash,
	Phone,
	AtSign,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../../services/partnerServices";
import { extractErrorMessage } from "../../../utils/errorHandler";
import FormError from "../../../components/common/FormError";

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_REGEX = /^\d{9,18}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;

const inputClass =
	"w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50";

export default function PartnerBankDetails() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		accountHolderName: "",
		accountNumber: "",
		ifscCode: "",
		phoneNumber: "",
		upiId: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const name = form.accountHolderName.trim();
	const account = form.accountNumber.trim();
	const ifsc = form.ifscCode.trim().toUpperCase();
	const phone = form.phoneNumber.trim();
	const upi = form.upiId.trim();

	const fieldErrors = {
		accountHolderName:
			name.length >= 3
				? ""
				: "Enter the account holder name (min 3 characters)",
		accountNumber: ACCOUNT_REGEX.test(account)
			? ""
			: "Account number must be 9 to 18 digits",
		ifscCode: IFSC_REGEX.test(ifsc)
			? ""
			: "Enter a valid IFSC code (e.g. SBIN0001234)",
		phoneNumber: PHONE_REGEX.test(phone)
			? ""
			: "Enter a valid 10 digit mobile number",
		upiId:
			!upi || UPI_REGEX.test(upi) ? "" : "Enter a valid UPI ID (e.g. name@upi)",
	};

	const canSubmit = Object.values(fieldErrors).every((msg) => !msg);

	const updateField = (key, value) => {
		setError("");
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const showError = (key) => form[key].trim() !== "" && fieldErrors[key];

	const handleSubmit = async () => {
		if (loading) return;
		setError("");

		if (!canSubmit) {
			const hasEmptyRequired = !name || !account || !ifsc || !phone;
			setError(
				hasEmptyRequired
					? "Please fill in all required fields"
					: "Please correct the errors above",
			);
			return;
		}

		setLoading(true);

		try {
			await partnerService.submitBankDetails({
				accountHolderName: name,
				accountNumber: account,
				ifscCode: ifsc,
				phoneNumber: phone,
				upiId: upi || undefined,
			});
			navigate("/partner/dashboard", { replace: true });
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

			<div className="relative z-10 w-full max-w-md">
				<div className="bg-[#111118]/95 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-7 shadow-2xl shadow-violet-900/30">
					<Link
						to="/onboarding/docs"
						className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center hover:bg-violet-500/25 transition-all duration-300"
					>
						<ArrowLeft size={17} className="text-violet-200" />
					</Link>

					<h1 className="mt-5 text-3xl font-bold text-white">Bank Details</h1>

					<p className="text-gray-400 mt-2 mb-6">
						Add your bank details to receive your RideX earnings.
					</p>

					<div className="space-y-4">
						<div>
							<div className="relative">
								<UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
								<input
									type="text"
									value={form.accountHolderName}
									onChange={(e) =>
										updateField("accountHolderName", e.target.value)
									}
									placeholder="Account Holder Name"
									disabled={loading}
									className={inputClass}
								/>
							</div>
							{showError("accountHolderName") && (
								<p className="mt-1.5 text-xs text-red-400">
									{fieldErrors.accountHolderName}
								</p>
							)}
						</div>

						<div>
							<div className="relative">
								<CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
								<input
									type="text"
									inputMode="numeric"
									maxLength={18}
									value={form.accountNumber}
									onChange={(e) =>
										updateField(
											"accountNumber",
											e.target.value.replace(/\D/g, ""),
										)
									}
									placeholder="Account Number"
									disabled={loading}
									className={inputClass}
								/>
							</div>
							{showError("accountNumber") && (
								<p className="mt-1.5 text-xs text-red-400">
									{fieldErrors.accountNumber}
								</p>
							)}
						</div>

						<div>
							<div className="relative">
								<Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
								<input
									type="text"
									maxLength={11}
									value={form.ifscCode}
									onChange={(e) =>
										updateField(
											"ifscCode",
											e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
										)
									}
									placeholder="IFSC Code (e.g. SBIN0001234)"
									disabled={loading}
									className={`${inputClass} uppercase placeholder:normal-case`}
								/>
							</div>
							{showError("ifscCode") && (
								<p className="mt-1.5 text-xs text-red-400">
									{fieldErrors.ifscCode}
								</p>
							)}
						</div>

						<div>
							<div className="relative">
								<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
								<input
									type="tel"
									inputMode="numeric"
									maxLength={10}
									value={form.phoneNumber}
									onChange={(e) =>
										updateField(
											"phoneNumber",
											e.target.value.replace(/\D/g, ""),
										)
									}
									placeholder="Phone Number"
									disabled={loading}
									className={inputClass}
								/>
							</div>
							{showError("phoneNumber") && (
								<p className="mt-1.5 text-xs text-red-400">
									{fieldErrors.phoneNumber}
								</p>
							)}
						</div>

						<div>
							<div className="relative">
								<AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
								<input
									type="text"
									value={form.upiId}
									onChange={(e) =>
										updateField("upiId", e.target.value.replace(/\s/g, ""))
									}
									placeholder="UPI ID (optional, e.g. name@upi)"
									disabled={loading}
									className={inputClass}
								/>
							</div>
							{showError("upiId") && (
								<p className="mt-1.5 text-xs text-red-400">
									{fieldErrors.upiId}
								</p>
							)}
						</div>
					</div>

					<FormError message={error} />

					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{loading && <Loader2 size={18} className="animate-spin" />}
						{loading ? "Submitting..." : "Complete Registration"}
					</button>
				</div>
			</div>
		</div>
	);
}
