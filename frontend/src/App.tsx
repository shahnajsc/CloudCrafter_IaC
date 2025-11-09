import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
	return (
		<div className="min-h-screen bg-white text-gray-800">
			<Navbar />
			<main className="p-8">
				<Outlet />
			</main>
		</div>
	);
}
