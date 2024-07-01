import React from "react";
import LoadingAnimation from "@components/global/LoadingAnimation";
import { CONVERSATION_STATE } from "@src/const";

function RenderFromState({ conversationState }) {
	const renderList = [];

	if (conversationState === CONVERSATION_STATE.WaitingForCoach) {
		renderList.push(
			<div key={`status-${conversationState}`} className="mx-auto text-center flex flex-col">
				<LoadingAnimation
					isVertical={true}
					text="sending message..."
					key={`state-${conversationState}`}
				/>
			</div>
		);
	} else if (conversationState === CONVERSATION_STATE.TranscribingUser) {
		renderList.push(
			<div
				key={`status-${conversationState}`}
				className="mx-auto text-center flex flex-col leading-snug"
			>
				<LoadingAnimation
					isVertical={true}
					text={[
						"transcribing...",
						<br key="loading-line-break"></br>,
						"may take up to 30 seconds"
					]}
				/>
			</div>
		);
	}

	return renderList;
}

export default RenderFromState;
