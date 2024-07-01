import IdeaDocument from "@components/idea/feedback-aggregation/IdeaDocument.jsx";
import IdeaSidebar from "@components/idea/feedback-aggregation/IdeaSidebar.jsx";
import React, { useState, useRef } from "react";

export default function IdeaSection({ resultSections, headingIdxToComments, canShare }) {
	// This should be used to tell the side bar which reaction should be scrolled into view
	const [focusedFeedback, setFocusedFeedback] = useState(null);
	const [focusedSection, setFocusedSection] = useState(null);
	const focusFeedbackTimeoutRef = useRef(null);
	const focusSectionTimeoutRef = useRef(null);

	function onDocumentReactionClick(reaction) {
		if (focusFeedbackTimeoutRef.current) {
			clearTimeout(focusFeedbackTimeoutRef.current);
		}

		setFocusedFeedback(reaction);

		// Set a timeout to reset focusedSection to null after 3 seconds
		focusFeedbackTimeoutRef.current = setTimeout(() => {
			setFocusedFeedback(null);
		}, 3000);
	}

	function onFeedbackClick(feedback) {
		if (focusSectionTimeoutRef.current) {
			clearTimeout(focusSectionTimeoutRef.current);
		}

		setFocusedSection(feedback.hid);

		// Set a timeout to reset focusedSection to null after 3 seconds
		focusSectionTimeoutRef.current = setTimeout(() => {
			setFocusedSection(null);
		}, 3000);
	}

	return (
		<div className="flex h-[calc(100vh-11.5rem)]">
			<IdeaDocument
				currentFocusedFeedback={focusedFeedback}
				resultSections={resultSections}
				headingIdxToComments={headingIdxToComments}
				onReactionClick={onDocumentReactionClick}
				focusedSection={focusedSection}
			/>
			<IdeaSidebar
				currentFocusedFeedback={focusedFeedback}
				headingIdxToComments={headingIdxToComments}
				onFeedbackClick={onFeedbackClick}
				canShare={canShare}
			/>
		</div>
	);
}
