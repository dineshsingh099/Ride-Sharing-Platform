import {
	ArrowLeft,
	CreditCard,
	UserRound,
	Hash,
	Phone,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../../services/partnerServices";
import { extractErrorMessage } from "../../../utils/errorHandler";
import FormError from "../../../components/common/FormError";

export default function PartnerBankDetails() {
	const navigate = useNavigate();
	const [accountHolderName, setAccountHolderName] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [ifscCode, setIfscCode] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [upiId, setUpiId] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		setError("");

		if (
			!accountHolderName.trim() ||
			!accountNumber.trim() ||
			!ifscCode.trim() ||
			!phoneNumber.trim()
		) {
			setError("Please fill in all required fields");
			return;
		}

		setLoading(true);

		try {
			await partnerService.submitBankDetails({
				accountHolderName: accountHolderName.trim(),
				accountNumber: accountNumber.trim(),
				ifscCode: ifscCode.trim().toUpperCase(),
				phoneNumber: phoneNumber.trim(),
				upiId: upiId.trim() || undefined,
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
						<div className="relative">
							<UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="text"
								value={accountHolderName}
								onChange={(e) => setAccountHolderName(e.target.value)}
								placeholder="Account Holder Name"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
						</div>

						<div className="relative">
							<CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="text"
								inputMode="numeric"
								value={accountNumber}
								onChange={(e) => setAccountNumber(e.target.value)}
								placeholder="Account Number"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
						</div>

						<div className="relative">
							<Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="text"
								value={ifscCode}
								onChange={(e) => setIfscCode(e.target.value)}
								placeholder="IFSC Code (e.g. SBIN0001234)"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 uppercase focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
						</div>

						<div className="relative">
							<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="tel"
								inputMode="numeric"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								placeholder="Phone Number"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
						</div>

						<div className="relative">
							<CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="text"
								value={upiId}
								onChange={(e) => setUpiId(e.target.value)}
								placeholder="UPI ID (optional, e.g. name@upi)"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
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
