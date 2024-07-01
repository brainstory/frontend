import { CONVERSATION_STATE } from "@src/const";
import BlackButton from "@ds/BlackButton";

export default function EndChatButton({ conversationState, handleGetResult, classes = "" }) {
	return (
		<div className={`inline-block ${classes}`}>
			<p className="text-xs sm:text-sm mb-1">Ready to end your session?</p>
			<BlackButton
				icon={CONVERSATION_STATE.FinishWithResult ? null : "exit-outline"}
				disabled={
					!(
						conversationState === CONVERSATION_STATE.Start ||
						conversationState === CONVERSATION_STATE.Idle ||
						conversationState === CONVERSATION_STATE.ReadyToSendUserTranscript
					)
				}
				onClick={() => handleGetResult()}
			>
				{conversationState === CONVERSATION_STATE.FinishWithResult
					? "Loading summary..."
					: "Generate Summary & Save"}
			</BlackButton>
		</div>
	);
}
