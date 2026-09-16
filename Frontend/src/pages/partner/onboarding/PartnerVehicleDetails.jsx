import {
	ArrowLeft,
	Bike,
	Car,
	BusFront,
	Truck,
	Check,
	Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { partnerService } from "../../../services/partnerServices";
import { extractErrorMessage } from "../../../utils/errorHandler";
import FormError from "../../../components/common/FormError";

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
		<div className="min-h-screen bg-[#0A0A0D] flex items-start sm:items-center justify-center px-4 py-10 relative overflow-x-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-[#0A0A0D] to-blue-900/20" />

			<div className="absolute top-20 left-10 w-56 h-56 bg-violet-600/20 rounded-full blur-[120px]" />
			<div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[120px]" />

			<div className="relative z-10 w-full max-w-md">
				<div className="bg-[#111118]/95 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-7 shadow-2xl shadow-violet-900/30">
					<Link
						to="/partner/signup"
						className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center hover:bg-violet-500/25 transition-all duration-300"
					>
						<ArrowLeft size={17} className="text-violet-200" />
					</Link>

					<h1 className="mt-5 text-3xl font-bold text-white">
						Vehicle Details
					</h1>

					<p className="text-gray-400 mt-2 mb-6">
						Tell us about the vehicle you'll be driving with RideX.
					</p>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm font-semibold text-gray-200">
								Vehicle Type
							</label>

							{selectedVehicle && (
								<span className="text-xs text-violet-300">
									{vehicleTypes.find((v) => v.value === selectedVehicle)?.name}
								</span>
							)}
						</div>

						<div className="grid grid-cols-3 gap-2.5">
							{vehicleTypes.map((vehicle) => {
								const Icon = vehicle.icon;
								const isSelected = selectedVehicle === vehicle.value;

								return (
									<button
										key={vehicle.value}
										type="button"
										onClick={() => setSelectedVehicle(vehicle.value)}
										disabled={loading}
										className={`relative h-20 rounded-xl border transition-all duration-300 disabled:opacity-50 ${
											isSelected
												? "bg-violet-500/10 border-violet-400/60"
												: "bg-[#1A1A24] border-violet-500/20 hover:border-violet-400/40"
										}`}
									>
										{isSelected && (
											<div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-linear-to-r from-violet-500 to-blue-500 flex items-center justify-center">
												<Check size={10} className="text-white" />
											</div>
										)}

										<div className="flex h-full flex-col items-center justify-center gap-1.5">
											<div
												className={`w-8 h-8 rounded-lg flex items-center justify-center ${
													isSelected ? "bg-violet-500/20" : "bg-violet-500/10"
												}`}
											>
												<Icon
													size={18}
													strokeWidth={1.8}
													className="text-violet-300"
												/>
											</div>

											<span className="text-xs font-semibold text-gray-300">
												{vehicle.name}
											</span>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					<div className="mt-4 space-y-4">
						<div className="relative">
							<Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="text"
								value={vehicleModel}
								onChange={(e) => setVehicleModel(e.target.value)}
								placeholder="Vehicle Model (e.g. Swift, Activa, Innova)"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
						</div>

						<div className="relative">
							<Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
							<input
								type="text"
								value={number}
								onChange={(e) => setNumber(e.target.value)}
								placeholder="Vehicle Number (e.g. RJ 20 AB 1234)"
								disabled={loading}
								className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white placeholder-gray-500 uppercase focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
							/>
						</div>
					</div>

					<FormError message={error} />

					<button
						type="button"
						onClick={handleContinue}
						disabled={loading}
						className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{loading && <Loader2 size={18} className="animate-spin" />}
						{loading ? "Saving..." : "Continue"}
					</button>
				</div>
			</div>
		</div>
	);
}
