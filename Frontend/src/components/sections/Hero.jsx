import { ChevronDown } from "lucide-react";

export default function Hero() {
	const handleScrollDown = () => {
		const servicesSection = document.getElementById("about");
		if (servicesSection) {
			servicesSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div
			id="home"
			className="relative w-full min-h-screen overflow-hidden bg-[#0A0A0D]"
		>
			<div
				className="absolute inset-0 scale-110 bg-cover bg-center blur-sm"
				style={{ backgroundImage: `url(/hero.png)` }}
			/>

			<div className="absolute inset-0 bg-linear-to-b from-[#0A0A0D]/80 via-[#0A0A0D]/70 to-[#0A0A0D]/95" />

			<div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6 pt-0 pb-16 mt-5">
				<span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-violet-200 bg-violet-500/15 border border-violet-400/30">
					Your ride, on your time
				</span>

				<h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-3xl">
					Move through the city with{" "}
					<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
						RideX
					</span>
				</h1>

				<p className="mt-5 text-gray-300 text-base sm:text-lg max-w-xl">
					Fast, safe and reliable rides at the tap of a button. Track your
					driver in real time and get where you need to be.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
					<button className="relative overflow-hidden group/hero w-full sm:w-auto px-7 py-3 rounded-xl text-[15px] font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 ring-1 ring-white/10 transition-all duration-300">
						<span className="relative z-10">Book a Ride</span>
						<span className="absolute inset-0 -translate-x-full group-hover/hero:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12" />
					</button>

					<button className="w-full sm:w-auto px-7 py-3 rounded-xl text-[15px] font-semibold text-violet-100 bg-violet-500/15 border border-violet-400/40 hover:bg-violet-500/25 hover:border-violet-400/70 hover:text-white transition-all duration-300">
						Become a Partner
					</button>
				</div>
			</div>

			<button
				onClick={handleScrollDown}
				aria-label="Scroll to services"
				className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
			>
				<ChevronDown className="w-7 h-7 text-violet-300/80" />
			</button>
		</div>
	);
}
