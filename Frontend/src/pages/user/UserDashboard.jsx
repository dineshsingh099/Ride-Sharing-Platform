import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useGetMe } from "../../hooks/useGetMe";
import Sidebar from "../../components/common/Sidebar";
import ProfileAvatar from "../../components/common/ProfileAvatar";

export default function UserDashboard() {
	const navigate = useNavigate();
	const { me, loading, error } = useGetMe("user");

	useEffect(() => {
		if (!loading && !me) {
			navigate("/login", { replace: true });
		}
	}, [loading, me, navigate]);

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
			<Sidebar role="user" />

			<main className="lg:ml-64 min-h-screen">
				<div className="flex items-center justify-end px-6 lg:px-10 h-20 border-b border-white/5">
					<ProfileAvatar name={me.name} avatar={me.avatar} size={42} />
				</div>

				<div className="px-4 py-10">
					<div className="max-w-2xl mx-auto bg-[#111118]/95 border border-violet-500/20 rounded-3xl p-7 shadow-2xl shadow-violet-900/30">
						<h1 className="text-2xl font-bold text-white">
							Welcome, {me.name}
						</h1>

						<div className="mt-6 space-y-2 text-gray-300">
							<p>Email: {me.email}</p>
							<p>Account verified: {me.isEmailVerified ? "Yes" : "No"}</p>
						</div>

						{error && <p className="mt-4 text-sm text-red-400">{error}</p>}
					</div>
				</div>
			</main>
		</div>
	);
}
