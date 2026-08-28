import { MapPin, Car, Navigation, CheckCircle2 } from "lucide-react";

const steps = [
	{
		icon: MapPin,
		step: "01",
		title: "Set Your Location",
		desc: "Enter your pickup point and destination in seconds. Choose the ride type that fits your need.",
	},
	{
		icon: Car,
		step: "02",
		title: "Get Matched Instantly",
		desc: "We connect you with the nearest available driver so you don't have to wait around.",
	},
	{
		icon: Navigation,
		step: "03",
		title: "Track in Real Time",
		desc: "Follow your driver live on the map and know exactly when they'll arrive.",
	},
	{
		icon: CheckCircle2,
		step: "04",
		title: "Arrive & Relax",
		desc: "Sit back, enjoy a safe ride, and pay seamlessly through the app when you reach.",
	},
];

export default function HowItWorks() {
	return (
		<section
			id="how-it-works"
			className="relative w-full bg-[#0A0A0D] py-24 px-6 overflow-hidden"
		>
			<div className="absolute bottom-0 right-1/2 translate-x-1/2 w-150 h-75 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

			<div className="relative max-w-6xl mx-auto">
				<div className="text-center mb-16 mt-10">
					<span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-violet-200 bg-violet-500/15 border border-violet-400/30">
						Simple process
					</span>
					<h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
						How{" "}
						<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
							RideX
						</span>{" "}
						Works
					</h2>
					<p className="mt-3 text-gray-400 max-w-lg mx-auto">
						Getting a ride has never been easier. Just four simple steps between
						you and your destination.
					</p>
				</div>

				<div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

					{steps.map((item, i) => {
						const Icon = item.icon;
						return (
							<div
								key={i}
								className="group relative flex flex-col items-center text-center"
							>
								<div className="relative">
									<div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-linear-to-b from-white/6 to-white/2 border border-white/10 group-hover:border-violet-400/40 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-violet-500/20">
										<Icon className="w-8 h-8 text-violet-300 group-hover:text-violet-200 transition-colors duration-300" />
									</div>
									<span className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-blue-500 text-white text-xs font-bold shadow-md shadow-violet-500/30 ring-2 ring-[#0A0A0D]">
										{item.step}
									</span>
								</div>

								<h3 className="mt-6 text-lg font-bold text-white">
									{item.title}
								</h3>
								<p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-60">
									{item.desc}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
