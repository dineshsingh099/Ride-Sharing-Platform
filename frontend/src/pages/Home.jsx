import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";

const Home = () => {
	return (
		<div className="bg-white text-gray-900 overflow-x-hidden">
			<Navbar />

			<div className="bg-indigo-50">
				<section className="pt-28 pb-16 px-6">
					<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
						<div>
							<h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
								Ride Smarter.
								<br />
								Share Faster.
							</h1>

							<p className="mt-6 text-lg text-gray-600 max-w-xl">
								Book rides instantly, save money, and travel comfortably with
								our trusted community-driven ride sharing platform.
							</p>

							<div className="mt-8 flex flex-wrap gap-4">
								<button className="px-8 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md">
									Book a Ride
								</button>
								<button className="px-8 py-3 rounded-full border border-gray-300 bg-white hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm">
									Offer a Ride
								</button>
							</div>

							<div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
								<span className="flex items-center gap-2">
									<span className="w-2 h-2 bg-green-500 rounded-full" />
									Verified Drivers
								</span>
								<span className="flex items-center gap-2">
									<span className="w-2 h-2 bg-indigo-600 rounded-full" />
									Secure Payments
								</span>
								<span className="flex items-center gap-2">
									<span className="w-2 h-2 bg-yellow-400 rounded-full" />
									24/7 Support
								</span>
							</div>
						</div>

						<img
							src={assets.hero}
							alt="Ride sharing"
							className="w-full max-h-[420px] object-cover rounded-2xl shadow-xl"
						/>
					</div>
				</section>
			</div>

			<section className="py-20 px-6 bg-white">
				<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
					<div>
						<h2 className="text-4xl font-bold">About RideShare</h2>

						<p className="mt-5 text-gray-600 leading-relaxed max-w-lg">
							RideShare is a smart ride-sharing platform designed to make travel
							safer, affordable, and community-driven.
						</p>

						<p className="mt-4 text-gray-600 leading-relaxed max-w-lg">
							From daily commutes to long trips, we help you book instantly,
							split costs, reduce emissions, and travel better together.
						</p>
					</div>

					<img
						src={assets.about}
						alt="About RideShare"
						className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
					/>
				</div>
			</section>

			<section className="py-20 px-6 bg-indigo-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center max-w-2xl mx-auto">
						<h2 className="text-4xl font-extrabold text-gray-900">
							Our Services
						</h2>
						<p className="mt-4 text-gray-600">
							Smart mobility solutions built for everyday travel, savings, and
							safety.
						</p>
					</div>

					<div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							[
								"🚗",
								"On-Demand Rides",
								"Instant booking with real-time tracking.",
							],
							["👥", "Carpool & Share", "Save up to 60% with shared rides."],
							["⏰", "Scheduled Rides", "Plan rides up to 30 days in advance."],
							["🧑‍✈️", "Drive & Earn", "Earn on your own flexible schedule."],
							["🛡️", "Safety First", "Verified drivers with SOS support."],
							[
								"🏢",
								"Corporate Travel",
								"Smart billing and business travel tools.",
							],
						].map((item, i) => (
							<div
								key={i}
								className="group bg-white p-8 rounded-2xl shadow-sm border border-transparent hover:border-indigo-200 hover:shadow-xl transition-all duration-300 flex flex-col"
							>
								<div className="text-4xl mb-5">{item[0]}</div>

								<h3 className="text-xl font-semibold text-gray-900">
									{item[1]}
								</h3>

								<p className="mt-3 text-gray-600 flex-grow">{item[2]}</p>

								<button className="mt-6 self-start text-indigo-600 font-medium group-hover:underline">
									Learn more →
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20 px-6 bg-white">
				<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
					<div>
						<h2 className="text-4xl font-bold text-gray-900">Get in Touch</h2>

						<p className="mt-4 text-gray-600 max-w-md">
							Reach out for support, driver onboarding, or partnership
							opportunities.
						</p>

						<div className="mt-8 space-y-4 text-gray-700">
							<div className="flex items-center gap-3">
								<span className="text-xl">📍</span>
								<span>New Delhi, India</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xl">📧</span>
								<span>support@rideshare.com</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xl">📞</span>
								<span>+91 98765 43210</span>
							</div>
						</div>
					</div>

					<form className="bg-indigo-50 p-8 rounded-2xl shadow-lg space-y-5">
						<input
							type="text"
							placeholder="Your name"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
						/>

						<input
							type="email"
							placeholder="Email address"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
						/>

						<textarea
							placeholder="Your message"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
						/>

						<button className="w-full py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md">
							Send Message
						</button>
					</form>
				</div>
			</section>

			<footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
				<div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
					<div>
						<h3 className="text-2xl font-bold text-white">RideShare</h3>
						<p className="mt-4 text-gray-400 max-w-sm">
							Smart ride-sharing platform helping people travel safer, cheaper,
							and together.
						</p>
					</div>

					<div>
						<h4 className="text-lg font-semibold text-white mb-4">Company</h4>
						<ul className="space-y-3">
							<li className="hover:text-white cursor-pointer">About</li>
							<li className="hover:text-white cursor-pointer">Services</li>
							<li className="hover:text-white cursor-pointer">Careers</li>
							<li className="hover:text-white cursor-pointer">Contact</li>
						</ul>
					</div>

					<div>
						<h4 className="text-lg font-semibold text-white mb-4">Support</h4>
						<ul className="space-y-3">
							<li className="hover:text-white cursor-pointer">Help Center</li>
							<li className="hover:text-white cursor-pointer">Safety</li>
							<li className="hover:text-white cursor-pointer">Terms</li>
							<li className="hover:text-white cursor-pointer">Privacy</li>
						</ul>
					</div>

					<div>
						<h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
						<div className="flex gap-4">
							<span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-indigo-600 cursor-pointer transition">
								𝕏
							</span>
							<span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-indigo-600 cursor-pointer transition">
								in
							</span>
							<span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-indigo-600 cursor-pointer transition">
								📷
							</span>
						</div>
					</div>
				</div>

				<div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
					© {new Date().getFullYear()} RideShare. All rights reserved.
				</div>
			</footer>
		</div>
	);
};

export default Home;
