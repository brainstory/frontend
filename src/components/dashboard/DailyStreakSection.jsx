import { useState, useEffect } from "react";

import { getUserDailyStatusApi } from "@helpers/api/user";

export default function DailyStreakSection() {
	const [streakCount, setStreakCount] = useState(0);
	const [intentIdeaId, setIntentIdeaId] = useState(); // if isTodayIntentCompleted is false, this is a draft
	const [isTodayIntentCompleted, setIsTodayIntentCompleted] = useState(false);

	useEffect(() => {
		// TODO pulsing skeleton loading for text
		getUserDailyStatusApi().then((resp) => {
			setStreakCount(resp.streak);
			setIntentIdeaId(resp.intentIdeaId);
			setIsTodayIntentCompleted(resp.isCompleted);
		});
	}, []);

	const renderTodayStatus = () => {
		let textEmphasis = "Great job!";
		let text = "You set today's intent! See it ";
		let link = `/idea?id=${intentIdeaId}`;
		if (!isTodayIntentCompleted) {
			if (streakCount > 0) {
				textEmphasis = "Keep that streak going!";
			} else {
				textEmphasis = intentIdeaId ? "Almost there!" : "Start your streak!";
			}
			text = intentIdeaId ? "Finish today's daily intent " : "Do today's daily intent ";
			link = "/chat?dailyIntent=true";
		}

		return (
			<div className="text-start text-sm sm:text-base">
				<p className="font-semibold tracking-wide">{textEmphasis}</p>
				{text}
				<a className="text-blue-700 hover:underline" href={link}>
					here
				</a>
			</div>
		);
	};
	return (
		<section className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-0 justify-evenly items-center p-5 rounded-t-lg">
			<div className="text-start">
				<div className="flex gap-1 items-center">
					<ion-icon
						class="w-6 h-6 hydrated pointer-events-none fill-red-500"
						name="flame"
					></ion-icon>
					<p className="font-bold tracking-wide text-xl text-nowrap">{streakCount} day</p>
				</div>
				<p className="text-stone-500 text-sm text-nowrap">Daily Intent Streak</p>
			</div>
			<div className="hidden lg:block h-8 w-[1px] bg-stone-400" />
			<div className="">{renderTodayStatus()}</div>
		</section>
	);
}
