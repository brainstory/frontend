import React, { useState } from "react";
let baseUrl = import.meta.env.PUBLIC_API_URL;
import LoadingAnimation from "@components/global/LoadingAnimation";
import { resendEmailVerification } from "@helpers/api/auth.js";

export default function VerifyEmail() {
	const [isSendingEmail, setIsSendingEmail] = useState(false);

	const logout = () => {
		//clear auth data in session
		localStorage.removeItem("csrf_verify");
		window.location.href = `${baseUrl}auth-brainstory/v1/flow/logout`;
	};

	const resendEmail = async () => {
		setIsSendingEmail(true);
		await resendEmailVerification().then((res) => {
			setIsSendingEmail(false);
		});
	};

	return (
		<>
			<div className="w-full h-[50vw] flex flex-col items-center justify-center bg-white text-stone-900">
				<div className="h-1/2 w-full flex flex-col items-center justify-center">
					<p className="mb-10 text-3xl">💌 Verify your email address</p>

					<p className="w-3/4 mb-10 text-center">
						To complete your sign up, we’ve sent a verification link to your email
						address above. Head over to your inbox, give it a click, and let your
						Brainstory adventure begin! 🚀
					</p>
					<div className="flex items-center justify-center h-[64px]">
						<button
							aria-label="Resend Email Verification"
							className={`w-[248px] bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 ${
								isSendingEmail && "bg-white hover:bg-white"
							}`}
							disabled={isSendingEmail}
							onClick={resendEmail}
						>
							{isSendingEmail ? (
								<LoadingAnimation text="Sending Email..." />
							) : (
								"Resend Verification Email"
							)}
						</button>
					</div>

					<button
						aria-label="Log Out"
						className="mt-1 text-stone-600 hover:underline"
						onClick={logout}
					>
						Logout
					</button>
				</div>
			</div>
		</>
	);
}
