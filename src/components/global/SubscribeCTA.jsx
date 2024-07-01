import React, { useState } from "react";
import SubscriptionModal from "@components/buying/SubscriptionModal";
import BlackButton from "@ds/BlackButton";
import { useStore } from "@nanostores/react";
import { $userTrial } from "@components/global/userStore.js";
import { getTimeDifferenceFromToday } from "@helpers/helpers";

export default function SubscriptionCTA() {
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
	const userTrial = useStore($userTrial);
	const { isPaid, trialEndAt } = userTrial;

	const closeSubscriptionModal = () => {
		setIsSubscriptionModalOpen(false);
	};

	const handleOpenModal = () => {
		setIsSubscriptionModalOpen(true);
	};

	const getHeading = () => {
		const timeDiff = getTimeDifferenceFromToday(trialEndAt);
		const timeDiffHours = timeDiff / (1000 * 60 * 60); // in hours
		const timeDiffDays = timeDiffHours / 24; // in days

		if (timeDiffDays > 0) {
			return `${
				timeDiffDays > 1
					? `${Math.ceil(timeDiffDays)} Days`
					: `${Math.ceil(timeDiffHours)} Hours`
			} Left`;
		} else {
			return "Your free trial is over";
		}
	};

	return (
		<>
			<div
				id="dropdown-cta"
				className={`relative p-4 mt-6 rounded-lg bg-stone-100 border-2 border-stone-200 ${
					(isPaid === undefined || isPaid === true) && "hidden"
				}`}
				role="alert"
			>
				<div className="flex items-center mb-3 bg-orange-100">
					<span className="text-md font-semibold mr-2 py-0.5 rounded">
						{getHeading()}
					</span>
				</div>

				<p className="mb-5 text-sm text-stone-800">
					{getTimeDifferenceFromToday(trialEndAt) > 0 &&
						`Your free trial will end at midnight, 
					${new Date(trialEndAt).toLocaleDateString("en-US", {
						// using browser timezone assuming it's the user's set timezone
						// don't want an extra rerender for timezone from $userState
						// only displaying the date (not time) so shouldn't be too bad
						timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						year: "numeric",
						month: "short",
						day: "numeric"
					})}. `}
					Keep thinking your best thoughts!
				</p>

				<BlackButton full id="subscription-modal-btn" onClick={handleOpenModal}>
					Subscribe
				</BlackButton>
			</div>
			<SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={closeSubscriptionModal} />
		</>
	);
}
