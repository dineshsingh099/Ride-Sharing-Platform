import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Services from "../components/sections/Services";
import HowItWorks from "../components/sections/HowItWorks";
import Contact from "../components/sections/Contact";
import Footer from "../components/Footer";

export default function Landing() {
	const location = useLocation();

	useEffect(() => {
		const id =
			location.pathname === "/" ? "home" : location.pathname.replace("/", "");
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	}, [location.pathname]);

	return (
		<>
			<Navbar />
			<Hero />
			<About />
			<Services />
			<HowItWorks />
			<Contact />
			<Footer />
		</>
	);
}
