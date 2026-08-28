import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function Contact() {
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [status, setStatus] = useState("idle");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setStatus("loading");
		setTimeout(() => {
			setStatus("success");
			setForm({ name: "", email: "", message: "" });
			setTimeout(() => setStatus("idle"), 3000);
		}, 1200);
	};

	const info = [
		{
			icon: Phone,
			label: "Call us",
			value: "+91 98765 43210",
		},
		{
			icon: Mail,
			label: "Email us",
			value: "support@ridex.com",
		},
		{
			icon: MapPin,
			label: "Visit us",
			value: "Ajmer, Rajasthan, India",
		},
	];

	return (
		<section
			id="contact"
			className="relative w-full bg-[#0A0A0D] py-24 px-6 overflow-hidden"
		>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

			<div className="relative max-w-6xl mx-auto">
				<div className="text-center mb-16">
					<span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-violet-200 bg-violet-500/15 border border-violet-400/30">
						Get in touch
					</span>
					<h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
						Contact{" "}
						<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
							Us
						</span>
					</h2>
					<p className="mt-3 text-gray-400 max-w-lg mx-auto">
						Have a question or need support? We'd love to hear from you and
						respond as soon as possible.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
					<div className="lg:col-span-2 flex flex-col gap-4">
						{info.map((item, i) => {
							const Icon = item.icon;
							return (
								<div
									key={i}
									className="group flex items-center gap-4 p-4 rounded-2xl bg-linear-to-b from-white/6 to-white/2 border border-white/10 hover:border-violet-400/40 backdrop-blur-sm transition-all duration-300"
								>
									<div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-blue-500/20 border border-violet-400/30 group-hover:from-violet-500 group-hover:to-blue-500 group-hover:border-transparent transition-all duration-300">
										<Icon className="w-5 h-5 text-violet-300 group-hover:text-white transition-colors duration-300" />
									</div>
									<div className="text-left">
										<p className="text-xs text-gray-400">{item.label}</p>
										<p className="text-white font-semibold">{item.value}</p>
									</div>
								</div>
							);
						})}

						<div className="p-4 rounded-2xl bg-linear-to-b from-white/6 to-white/2 border border-white/10">
							<p className="text-xs text-gray-400 mb-3">Support hours</p>
							<div className="flex items-center justify-between text-sm text-gray-300">
								<span>We're available</span>
								<span className="text-white font-bold">24/7</span>
							</div>
						</div>
					</div>

					<form
						onSubmit={handleSubmit}
						className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-linear-to-b from-white/6 to-white/2 border border-white/10 backdrop-blur-sm"
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-gray-300">
									Your Name
								</label>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									placeholder="John Doe"
									className="px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-400/60 focus:bg-white/[0.07] transition-all duration-300"
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium text-gray-300">
									Email Address
								</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									required
									placeholder="john@example.com"
									className="px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-400/60 focus:bg-white/[0.07] transition-all duration-300"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5 mt-4">
							<label className="text-sm font-medium text-gray-300">
								Message
							</label>
							<textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								required
								rows={3}
								placeholder="Tell us how we can help..."
								className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-400/60 focus:bg-white/[0.07] transition-all duration-300 resize-none"
							/>
						</div>

						<button
							type="submit"
							disabled={status === "loading"}
							className="relative overflow-hidden group/submit mt-4 w-full sm:w-auto px-8 py-3.5 rounded-xl text-[15px] font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 ring-1 ring-white/10 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
						>
							<span className="absolute inset-0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12" />

							{status === "loading" && (
								<Loader2 className="relative z-10 w-4 h-4 animate-spin" />
							)}
							{status === "success" && (
								<CheckCircle2 className="relative z-10 w-4 h-4" />
							)}
							{status === "idle" && <Send className="relative z-10 w-4 h-4" />}

							<span className="relative z-10">
								{status === "loading"
									? "Sending..."
									: status === "success"
										? "Message Sent!"
										: "Send Message"}
							</span>
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}
