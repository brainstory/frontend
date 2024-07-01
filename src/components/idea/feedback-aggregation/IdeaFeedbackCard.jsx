import { useState, useEffect, useRef } from "react";

import EmojiItem from "@components/idea/feedback-aggregation/EmojiItem.jsx";

export default function IdeaFeedbackCard({ feedback, focusedIdea, focusSection }) {
	const { ideaId, creatorEmail, creatorName, createdAt, feedbackText, labels } = feedback;
	const ref = useRef(null);
	const [isTruncated, setIsTruncated] = useState(false);
	const [isShowingMore, setIsShowingMore] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		const { offsetHeight, scrollHeight } = ref.current || {};

		if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
			setIsTruncated(true);
		} else {
			setIsTruncated(false);
		}

		// Check if the feedback is currently focused and scroll into view if true
		if (focusedIdea?.ideaId === ideaId && focusedIdea?.labels === labels) {
			ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
			setIsFocused(true);
		} else {
			// Prevents issue where it doesn't remove if other elements clicked
			setIsFocused(false);
		}
	}, [ref, focusedIdea, ideaId, labels]);

	const containerClasses = `border-stone-200 ${
		isFocused && "outline outline-blue-500 outline-2"
	} m-1 p-3 border rounded-lg shadow transition-all ease-in-out duration-300`;

	function feedbackClicked() {
		focusSection(feedback);
	}

	return (
		<div id={ideaId} className={containerClasses} role="button" onClick={feedbackClicked}>
			<div className="flex mb-2 items-end">
				<EmojiItem
					ideaId={ideaId}
					labels={labels}
					creatorEmail={creatorEmail}
					creatorName={creatorName}
					isBlue={false}
					labelsHasBorder={true}
					style="mr-1"
				/>
				<p className="ml-1 text-xs text-stone-500">{formatDateTime(createdAt)}</p>
			</div>
			<p ref={ref} className={`text-sm leading-snug ${!isShowingMore && "line-clamp-5"}`}>
				{feedbackText}
			</p>
			{isTruncated && (
				<button
					className="mt-2 text-xs text-stone-500"
					onClick={(event) => {
						event.stopPropagation();
						setIsShowingMore((prev) => !prev);
					}}
				>
					{isShowingMore ? "show less" : "show more"}
				</button>
			)}
		</div>
	);
}

function formatDateTime(iso8601Date) {
	const date = new Date(iso8601Date + "Z");

	const timeString = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit"
	});

	const dateString = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});

	return `${timeString} ${dateString}`;
}
