import { useState, useEffect } from "react";

import { getUserDailyStatusApi } from "@helpers/api/user";
import { getQueryParam } from "@helpers/helpers";
import { CHAT_TYPE } from "@src/const";

import { ChatSection } from "./ChatSection";
import { AppWrapper } from "@components/chat/reusable/AppWrapper";
import DailyIntentModal from "@components/form/DailyIntentModal";

const isDailyIntent = getQueryParam("dailyIntent");

const INTENT_PROGRESS_STATE = {
	start_log: 1,
	conversation: 2,
	end_survey: 3
};

export default function ChatApp() {
	const [logId, setLogId] = useState(null);
	const [draftId, setDraftId] = useState(getQueryParam("id"));
	const [intentProgressState, setIntentProgressState] = useState(
		INTENT_PROGRESS_STATE.conversation
	);
	const [isOpen, setIsOpen] = useState(
		intentProgressState === INTENT_PROGRESS_STATE.start_log
		// || intentProgressState === INTENT_PROGRESS_STATE.end_survey
	);

	useEffect(() => {
		if (isDailyIntent) {
			getUserDailyStatusApi().then((resp) => {
				if (!resp.logId) {
					setIsOpen(true);
					setIntentProgressState(INTENT_PROGRESS_STATE.start_log);
				}
				setLogId(resp.logId);
				if (!!resp.intentIdeaId) {
					// intent idea draft is found
					let url = new URL(window.location.href);
					let params = new URLSearchParams(url.search);
					params.set("id", resp.intentIdeaId);
					history.pushState(null, null, "?" + params.toString());
					setDraftId(resp.intentIdeaId);
				}
			});
		}
	}, []);

	return (
		<AppWrapper>
			{isOpen && (
				<DailyIntentModal
					logId={logId}
					setLogId={setLogId}
					onClose={() => setIsOpen(false)}
					isAtStart={intentProgressState === INTENT_PROGRESS_STATE.start_log}
				/>
			)}
			{/* key field so that rerender happens if daily intent draft idea found */}
			<ChatSection
				key={draftId}
				dailyLogId={logId}
				draftId={draftId}
				conversationEndCallbacks={() => {
					// if (logId) {
					// 	setIsOpen(true);
					// 	setIntentProgressState(INTENT_PROGRESS_STATE.end_survey);
					// }
				}}
			/>
		</AppWrapper>
	);
}
