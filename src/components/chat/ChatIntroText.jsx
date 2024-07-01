import { getQueryParam } from "@helpers/helpers";

export default function ChatIntroText({ parentIdea, classes }) {
	const isFeedbackAndFrom = getQueryParam("isFeedbackAndFrom");
	const isDailyIntent = getQueryParam("dailyIntent");

	let title = "New Brainstory";
	if (isFeedbackAndFrom) {
		title = `${isFeedbackAndFrom} shared their idea with you!`;
	} else if (parentIdea?.id) {
		title = "Let's take this idea even further!";
	} else if (isDailyIntent) {
		title = "Let's set your daily intentions!";
	}

	return <h1 className={`my-auto mx-1 text-base text-stone-500 ${classes}`}>{title}</h1>;
}
