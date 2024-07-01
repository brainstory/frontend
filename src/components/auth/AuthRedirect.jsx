import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "@helpers/cookie";
import { csrfApi } from "@helpers/api/auth";
import LoadingAnimation from "@components/global/LoadingAnimation";
import { getUserApi } from "@helpers/api/user.js";

let baseUrl = import.meta.env.PUBLIC_API_URL;

export default function AuthRedirect() {
	const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);

	useEffect(async () => {
		// Get CSRF token, then status of user, then workspace details from apis
		await csrfApi()
			.then(async (res) => {
				localStorage.setItem("csrf_verify", res.csrf);
				localStorage.setItem("csrf_header", res.header);
				const baseURL = window.location.origin;

				await getUserApi()
					.then(async (res) => {
						pendo.identify({
							visitor: {
								id: res.email,
								full_name: res.name
							}
						});

						// route if user is authenticated
						if (getCookie("auth_redirect_url") !== undefined) {
							// can't use reusable getCookie method because it splits out the query param if it exists
							const redirectURL = document.cookie
								?.split("; ")
								.find((row) => row.startsWith(`auth_redirect_url=`))
								.split("/")
								.slice(3)
								.join("/");
							// clear cookie
							setCookie("auth_redirect_url", undefined, -1);
							// navigate to dashboard if saved redirect is auth-redirect
							if (
								(redirectURL && redirectURL.includes("auth-redirect")) ||
								redirectURL.includes("logout")
							) {
								window.location.href = `${baseURL}/dashboard`;
							} else {
								window.location.href = `${baseURL}/${redirectURL}`;
							}
						} else {
							window.location.href = `${baseURL}/dashboard`;
						}
					})
					.catch((err) => {
						console.log("error getting user data", err);
					});
			})
			.catch((err) => {
				setTimeout(() => {
					setSnackbarErrorOpen(true);
					console.log("Something went wrong during logging you in", err);
				}, 4000);
			});
	}, []);

	const logout = () => {
		//clear auth data in session
		localStorage.removeItem("csrf_verify");
		// window.location.href = `${baseUrl}auth-brainstory/v1/flow/logout`;
	};

	return (
		<div className="w-full h-[50vw] flex flex-col items-center justify-center bg-white">
			{snackbarErrorOpen && (
				<div className="mt-5 bg-red-500 p-4 rounded-md shadow-lg absolute top-0 text-center">
					<p className="text-white">
						Something went wrong while logging you in. Please try logging out and then
						logging back in again.
					</p>
					<button
						aria-label="Log Out"
						className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
						onClick={logout}
					>
						Log Out
					</button>
				</div>
			)}
			<div className="h-1/2 w-full flex flex-col items-center justify-center">
				<LoadingAnimation />
				<p className="text-xl text-black mt-7">We're taking you back to Brainstory.</p>
				<p className="text-l text-black">
					Please keep this page open as the magic unfolds.
				</p>
				<p className="text-l text-black">See you there!</p>
			</div>
		</div>
	);
}
