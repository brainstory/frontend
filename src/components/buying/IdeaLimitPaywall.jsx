import ChatApp from "@src/components/chat/ChatApp.jsx";
import LoadingAnimation from "@components/global/LoadingAnimation";
import { useStore } from "@nanostores/react";
import { $userState, $userTrial } from "@components/global/userStore.js";
import { getTimeDifferenceFromToday } from "@helpers/helpers";

export default function IdeaLimitPaywall({}) {
	const userTrial = useStore($userTrial);
	const { isPaid, trialEndAt } = userTrial;
	const { userName, userEmail } = useStore($userState);
	const timeDiffMs = getTimeDifferenceFromToday(trialEndAt);

	return (
		<>
			{isPaid === undefined ? (
				<LoadingAnimation text="Loading" classes="p-6" />
			) : isPaid || timeDiffMs > 0 ? (
				<ChatApp />
			) : (
				<div class="h-[80vh] bg-white flex flex-col justify-center items-center">
					<ion-icon
						class="w-20 h-20 md hydrated mr-3 text-pink-500"
						name="warning"
						role="img"
						aria-label="checkmark outline"
					></ion-icon>
					<p className="m-5 mt-1 text-bold font-semibold lg:text-4xl text-3xl text-center tracking-tight">
						{userName}, You have reached your limit
					</p>
					<p className="font-light lg:text-xl text-xl text-center mt-1">
						Subscribe to continue your train of thought
					</p>
					<stripe-pricing-table
						pricing-table-id="prctbl_1ODZoTLQfRCgE8KWN5aWqyai"
						publishable-key="pk_live_51IUHPSLQfRCgE8KW6biE38hBuwThPGgA3QN3A5pzubCOoJFUsa75SsoTnFOTkopAlsR0efoJMbxK7yiq8ymZDHEj00LbLEnT9e"
						customer-email={userEmail}
					/>
				</div>
			)}
		</>
	);
}
