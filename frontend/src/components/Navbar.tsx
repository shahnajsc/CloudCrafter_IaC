import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
	const { pathname } = useLocation();
	const link = (to: string, label: string) => (
		<Link
			to={to}
			className={`px-4 py-2 rounded-md font-semibold ${
			pathname === to
				? "bg-white text-orange-600"
				: "text-white hover:bg-white hover:text-orange-600"
			}`}
		>
			{label}
		</Link>
	);

	return (
	<nav className="bg-orange-500 flex justify-start pl-10 gap-6 py-4 shadow-md sticky top-0 z-10">
		{link("/", "🏠 Home")}
		{link("/about", "📘 About")}
		{link("/github", "💻 GitHub")}
	</nav>
	);
}
