import React, { useState, useEffect } from "react";
import { setCookie } from "@helpers/cookie";

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

export default function GuestNavigation() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		setIsAuthenticated(localStorage.getItem("csrf_verify") !== null);
	}, []);

	return (
		<div
			id="guest-navigation"
			className="bg-stone-100 border-b border-stone-300 py-2 px-4 flex items-center justify-between sticky top-0 z-10 relative"
		>
			<a href="/" className="flex justify-center items-center">
				<img src="/logo.svg" className="mt-3 h-8 sm:h-12" alt="Brainstory Logo" />
			</a>
		</div>
	);
}
