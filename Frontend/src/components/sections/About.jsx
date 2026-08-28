import { Shield, Zap, Users, Award } from "lucide-react";

const values = [
	{
		icon: Shield,
		title: "Safety First",
		desc: "Every driver is background-verified and every ride is tracked in real time.",
	},
	{
		icon: Zap,
		title: "Fast & Reliable",
		desc: "Get matched with a nearby driver in seconds, not minutes.",
	},
	{
		icon: Users,
		title: "Built for People",
		desc: "Designed around real commutes, not just algorithms and averages.",
	},
];

const highlights = [
	"Verified drivers only",
	"Real-time ride tracking",
	"Transparent, upfront pricing",
	"24/7 rider support",
];

export default function About() {
	return (
		<section
			id="about"
			className="relative w-full bg-[#0A0A0D] py-24 px-6 overflow-hidden"
		>
			<div className="absolute top-1/3 right-0 w-150 h-75 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

			<div className="relative max-w-6xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-10">
					<div>
						<span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-violet-200 bg-violet-500/15 border border-violet-400/30">
							About RideX
						</span>

						<h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
							Built to move your{" "}
							<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
								city forward
							</span>
						</h2>

						<p className="mt-5 text-gray-400 leading-relaxed">
							RideX started with a simple idea: getting around the city
							shouldn't be complicated. What began as a small team solving their
							own commute problems has grown into a platform built for everyday
							riders.
						</p>
						<p className="mt-4 text-gray-400 leading-relaxed">
							From bikes to buses to parcel delivery, we're building the
							fastest, safest way to move people and things across town — one
							ride at a time.
						</p>

						<div className="mt-8 grid grid-cols-2 gap-4">
							{highlights.map((item) => (
								<div
									key={item}
									className="flex items-center gap-2.5 p-4 rounded-xl bg-linear-to-b from-white/6 to-white/2 border border-white/10"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-violet-400 to-blue-400 shrink-0" />
									<p className="text-sm text-gray-300">{item}</p>
								</div>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-5">
						{values.map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.title}
									className="group flex items-start gap-5 p-6 rounded-2xl bg-linear-to-b from-white/6 to-white/2 border border-white/10 hover:border-violet-400/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
								>
									<div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-blue-500/20 border border-violet-400/30 group-hover:from-violet-500 group-hover:to-blue-500 group-hover:border-transparent transition-all duration-300">
										<Icon className="w-5 h-5 text-violet-300 group-hover:text-white transition-colors duration-300" />
									</div>
									<div>
										<h3 className="text-white font-bold text-lg">
											{item.title}
										</h3>
										<p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
											{item.desc}
										</p>
									</div>
								</div>
							);
						})}

						<div className="flex items-center gap-3 p-6 rounded-2xl bg-violet-500/10 border border-violet-400/20">
							<Award className="w-6 h-6 text-violet-300 shrink-0" />
							<p className="text-sm text-violet-100">
								Committed to making every ride{" "}
								<span className="font-bold text-white">safe and reliable</span>{" "}
								from pickup to drop-off.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
