import IdeaFeedbackCard from "@components/idea/feedback-aggregation/IdeaFeedbackCard.jsx";

export default function IdeaSidebar({
	headingIdxToComments,
	currentFocusedFeedback,
	onFeedbackClick,
	canShare
}) {
	const renderCommentCards = () => {
		const sortedHeadingIndices = Object.keys(headingIdxToComments);
		sortedHeadingIndices.sort();

		if (sortedHeadingIndices.length === 0) {
			return (
				<p className="w-[256px] text-sm">
					No comments found. {canShare && "Share your idea to get feedback!"}
				</p>
			);
		}

		let allComments = [];
		for (let i = 0; i < sortedHeadingIndices.length; i++) {
			const hid = sortedHeadingIndices[i];
			const sectionComments = headingIdxToComments[hid].reduce((acc, currValue) => {
				acc.push({ hid: hid, ...currValue });
				return acc;
			}, []);
			allComments.push(...sectionComments);
		}

		return allComments.map((comment, index) => {
			return (
				<IdeaFeedbackCard
					feedback={comment}
					key={`${comment.creatorName}_${index}`}
					focusSection={focusSection}
					focusedIdea={currentFocusedFeedback}
				/>
			);
		});
	};

	function focusSection(feedback) {
		onFeedbackClick(feedback);
	}

	return (
		<div className="w-[19.5rem] p-4 mx-2 mb-2 rounded-lg border border-stone-200">
			<h1 className="text-lg font-semibold mb-2">All Feedback Comments</h1>
			<div className="h-[calc(100%-40px)] overflow-y-auto flex flex-col gap-y-1">
				{renderCommentCards()}
			</div>
		</div>
	);
}
