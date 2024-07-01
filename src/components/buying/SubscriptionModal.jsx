const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
const PUBLIC_STRIPE_ENV = import.meta.env?.PUBLIC_STRIPE_ENV;

const STRIPE_TABLE_ID_PROD = "prctbl_1ODZoTLQfRCgE8KWN5aWqyai";
const STRIPE_KEY_PROD =
	"pk_live_51IUHPSLQfRCgE8KW6biE38hBuwThPGgA3QN3A5pzubCOoJFUsa75SsoTnFOTkopAlsR0efoJMbxK7yiq8ymZDHEj00LbLEnT9e";

const STRIPE_TABLE_ID_TEST = "prctbl_1NudQWLQfRCgE8KW53Nno827";
const STRIPE_KEY_TEST =
	"pk_test_51IUHPSLQfRCgE8KW0fjbwWZxnQd7Dj33YmIMzo2sKHWYTthXbPfR2Q1OCXhwV28DprYsh0JMILgeBVLeyRP0uozq00vel3qA2u";

import LoadingAnimation from "@components/global/LoadingAnimation";
import PinkButton from "@ds/PinkButton";
import { useStore } from "@nanostores/react";
import { $userState, $userTrial } from "@components/global/userStore.js";

export default function SubscriptionModal({ isOpen, onClose, isUnlimited }) {
	const createPortalSessionURL = `${PUBLIC_API_URL}api/story/create-portal-session`;
	const { userEmail } = useStore($userState);
	const { isPaid } = useStore($userTrial);

	return (
		<div
			className={`absolute h-screen w-screen md:w-[calc(100vw-10px)] inset-0 z-50 flex items-center justify-center ${
				isOpen ? "" : "hidden"
			}`}
		>
			<div className="absolute w-full h-full bg-black opacity-40 overflow-hidden"></div>
			{!userEmail ? (
				<LoadingAnimation />
			) : (
				<div className="relative z-50 w-[90vw] sm:w-[80vw] m-auto rounded-lg shadow-md bg-white">
					<button
						onClick={onClose}
						type="button"
						className="absolute top-2 right-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-stone-400 hover:text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
					>
						<span className="sr-only">Close menu</span>
						<svg
							className="h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<div className="flex justify-center items-center flex-col">
						{isUnlimited || isPaid ? (
							<div className="p-10">
								<div className="mb-4">
									<p className="text-center text-primary text-2xl">
										You Are Subscribed!
									</p>
								</div>
								<form
									action={createPortalSessionURL}
									method="POST"
									className="flex justify-center"
								>
									<input type="hidden" name="user_email" value={userEmail} />
									<PinkButton
										id="checkout-and-portal-button"
										type="submit"
										// className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full"
									>
										Change your subscription
									</PinkButton>
								</form>
							</div>
						) : (
							<stripe-pricing-table
								pricing-table-id={
									PUBLIC_STRIPE_ENV === "test"
										? STRIPE_TABLE_ID_TEST
										: STRIPE_TABLE_ID_PROD
								}
								publishable-key={
									PUBLIC_STRIPE_ENV === "test" ? STRIPE_KEY_TEST : STRIPE_KEY_PROD
								}
								customer-email={userEmail}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
