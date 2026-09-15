import { Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
	FaFacebookF,
	FaInstagram,
	FaXTwitter,
	FaLinkedinIn,
} from "react-icons/fa6";

const linkGroups = [
	{
		title: "Company",
		links: [
			{ label: "About Us", href: "/about" },
			{ label: "Careers", href: "#" },
			{ label: "Blog", href: "#" },
			{ label: "Press", href: "#" },
		],
	},
	{
		title: "Services",
		links: [
			{ label: "Bike", sectionId: "services" },
			{ label: "Car", sectionId: "services" },
			{ label: "SUV", sectionId: "services" },
			{ label: "Parcel", sectionId: "services" },
		],
	},
	{
		title: "Support",
		links: [
			{ label: "Help Center", href: "#" },
			{ label: "Safety", href: "#" },
			{ label: "Terms of Service", href: "#" },
			{ label: "Privacy Policy", href: "#" },
		],
	},
];

const socials = [
	{ icon: FaFacebookF, href: "#", label: "Facebook" },
	{
		icon: FaInstagram,
		href: "https://instagram.com/dineshsingh_077",
		label: "Instagram",
	},
	{ icon: FaXTwitter, href: "#", label: "Twitter" },
	{ icon: FaLinkedinIn, href: "https://www.linkedin.com/in/dineshsingh09", label: "LinkedIn" },
];

export default function Footer() {
	const navigate = useNavigate();

	const goToSection = (id) => {
		navigate(id === "home" ? "/" : `/${id}`);
	};

	return (
		<footer className="relative w-full bg-[#0A0A0D] border-t border-white/5 overflow-hidden">
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-60 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

			<div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/5">
					<div className="lg:col-span-4">
						<button
							onClick={() => goToSection("home")}
							className="flex items-center shrink-0 group w-fit"
						>
							<span className="text-white text-2xl font-extrabold tracking-tight">
								Ride
								<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
									X
								</span>
							</span>
						</button>
						<p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
							Fast, safe and reliable rides at the tap of a button. Moving your
							city, one ride at a time.
						</p>

						<div className="mt-6 flex flex-col gap-3">
							<a
								href="mailto:support@ridex.com"
								className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-violet-300 transition-colors duration-200"
							>
								<Mail className="w-4 h-4" />
								support@ridex.com
							</a>
							<a
								href="tel:+919876543210"
								className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-violet-300 transition-colors duration-200"
							>
								<Phone className="w-4 h-4" />
								+91 98765 43210
							</a>
							<div className="flex items-center gap-2.5 text-sm text-gray-400">
								<MapPin className="w-4 h-4 shrink-0" />
								Ajmer, Rajasthan, India
							</div>
						</div>
					</div>

					<div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
						{linkGroups.map((group) => (
							<div key={group.title}>
								<h4 className="text-white font-semibold text-sm tracking-wide mb-4">
									{group.title}
								</h4>
								<ul className="flex flex-col gap-3">
									{group.links.map((link) =>
										link.sectionId ? (
											<li key={link.label}>
												<button
													onClick={() => goToSection(link.sectionId)}
													className="text-sm text-gray-400 hover:text-violet-300 transition-colors duration-200"
												>
													{link.label}
												</button>
											</li>
										) : (
											<li key={link.label}>
												<a
													href={link.href}
													className="text-sm text-gray-400 hover:text-violet-300 transition-colors duration-200"
												>
													{link.label}
												</a>
											</li>
										)
									)}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
					<p className="text-sm text-gray-500 text-center sm:text-left">
						© {new Date().getFullYear()} RideX. All rights reserved.
					</p>

					<div className="flex items-center gap-3">
						{socials.map((social) => {
							const Icon = social.icon;
							return (
								<a
									key={social.label}
									href={social.href}
									aria-label={social.label}
									className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-violet-500/20 hover:border-violet-400/40 transition-all duration-300"
								>
									<Icon className="w-3.5 h-3.5" />
								</a>
							);
						})}
					</div>
				</div>
			</div>
		</footer>
	);
}
