import {
	ArrowLeft,
	Upload,
	FileText,
	ShieldCheck,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../services/partnerServices";
import { extractErrorMessage } from "../../utils/errorHandler";
import FormError from "../../components/FormError";

const documents = [
	{
		id: "license",
		name: "Driving License",
		label: "Upload Driving License",
	},
	{
		id: "rc",
		name: "Vehicle RC",
		label: "Upload Vehicle RC",
	},
	{
		id: "insurance",
		name: "Vehicle Insurance",
		label: "Upload Vehicle Insurance",
	},
	{
		id: "aadhar",
		name: "Aadhaar / PAN",
		label: "Upload Identity Proof",
	},
];

export default function PartnerDocs() {
	const navigate = useNavigate();
	const [files, setFiles] = useState({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleFileChange = (id, file) => {
		if (!file) return;

		setFiles((prev) => ({
			...prev,
			[id]: file,
		}));
	};

	const handleContinue = async () => {
		setError("");

		const missing = documents.filter((doc) => !files[doc.id]);
		if (missing.length > 0) {
			setError(`Please upload: ${missing.map((d) => d.name).join(", ")}`);
			return;
		}

		setLoading(true);

		try {
			await partnerService.submitDocuments({
				license: files.license,
				rc: files.rc,
				insurance: files.insurance,
				aadhar: files.aadhar,
			});
			navigate("/onboarding/bank");
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
						2 <span className="text-gray-600">/</span> 3
					</span>
				</div>

				<div className="h-0.75 rounded-full bg-[#181820] overflow-hidden mb-2">
					<div className="h-full w-2/3 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
				</div>

				<div className="bg-[#111118]/95 backdrop-blur-2xl border border-white/6 rounded-[20px] px-5 py-4 shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
					<Link
						to="/onboarding/vehicle"
						className="w-7 h-7 rounded-full bg-white/4 border border-white/8 flex items-center justify-center hover:bg-violet-500/10 transition-all"
					>
						<ArrowLeft size={14} className="text-gray-300" />
					</Link>

					<div className="flex items-start justify-between gap-3 mt-3">
						<div>
							<p className="text-[11px] text-violet-400 font-medium">Step 2</p>

							<h1 className="text-[24px] font-bold text-white leading-tight mt-0.5">
								Documents
							</h1>

							<p className="text-[12px] text-gray-500 mt-1">
								Upload your documents for verification.
							</p>
						</div>

						<div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
							<ShieldCheck size={18} className="text-violet-300" />
						</div>
					</div>

					<div className="mt-4 space-y-2.5">
						{documents.map((doc) => {
							const selectedFile = files[doc.id];

							return (
								<label
									key={doc.id}
									className={`group flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
										selectedFile
											? "bg-violet-500/8 border-violet-400/40"
											: "bg-[#17171F] border-white/[0.07] hover:border-violet-400/30 hover:bg-violet-500/4"
									}`}
								>
									<div className="flex items-center gap-3 min-w-0">
										<div
											className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${
												selectedFile
													? "bg-violet-500/20"
													: "bg-violet-500/8"
											}`}
										>
											{selectedFile ? (
												<CheckCircle2 size={18} className="text-violet-300" />
											) : (
												<FileText size={18} className="text-violet-300" />
											)}
										</div>

										<div className="min-w-0">
											<p className="text-[12px] font-semibold text-gray-200">
												{doc.name}
											</p>

											<p className="text-[10px] text-gray-500 truncate mt-0.5">
												{selectedFile ? selectedFile.name : doc.label}
											</p>
										</div>
									</div>

									<div className="shrink-0 w-8 h-8 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-400/30 transition-all">
										<Upload size={15} className="text-violet-300" />
									</div>

									<input
										type="file"
										accept=".jpg,.jpeg,.png,.pdf"
										className="hidden"
										onChange={(e) =>
											handleFileChange(doc.id, e.target.files?.[0])
										}
									/>
								</label>
							);
						})}
					</div>

					<p className="text-[10px] text-gray-600 mt-3">
						Supported formats: JPG, PNG, PDF
					</p>

					<FormError message={error} />

					<button
						type="button"
						onClick={handleContinue}
						disabled={loading}
						className="w-full mt-2 py-2.5 rounded-xl text-[12px] font-semibold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
					>
						{loading && <Loader2 size={14} className="animate-spin" />}
						Continue
					</button>

					<div className="flex items-center justify-center gap-1.5 mt-3">
						<div className="w-7 h-0.75 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
						<div className="w-7 h-0.75 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
						<div className="w-7 h-0.75 rounded-full bg-[#282832]" />
					</div>
				</div>
			</div>
		</div>
	);
}
