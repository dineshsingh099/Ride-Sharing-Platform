import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2, LogOut } from "lucide-react";
import { useGetMe } from "../../hooks/useGetMe";
import { partnerService } from "../../services/partnerServices";
import { clearPartner } from "../../redux/partnerSlice";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function PartnerDashboard() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { me, loading, error } = useGetMe("partner");
	const [loggingOut, setLoggingOut] = useState(false);

	useEffect(() => {
		if (!loading && !me) {
			navigate("/partner/login", { replace: true });
		}
	}, [loading, me, navigate]);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			await partnerService.logout();
		} finally {
			dispatch(clearPartner());
			setLoggingOut(false);
			navigate("/partner/login", { replace: true });
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0A0A0D] flex items-center justify-center">
				<Loader2 size={28} className="text-violet-400 animate-spin" />
			</div>
		);
	}

	if (!me) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#0A0A0D]">
			<div className="flex items-center justify-between px-6 lg:px-10 h-20 border-b border-white/5">
				<span className="text-white text-xl font-extrabold tracking-tight">
					Ride
					<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-blue-400">
						X
					</span>
				</span>
				<ProfileAvatar name={me.name} avatar={me.avatar} size={42} />
			</div>

			<div className="px-4 py-10">
				<div className="max-w-2xl mx-auto bg-[#111118]/95 border border-violet-500/20 rounded-3xl p-7 shadow-2xl shadow-violet-900/30">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-white">
							Welcome, {me.name}
						</h1>
						<button
							type="button"
							onClick={handleLogout}
							disabled={loggingOut}
							className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-60"
						>
							{loggingOut ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<LogOut size={16} />
							)}
							Logout
						</button>
					</div>

					<div className="mt-6 space-y-2 text-gray-300">
						<p>Email: {me.email}</p>
						<p>Account verified: {me.isEmailVerified ? "Yes" : "No"}</p>
					</div>

					{error && <p className="mt-4 text-sm text-red-400">{error}</p>}
				</div>
			</div>
		</div>
	);
}
