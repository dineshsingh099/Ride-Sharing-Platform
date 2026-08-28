import { TriangleAlert, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-[#0A0A0D] flex items-center justify-center px-4 relative overflow-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-[#0A0A0D] to-blue-900/20" />

			<div className="absolute top-20 left-10 w-56 h-56 bg-violet-600/20 rounded-full blur-[120px]" />
			<div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[120px]" />

			<div className="relative z-10 w-full max-w-lg text-center bg-[#111118]/95 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 shadow-2xl shadow-violet-900/30">
				<div className="mx-auto w-20 h-20 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
					<TriangleAlert size={38} className="text-violet-300" />
				</div>

				<h1 className="mt-6 text-7xl font-extrabold bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
					404
				</h1>

				<h2 className="mt-3 text-3xl font-bold text-white">Page Not Found</h2>

				<p className="mt-4 text-gray-400 max-w-sm mx-auto">
					Sorry, the page you're looking for doesn't exist or has been moved.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						to="/"
						className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-violet-500 to-blue-500 text-white font-semibold hover:from-violet-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-violet-500/30"
					>
						<Home size={18} />
						Go Home
					</Link>

					<Link
						to="/login"
						className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A24] border border-violet-500/20 text-white font-semibold hover:bg-violet-500/10 hover:border-violet-400/40 transition-all duration-300"
					>
						<ArrowLeft size={18} />
						Back to Login
					</Link>
				</div>
			</div>
		</div>
	);
}
