import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
	HiOutlineHome,
	HiOutlineCog,
	HiOutlineLightBulb,
	HiOutlinePhone,
	HiOutlineInformationCircle,
} from "react-icons/hi2";
import { useSessionUser } from "../hooks/useSessionUser";
import ProfileAvatar from "./ProfileAvatar";

const navLinks = [
	{ label: "Home", id: "home", icon: HiOutlineHome },
	{ label: "About", id: "about", icon: HiOutlineInformationCircle },
	{ label: "Services", id: "services", icon: HiOutlineCog },
	{ label: "How it works", id: "how-it-works", icon: HiOutlineLightBulb },
	{ label: "Contact", id: "contact", icon: HiOutlinePhone },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const navigate = useNavigate();
	const { profile, isAuthenticated, dashboardPath } = useSessionUser();

	const goToSection = (id) => {
		setIsOpen(false);
		navigate(id === "home" ? "/" : `/${id}`);
	};

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<div
				className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
					scrolled
						? "bg-[#0A0A0D]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
						: "bg-[#0A0A0D] border-b border-white/5"
				}`}
			>
				<nav className="relative flex items-center justify-between px-6 lg:px-10 h-20 w-full">
					<button
						onClick={() => goToSection("home")}
						className="flex items-center shrink-0 group"
					>
						<span className="text-white text-xl font-extrabold tracking-tight">
							Ride
							<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
								X
							</span>
						</span>
					</button>

					<ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
						{navLinks.map((link) => (
							<li key={link.label}>
								<button
									onClick={() => goToSection(link.id)}
									className="relative px-4 py-2 text-[15px] font-medium text-gray-300 hover:text-white transition-colors duration-200 group"
								>
									{link.label}
									<span className="absolute left-4 right-4 -bottom-0.5 h-0.5 bg-linear-to-r from-violet-400 to-blue-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
								</button>
							</li>
						))}
					</ul>

					<div className="hidden lg:flex items-center gap-3">
						{isAuthenticated ? (
							<Link to={dashboardPath} className="flex items-center">
								<ProfileAvatar
									name={profile?.name}
									avatar={profile?.avatar}
									size={42}
								/>
							</Link>
						) : (
							<>
								<Link
									to="/partner/login"
									className="px-5 py-2.5 rounded-xl text-[15px] font-semibold text-violet-100 bg-violet-500/15 border border-violet-400/40 hover:bg-violet-500/25 hover:border-violet-400/70 hover:text-white transition-all duration-300"
								>
									Become a Partner
								</Link>
								<Link
									to="/login"
									className="relative overflow-hidden group/login px-6 py-2.5 rounded-xl text-[15px] font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 shadow-md shadow-violet-500/30 hover:shadow-lg hover:shadow-violet-500/50 ring-1 ring-white/10 transition-all duration-300"
								>
									<span className="relative z-10">Login</span>
									<span className="absolute inset-0 -translate-x-full group-hover/login:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12" />
								</Link>
							</>
						)}
					</div>

					<button
						onClick={() => setIsOpen(true)}
						aria-label="Open menu"
						className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg text-white hover:bg-white/5 transition-colors duration-200"
					>
						<FiMenu size={24} />
					</button>
				</nav>
			</div>

			<div
				onClick={() => setIsOpen(false)}
				className={`fixed inset-0 z-60 bg-black/70 transition-opacity duration-500 lg:hidden ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			/>

			<div
				className={`fixed top-0 right-0 z-70 h-full w-[78%] max-w-sm bg-[#0E0E13] border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out lg:hidden flex flex-col ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-6 h-20 border-b border-white/5 bg-[#0E0E13]">
					<span className="text-white text-lg font-extrabold tracking-tight">
						Ride
						<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
							X
						</span>
					</span>
					<button
						onClick={() => setIsOpen(false)}
						aria-label="Close menu"
						className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
					>
						<FiX size={22} />
					</button>
				</div>

				<ul className="flex flex-col gap-1 px-4 py-6 bg-[#0E0E13] flex-1">
					{navLinks.map((link, i) => {
						const Icon = link.icon;
						return (
							<li
								key={link.label}
								className={`transform transition-all duration-500 ${
									isOpen
										? "translate-x-0 opacity-100"
										: "translate-x-6 opacity-0"
								}`}
								style={{ transitionDelay: isOpen ? `${i * 60}ms` : "0ms" }}
							>
								<button
									onClick={() => goToSection(link.id)}
									className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
								>
									<Icon size={19} />
									<span className="text-[15px] font-medium">{link.label}</span>
								</button>
							</li>
						);
					})}
				</ul>

				<div className="px-6 mt-auto mb-8 flex flex-col gap-3 bg-[#0E0E13]">
					{isAuthenticated ? (
						<Link
							to={dashboardPath}
							onClick={() => setIsOpen(false)}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-violet-400/30 bg-violet-500/10"
						>
							<ProfileAvatar
								name={profile?.name}
								avatar={profile?.avatar}
								size={36}
							/>
							<span className="text-[15px] font-semibold text-white truncate">
								{profile?.name || "My Account"}
							</span>
						</Link>
					) : (
						<>
							<Link
								to="/partner/login"
								onClick={() => setIsOpen(false)}
								className="w-full px-5 py-3 rounded-xl text-[15px] font-semibold text-violet-100 bg-violet-500/15 border border-violet-400/40 hover:bg-violet-500/25 hover:border-violet-400/70 hover:text-white transition-all duration-300 text-center"
							>
								Become a Partner
							</Link>
							<Link
								to="/login"
								onClick={() => setIsOpen(false)}
								className="relative overflow-hidden group/loginm w-full px-5 py-3 rounded-xl text-[15px] font-bold text-white bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 shadow-md shadow-violet-500/30 hover:shadow-lg hover:shadow-violet-500/50 ring-1 ring-white/10 transition-all duration-300 text-center"
							>
								<span className="relative z-10">Login</span>
								<span className="absolute inset-0 -translate-x-full group-hover/loginm:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12" />
							</Link>
						</>
					)}
				</div>
			</div>

			<div className="h-20" />
		</>
	);
}
