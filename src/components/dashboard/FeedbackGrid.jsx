import { useState, useEffect } from "react";
import { getAllUserNotifications } from "@helpers/api/user";
import FeedbackNotificationCard from "@src/components/dashboard/FeedbackNotificationCard";
import DailyStreakSection from "./DailyStreakSection.jsx";

export default function FeedbackGrid() {
	let [notifications, setNotifications] = useState([]);

	useEffect(async () => {
		await getAllUserNotifications().then((res) => {
			setNotifications(res);
		});
	}, []);

	return (
		<div className="mb-6 rounded-lg bg-pink-100 mx-auto">
			<DailyStreakSection />
			{notifications.length > 0 && (
				<div className="bg-stone-100 p-5 rounded-b-lg grid">
					<div className="mb-2 font-semibold text-stone-800">
						You have {notifications.length} feedback requests
					</div>
					<div className="inline-block overflow-x-auto">
						<div className="flex gap-2">
							{notifications
								.slice()
								// sort notifications by most recent
								.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
								.map((notification, index) => (
									<FeedbackNotificationCard
										notification={notification}
										key={index}
									/>
								))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
