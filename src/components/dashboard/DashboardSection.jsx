import { useState, useEffect } from "react";
import { getAllIdeasApi } from "@helpers/api/user.js";
import { setCookie } from "@helpers/cookie";

import { useStore } from "@nanostores/react";
import { $userState } from "@components/global/userStore.js";

import LoadingScreen from "@components/global/LoadingScreen.jsx";
import LoadingAnimation from "@components/global/LoadingAnimation";
import PinkButton from "@ds/PinkButton";
import Button from "@ds/Button";

import IdeaGrid from "./IdeaGrid.jsx";
import FeedbackGrid from "./FeedbackGrid.jsx";

export default function DashboardSection() {
	const userState = useStore($userState);
	const { userEmail } = userState || {};

	let [userIdeas, setUserIdeas] = useState();
	let [isLoading, setIsLoading] = useState(true);
	let [showGetStarted, setShowGetStarted] = useState(false);

	useEffect(() => {
		getAllIdeasApi()
			.then((ideas) => {
				setUserIdeas(ideas);
			})
			.catch((err) => console.log("error getting ideas data", err))
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		if (userEmail && userIdeas) {
			const hasCreatedIdea = userIdeas.reduce(
				(acc, idea) => acc || userEmail === idea.creatorEmail,
				false
			);
			setShowGetStarted(!hasCreatedIdea);

			// resetting cookie bc max expiration is 400 days on chrome
			// but also for edge case where past users have already created ideas before we implemented /get-started
			setCookie("has_done_getting_started", hasCreatedIdea);
		}
	}, [userEmail, userIdeas]);

	// check if user authenticated, load the dashboard instead of having it flash before going to the log in page
	if (localStorage.getItem("csrf_verify")) {
		return (
			<section>
				<h1 className="mb-2 text-2xl font-bold tracking-tight text-center text-stone-900 md:text-2xl lg:text-4xl">
					Dashboard
				</h1>
				{isLoading ? (
					<LoadingAnimation />
				) : showGetStarted ? (
					<div className="flex flex-col-reverse sm:flex-col gap-8 justify-between items-center my-6">
						<div className="">
							<img
								src={window.innerWidth <= 768 ? "/comic2-2.png" : "/comic1-4.png"}
								className="pointer-events-none pb-1"
								alt="comic inspired by oh no"
							/>

							<div>
								<p className="text-xs text-right text-stone-600 italic">
									Art inspired by 'Oh No Comics' by Alex Norris
								</p>
							</div>
						</div>
						<Button
							classes="bg-stone-200 hover:bg-stone-300 shadow-lg border border-stone-600 rounded-2xl"
							href="/get-started"
						>
							<div className="w-56 p-6 flex flex-col items-center gap-2">
								<ion-icon
									class="hydrated w-16 h-16"
									name="mic-outline"
									role="img"
								/>
								<p>Find a quiet place</p>
								<p className="text-xl font-bold">
									Tap here for your first Brainstory!
								</p>
							</div>
						</Button>
					</div>
				) : (
					<div>
						<FeedbackGrid />
						<IdeaGrid userIdeas={userIdeas} />
					</div>
				)}
			</section>
		);
	} else {
		return <LoadingScreen />;
	}
}
