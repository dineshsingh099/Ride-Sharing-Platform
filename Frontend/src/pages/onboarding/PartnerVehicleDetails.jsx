import {
	ArrowLeft,
	Bike,
	Car,
	BusFront,
	Truck,
	ShieldCheck,
	Check,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../services/partnerServices";
import { extractErrorMessage } from "../../utils/errorHandler";
import FormError from "../../components/FormError";

const vehicleTypes = [
	{ name: "Bike", value: "bike", icon: Bike },
	{ name: "Car", value: "car", icon: Car },
	{ name: "Auto Rickshaw", value: "auto", icon: Truck },
	{ name: "SUV", value: "suv", icon: Car },
	{ name: "Bus", value: "Bus", icon: BusFront },
];

export default function PartnerVehicleDetails() {
	const navigate = useNavigate();
	const [selectedVehicle, setSelectedVehicle] = useState("");
	const [vehicleModel, setVehicleModel] = useState("");
	const [number, setNumber] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleContinue = async () => {
		setError("");

		if (!selectedVehicle) {
			setError("Please select a vehicle type");
			return;
		}

		if (!vehicleModel.trim() || !number.trim()) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);

		try {
			await partnerService.submitVehicleDetails({
				type: selectedVehicle,
				vehicleModel: vehicleModel.trim(),
				number: number.trim().toUpperCase(),
			});
			navigate("/onboarding/docs");
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
						1 <span className="text-gray-600">/</span> 3
					</span>
				</div>

				<div className="h-0.75 rounded-full bg-[#181820] overflow-hidden mb-2">
					<div className="h-full w-1/3 rounded-full bg-linear-to-r from-violet-500 to-blue-500" />
				</div>

				<div className="bg-[#111118]/95 backdrop-blur-2xl border border-white/6 rounded-[20px] px-5 py-4 shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
					<Link
						to="/partner/signup"
						className="w-7 h-7 rounded-full bg-white/4 border border-white/8 flex items-center justify-center hover:bg-violet-500/10 transition-all"
					>
						<ArrowLeft size={14} className="text-gray-300" />
					</Link>

					<div className="flex items-start justify-between gap-3 mt-3">
						<div>
							<p className="text-[11px] text-violet-400 font-medium">Step 1</p>

							<h1 className="text-[24px] font-bold text-white leading-tight mt-0.5">
								Vehicle Details
							</h1>

							<p className="text-[12px] text-gray-500 mt-1">
								Enter your vehicle information.
							</p>
						</div>

						<div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
							<ShieldCheck size={18} className="text-violet-300" />
						</div>
					</div>

					<div className="mt-4">
						<div className="flex items-center justify-between mb-2">
							<label className="text-[12px] font-semibold text-gray-200">
								Vehicle Type
							</label>

							{selectedVehicle && (
								<span className="text-[10px] text-violet-300">
									{
										vehicleTypes.find((v) => v.value === selectedVehicle)
											?.name
									}
								</span>
							)}
						</div>

						<div className="grid grid-cols-3 gap-2">
							{vehicleTypes.map((vehicle) => {
								const Icon = vehicle.icon;
								const isSelected = selectedVehicle === vehicle.value;

								return (
									<button
										key={vehicle.value}
										type="button"
										onClick={() => setSelectedVehicle(vehicle.value)}
										className={`relative h-17 rounded-xl border transition-all duration-300 ${
											isSelected
												? "bg-violet-500/10 border-violet-400/60"
												: "bg-[#17171F] border-white/6 hover:border-violet-400/30"
										}`}
									>
										{isSelected && (
											<div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-linear-to-r from-violet-500 to-blue-500 flex items-center justify-center">
												<Check size={8} className="text-white" />
											</div>
										)}

										<div className="flex h-full flex-col items-center justify-center gap-1">
											<div
												className={`w-7 h-7 rounded-lg flex items-center justify-center ${
													isSelected
														? "bg-violet-500/20"
														: "bg-violet-500/8"
												}`}
											>
												<Icon
													size={17}
													strokeWidth={1.8}
													className="text-violet-300"
												/>
											</div>

											<span className="text-[10px] font-semibold text-gray-300">
												{vehicle.name}
											</span>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					<div className="mt-4 space-y-2.5">
						<div>
							<label className="block text-[11px] font-semibold text-gray-300 mb-1">
								Vehicle Model
							</label>

							<input
								type="text"
								value={vehicleModel}
								onChange={(e) => setVehicleModel(e.target.value)}
								placeholder="e.g. Swift, Activa, Innova"
								className="w-full px-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
							/>
						</div>

						<div>
							<label className="block text-[11px] font-semibold text-gray-300 mb-1">
								Vehicle Number
							</label>

							<input
								type="text"
								value={number}
								onChange={(e) => setNumber(e.target.value)}
								placeholder="e.g. RJ 20 AB 1234"
								className="w-full px-3 py-2.5 rounded-xl bg-[#17171F] border border-white/[0.07] text-[12px] text-white placeholder:text-gray-600 uppercase focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/8 transition-all"
							/>
						</div>
					</div>

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
						<div className="w-7 h-0.75 rounded-full bg-[#282832]" />
						<div className="w-7 h-0.75 rounded-full bg-[#282832]" />
					</div>
				</div>
			</div>
		</div>
	);
}
