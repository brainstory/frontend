import React, { useState } from "react";
import SubscriptionCTA from "@components/global/SubscribeCTA";
import PinkButton from "@ds/PinkButton";
import TransparentButton from "@ds/TransparentButton";

import { $userState } from "@components/global/userStore.js";

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
const buttons = [
	{ icon: "add", text: "New", href: "/chat", label: "", id: "new-idea" },
	{ icon: "home", text: "Dashboard", href: "/dashboard", label: "", id: "dashboard" },
	{ icon: "person", text: "My Profile", href: "/profile", label: "", id: "profile" },
	{
		icon: "log-out-outline",
		text: "Sign Out",
		href: `${PUBLIC_API_URL}auth-brainstory/v1/flow/logout`,
		label: "",
		id: "sign-out-button"
	}
];

const loggedOutButtons = [
	{
		icon: "flash",
		text: "Log in or Sign up",
		href: "https://app.brainstory.ai/",
		label: "",
		id: "login"
	},
	{
		icon: "bulb-outline",
		text: "Brainstory blog",
		href: "https://blog.brainstory.ai/",
		label: "",
		id: "blog"
	},
	{
		icon: "mail-outline",
		text: "Contact us",
		href: "https://www.brainstory.ai/support",
		label: "",
		id: "contact"
	}
];
// console.log(window.location.href);

function Navigation({ loggedOut = false }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	let navButtons = loggedOut ? loggedOutButtons : buttons;

	const handleOpenSidebar = () => {
		setIsSidebarOpen(true);
	};

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false);
	};

	const handleNavigate = (href) => {
		window.location.href = href;
	};

	const handleSignOut = () => {
		localStorage.removeItem("csrf_verify");
		window.location.href = buttons.find((button) => button.id === "sign-out-button").href;
	};

	return (
		<div>
			{/* Open Sidebar Button */}
			<TransparentButton
				icon="menu"
				onClick={handleOpenSidebar}
				aria-label="Open Sidebar"
				classes="mt-2 ml-3 sm:hidden"
			/>

			{/* Sidebar */}
			<aside
				className={`top-0 left-0 z-40 w-64 h-full transition-transform sm:translate-x-0 fixed p-4 sm:pr-0 bg-stone-50
					${isSidebarOpen ? "" : "sm:sticky -translate-x-full"} `}
				aria-label="Sidebar"
			>
				<a href="/" className="flex justify-center items-center mt-2 mb-6 sm:mb-8">
					<img src="/logo.svg" className="h-8 mr-3 sm:h-12" alt="Brainstory Logo" />
				</a>
				<TransparentButton
					icon="close"
					onClick={handleCloseSidebar}
					aria-label="Close Sidebar"
					classes="absolute top-2 right-2 sm:hidden sm:block"
				/>
				<ul className="space-y-2 font-medium">
					{navButtons.map((button) => {
						if (button.id === "new-idea" || button.id === "login") {
							return (
								<li
									key="new-idea-pink"
									className={button.id === "new-idea" && "mx-5"}
								>
									<PinkButton
										icon={button.icon}
										iconClasses="mr-0.5"
										full
										role="link"
										onClick={() => {
											handleNavigate(button.href);
										}}
									>
										{button.text}
									</PinkButton>
									{button.id === "new-idea" && (
										<div className="text-center mt-2">
											<a
												className="text-xs font-normal text-stone-500 underline hover:text-slate-700 underline-offset-2 hover:no-underline"
												href="/get-started"
											>
												Guide me
											</a>
										</div>
									)}
									<hr className="w-48 h-[1px] mx-auto mt-4 mb-6 bg-stone-200 border-0 rounded" />
								</li>
							);
						}

						return (
							<li key={button.id}>
								<TransparentButton
									id={button.id}
									icon={button.icon}
									role="link"
									onClick={() => {
										if (button.id === "sign-out-button") {
											handleSignOut();
										} else {
											handleNavigate(button.href);
										}
									}}
									left
									full
								>
									{button.text}
								</TransparentButton>
							</li>
						);
					})}
				</ul>
				{!loggedOut && $userState !== undefined && <SubscriptionCTA />}
			</aside>
		</div>
	);
}

export default Navigation;
