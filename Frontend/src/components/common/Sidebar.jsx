import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	LayoutDashboard,
	Car,
	History,
	Wallet,
	UserCircle,
	Navigation,
	IndianRupee,
	FileText,
	Users,
	UserCheck,
	MapPin,
	ShieldCheck,
	LogOut,
	Loader2,
	Menu,
	X,
} from "lucide-react";
import { userService } from "../../services/userServices";
import { partnerService } from "../../services/partnerServices";
import { adminService } from "../../services/adminServices";
import { clearUser } from "../../redux/userSlice";
import { clearPartner } from "../../redux/partnerSlice";
import { clearAdmin } from "../../redux/adminSlice";
import ProfileAvatar from "./ProfileAvatar";

const roleConfig = {
	user: {
		title: "Rider",
		loginPath: "/login",
		logout: () => userService.logout(),
		clear: clearUser,
		links: [
			{
				label: "Dashboard",
				to: "/dashboard",
				icon: LayoutDashboard,
				end: true,
			},
			{ label: "Book a Ride", to: "/dashboard/book", icon: Car },
			{ label: "My Rides", to: "/dashboard/rides", icon: History },
			{ label: "Payments", to: "/dashboard/payments", icon: Wallet },
			{ label: "Profile", to: "/dashboard/profile", icon: UserCircle },
		],
	},
	partner: {
		title: "Driver",
		loginPath: "/partner/login",
		logout: () => partnerService.logout(),
		clear: clearPartner,
		links: [
			{
				label: "Dashboard",
				to: "/partner/dashboard",
				icon: LayoutDashboard,
				end: true,
			},
			{ label: "Trips", to: "/partner/dashboard/trips", icon: Navigation },
			{
				label: "Earnings",
				to: "/partner/dashboard/earnings",
				icon: IndianRupee,
			},
			{
				label: "Documents",
				to: "/partner/dashboard/documents",
				icon: FileText,
			},
			{ label: "Profile", to: "/partner/dashboard/profile", icon: UserCircle },
		],
	},
	admin: {
		title: "Admin",
		loginPath: "/admin/login",
		logout: () => adminService.logout(),
		clear: clearAdmin,
		links: [
			{
				label: "Dashboard",
				to: "/admin/dashboard",
				icon: LayoutDashboard,
				end: true,
			},
			{ label: "Users", to: "/admin/dashboard/users", icon: Users },
			{ label: "Drivers", to: "/admin/dashboard/drivers", icon: UserCheck },
			{ label: "Rides", to: "/admin/dashboard/rides", icon: MapPin },
			{ label: "Payments", to: "/admin/dashboard/payments", icon: Wallet },
		],
	},
};

export default function Sidebar({ role = "user" }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const config = roleConfig[role] || roleConfig.user;
	const [open, setOpen] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);

	const profile = useSelector((state) => {
		if (role === "partner") return state.partner.partnerData;
		if (role === "admin") return state.admin.adminData;
		return state.user.userData;
	});

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			await config.logout();
		} finally {
			dispatch(config.clear());
			setLoggingOut(false);
			setOpen(false);
			navigate(config.loginPath, { replace: true });
		}
	};

	const content = (
		<div className="flex flex-col h-full bg-[#0E0E13] border-r border-white/10">
			<div className="flex items-center justify-between px-6 h-20 border-b border-white/5 shrink-0">
				<div className="flex items-center gap-2">
					{role === "admin" && (
						<ShieldCheck size={20} className="text-violet-400" />
					)}
					<span className="text-white text-xl font-extrabold tracking-tight">
						Ride
						<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
							X
						</span>
					</span>
					<span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide text-violet-200 bg-violet-500/15 border border-violet-400/30">
						{config.title}
					</span>
				</div>
				<button
					onClick={() => setOpen(false)}
					aria-label="Close menu"
					className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
				>
					<X size={20} />
				</button>
			</div>

			<nav className="flex-1 overflow-y-auto px-4 py-6">
				<ul className="flex flex-col gap-1">
					{config.links.map((link) => {
						const Icon = link.icon;
						return (
							<li key={link.to}>
								<NavLink
									to={link.to}
									end={link.end}
									onClick={() => setOpen(false)}
									className={({ isActive }) =>
										`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${
											isActive
												? "text-white bg-linear-to-r from-violet-500/25 to-blue-500/15 border border-violet-400/30"
												: "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
										}`
									}
								>
									<Icon size={19} />
									<span>{link.label}</span>
								</NavLink>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="px-4 pb-6 pt-4 border-t border-white/5 flex flex-col gap-3 shrink-0">
				<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-400/20">
					<ProfileAvatar
						name={profile?.name}
						avatar={profile?.avatar}
						size={38}
					/>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-white truncate">
							{profile?.name || "My Account"}
						</p>
						<p className="text-xs text-gray-400 truncate">
							{profile?.email || config.title}
						</p>
					</div>
				</div>

				<button
					onClick={handleLogout}
					disabled={loggingOut}
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[15px] font-semibold text-red-300 bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{loggingOut ? (
						<Loader2 size={18} className="animate-spin" />
					) : (
						<LogOut size={18} />
					)}
					<span>{loggingOut ? "Logging out..." : "Logout"}</span>
				</button>
			</div>
		</div>
	);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				aria-label="Open menu"
				className="lg:hidden fixed top-4 left-4 z-40 flex items-center justify-center h-10 w-10 rounded-lg text-white bg-[#0E0E13] border border-white/10 hover:bg-white/5 transition-colors duration-200"
			>
				<Menu size={22} />
			</button>

			<aside className="hidden lg:block fixed top-0 left-0 z-30 h-screen w-64">
				{content}
			</aside>

			<div
				onClick={() => setOpen(false)}
				className={`fixed inset-0 z-50 bg-black/70 transition-opacity duration-300 lg:hidden ${
					open
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			/>

			<aside
				className={`fixed top-0 left-0 z-60 h-full w-[78%] max-w-xs transform transition-transform duration-300 ease-out lg:hidden ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{content}
			</aside>
		</>
	);
}
