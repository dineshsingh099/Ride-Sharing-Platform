import { useState } from "react";
import { assets } from "../assets/assets.js";

function Navbar() {
	const [active, setActive] = useState("Home");
	const [open, setOpen] = useState(false);

	const links = ["Home", "About", "Services", "Contact Us"];

	return (
		<header className="fixed top-0 left-0 right-0 h-20 flex items-center bg-white border-b border-gray-200 z-50 px-4 sm:px-8">
			<img src={assets.logo} alt="logo" className="h-14 w-auto" />

			<nav className="hidden sm:flex gap-8 font-medium absolute left-1/2 -translate-x-1/2">
				{links.map((link) => (
					<button
						key={link}
						onClick={() => setActive(link)}
						className="relative group px-1"
					>
						<span className={active === link ? "text-black" : "text-gray-600"}>
							{link}
						</span>
						<span
							className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 bg-indigo-600 transition-all ${
								active === link ? "w-full" : "w-0 group-hover:w-full"
							}`}
						/>
					</button>
				))}
			</nav>

			<button className="ml-auto hidden sm:block px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition">
				Login
			</button>

			<button className="ml-auto sm:hidden p-2" onClick={() => setOpen(!open)}>
				{open ? "✕" : "☰"}
			</button>

			{open && (
				<div className="absolute top-20 left-0 right-0 bg-white border-t sm:hidden">
					<div className="flex flex-col gap-4 px-6 py-5">
						{links.map((link) => (
							<button
								key={link}
								onClick={() => {
									setActive(link);
									setOpen(false);
								}}
								className="text-left"
							>
								{link}
							</button>
						))}
						<button className="mt-4 px-4 py-2 rounded-full bg-indigo-600 text-white">
							Login
						</button>
					</div>
				</div>
			)}
		</header>
	);
}

export default Navbar;
