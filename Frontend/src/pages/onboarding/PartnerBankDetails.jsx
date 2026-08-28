import {
	ArrowLeft,
	CreditCard,
	UserRound,
	Hash,
	Phone,
	ShieldCheck,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../services/partnerServices";
import { extractErrorMessage } from "../../utils/errorHandler";
import FormError from "../../components/FormError";

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
		<div className="h-screen bg-[#08080C] flex items-center justify-center px-4 overflow-hidden relative">
			<div className="absolute inset-0 bg-linear-to-br from-violet-900/10 via-[#08080C] to-blue-900/10" />

			<div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-violet-600/10 blur-[100px]" />
			<div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-blue-600/10 blur-[100px]" />

			<div className="relative z-10 w-full max-w-107.5">
				<div className="flex items-center justify-between px-1 mb-2">
					<div>
						<p className="text-[10px] uppercase tracking-[0.18em] text-violet-400 font-semibold">
							Partner Onboarding
						</p>

						<p className="text-[11px] text-gray-500 mt-0.5">
							Complete your profile
						</p>
					</div>

					<span className="text-[11px] text-gray-400">
						3 <span className="text-gray-600">/</span> 3
					</span>
				</div>

				<div className="h-0.75 rounded-full bg-[#181820] overflow-hidden mb-2">
					<div className="h-full w-full rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
				</div>

				<div className="bg-[#111118]/95 backdrop-blur-2xl border border-white/6 rounded-[20px] px-5 py-4 shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
					<Link
						to="/onboarding/docs"
						className="w-7 h-7 rounded-full bg-white/4 border border-white/8 flex items-center justify-center hover:bg-violet-500/10 transition-all"
					>
						<ArrowLeft size={14} className="text-gray-300" />
					</Link>

					<div className="flex items-start justify-between gap-3 mt-3">
						<div>
							<p className="text-[11px] text-violet-400 font-medium">Step 3</p>

							<h1 className="text-[24px] font-bold text-white leading-tight mt-0.5">
								Bank Details
							</h1>

							<p className="text-[12px] text-gray-500 mt-1">
								Add your bank details to receive your RideX earnings.
							</p>
						</div>

						<div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
							<ShieldCheck size={18} className="text-violet-300" />
						</div>
					</div>

					<div className="mt-4 space-y-2.5">
						<div>
							<label className="block text-[11px] font-semibold text-gray-300 mb-1">
								Account Holder Name
							</label>

							<div className="relative">
								<UserRound
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
								/>

								<input
									type="text"
									value={accountHolderName}
									onChange={(e) => setAccountHolderName(e.target.value)}
									placeholder="Enter account holder name"
									className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
								/>
							</div>
						</div>

						<div>
							<label className="block text-[11px] font-semibold text-gray-300 mb-1">
								Account Number
							</label>

							<div className="relative">
								<CreditCard
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
								/>

								<input
									type="text"
									inputMode="numeric"
									value={accountNumber}
									onChange={(e) => setAccountNumber(e.target.value)}
									placeholder="Enter account number"
									className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
								/>
							</div>
						</div>

						<div>
							<label className="block text-[11px] font-semibold text-gray-300 mb-1">
								IFSC Code
							</label>

							<div className="relative">
								<Hash
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
								/>

								<input
									type="text"
									value={ifscCode}
									onChange={(e) => setIfscCode(e.target.value)}
									placeholder="e.g. SBIN0001234"
									className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 uppercase focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
								/>
							</div>
						</div>

						<div>
							<label className="block text-[11px] font-semibold text-gray-300 mb-1">
								Phone Number
							</label>

							<div className="relative">
								<Phone
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
								/>

								<input
									type="tel"
									inputMode="numeric"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder="Enter phone number"
									className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
								/>
							</div>
						</div>

						<div>
							<label className="flex items-center justify-between text-[11px] font-semibold text-gray-300 mb-1">
								<span>UPI ID</span>
								<span className="text-[10px] text-gray-500 font-normal">
									Optional
								</span>
							</label>

							<div className="relative">
								<CreditCard
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
								/>

								<input
									type="text"
									value={upiId}
									onChange={(e) => setUpiId(e.target.value)}
									placeholder="e.g. name@upi"
									className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
								/>
							</div>
						</div>
					</div>

					<FormError message={error} />

					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="w-full mt-2 py-2.5 rounded-xl text-[12px] font-semibold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
					>
						{loading && <Loader2 size={14} className="animate-spin" />}
						Complete Registration
					</button>

					<div className="flex items-center justify-center gap-1.5 mt-3">
						<div className="w-7 h-0.75 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
						<div className="w-7 h-0.75 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
						<div className="w-7 h-0.75 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
					</div>
				</div>
			</div>
		</div>
	);
}
