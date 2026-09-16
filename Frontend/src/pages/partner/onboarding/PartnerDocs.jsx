import {
	ArrowLeft,
	Upload,
	FileText,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../../services/partnerServices";
import { extractErrorMessage } from "../../../utils/errorHandler";
import FormError from "../../../components/common/FormError";

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
		<div className="min-h-screen bg-[#0A0A0D] flex items-start sm:items-center justify-center px-4 py-10 relative overflow-x-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-[#0A0A0D] to-blue-900/20" />

			<div className="absolute top-20 left-10 w-56 h-56 bg-violet-600/20 rounded-full blur-[120px]" />
			<div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[120px]" />

			<div className="relative z-10 w-full max-w-md">
				<div className="bg-[#111118]/95 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-7 shadow-2xl shadow-violet-900/30">
					<Link
						to="/onboarding/vehicle"
						className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center hover:bg-violet-500/25 transition-all duration-300"
					>
						<ArrowLeft size={17} className="text-violet-200" />
					</Link>

					<h1 className="mt-5 text-3xl font-bold text-white">Documents</h1>

					<p className="text-gray-400 mt-2 mb-6">
						Upload your documents for verification.
					</p>

					<div className="space-y-3">
						{documents.map((doc) => {
							const selectedFile = files[doc.id];

							return (
								<label
									key={doc.id}
									className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
										selectedFile
											? "bg-violet-500/10 border-violet-400/50"
											: "bg-[#1A1A24] border-violet-500/20 hover:border-violet-400/40"
									}`}
								>
									<div className="flex items-center gap-3 min-w-0">
										<div
											className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
												selectedFile ? "bg-violet-500/20" : "bg-violet-500/10"
											}`}
										>
											{selectedFile ? (
												<CheckCircle2 size={19} className="text-violet-300" />
											) : (
												<FileText size={19} className="text-violet-300" />
											)}
										</div>

										<div className="min-w-0">
											<p className="text-sm font-semibold text-gray-200">
												{doc.name}
											</p>

											<p className="text-xs text-gray-500 truncate mt-0.5">
												{selectedFile ? selectedFile.name : doc.label}
											</p>
										</div>
									</div>

									<div className="shrink-0 w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-400/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-all">
										<Upload size={16} className="text-violet-300" />
									</div>

									<input
										type="file"
										accept=".jpg,.jpeg,.png,.pdf"
										disabled={loading}
										className="hidden"
										onChange={(e) =>
											handleFileChange(doc.id, e.target.files?.[0])
										}
									/>
								</label>
							);
						})}
					</div>

					<p className="text-xs text-gray-500 mt-3">
						Supported formats: JPG, PNG, PDF
					</p>

					<FormError message={error} />

					<button
						type="button"
						onClick={handleContinue}
						disabled={loading}
						className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{loading && <Loader2 size={18} className="animate-spin" />}
						{loading ? "Uploading..." : "Continue"}
					</button>
				</div>
			</div>
		</div>
	);
}
