import { useRef } from "react";
import {
	Bike,
	Car,
	Bus,
	Package,
	Truck,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

const services = [
	{
		icon: Bike,
		title: "Bike",
		desc: "Quick and affordable rides through traffic with ease.",
	},
	{
		icon: Car,
		title: "Car",
		desc: "Comfortable rides for daily commutes and travel.",
	},
	{
		icon: Truck,
		title: "Auto Rickshaw",
		desc: "Budget friendly rides for short city distances.",
	},
	{
		icon: Car,
		title: "SUV Car",
		desc: "Spacious rides for families and group travel.",
	},
	{
		icon: Bus,
		title: "Bus",
		desc: "Shared rides for longer routes at low cost.",
	},
	{
		icon: Package,
		title: "Parcel",
		desc: "Fast and secure delivery for your packages.",
	},
];

export default function Services() {
	const scrollRef = useRef(null);

	const scroll = (dir) => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: dir === "left" ? -300 : 300,
				behavior: "smooth",
			});
		}
	};

	return (
		<section
			id="services"
			className="relative w-full bg-[#0A0A0D] py-24 px-6 overflow-hidden"
		>
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

			<div className="relative max-w-6xl mx-auto">
				<div className="flex items-end justify-between mb-12 flex-wrap gap-6 mt-10">
					<div>
						<span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-violet-200 bg-violet-500/15 border border-violet-400/30">
							What we offer
						</span>
						<h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
							Our{" "}
							<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
								Services
							</span>
						</h2>
						<p className="mt-3 text-gray-400 max-w-md">
							Choose from a range of rides built for every need, distance and
							budget.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							onClick={() => scroll("left")}
							className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-violet-500/20 hover:border-violet-400/40 transition-all duration-300"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button
							onClick={() => scroll("right")}
							className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-violet-500/20 hover:border-violet-400/40 transition-all duration-300"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
					style={{ scrollbarWidth: "none" }}
				>
					{services.map((service, i) => {
						const Icon = service.icon;
						return (
							<div
								key={i}
								className="group relative snap-start shrink-0 w-65 rounded-2xl p-7 bg-linear-to-b from-white/6 to-white/2 border border-white/10 hover:border-violet-400/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20"
							>
								<div className="absolute inset-0 rounded-2xl bg-linear-to-b from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/10 group-hover:to-transparent transition-all duration-300" />

								<div className="relative">
									<div className="w-14 h-14 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-blue-500/20 border border-violet-400/30 group-hover:from-violet-500 group-hover:to-blue-500 group-hover:border-transparent transition-all duration-300 group-hover:scale-110">
										<Icon className="w-7 h-7 text-violet-300 group-hover:text-white transition-colors duration-300" />
									</div>

									<h3 className="mt-6 text-lg font-bold text-white">
										{service.title}
									</h3>
									<p className="mt-2 text-sm text-gray-400 leading-relaxed">
										{service.desc}
									</p>

									<div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-violet-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
										Book now
										<ChevronRight className="w-4 h-4" />
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
