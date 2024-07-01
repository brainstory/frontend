import { CONVERSATION_STATE } from "@src/const";
import ConversationTranscript from "@components/chat/ConversationTranscript";
import EndChatButton from "./reusable/EndChatButton";

export default function ChatIdeaMainSection({
	showTranscript,
	currConversation,
	conversationState,
	handleGetResult,
	minConversationLenForEnd,
	children
}) {
	return (
		<div className={`relative grid grid-cols-5 ${showTranscript ? "gap-3" : ""} grid-flow-row`}>
			{!showTranscript && <div className="col-span-1" />}
			<div
				className={`relative col-span-5 ${
					showTranscript ? "lg:col-span-3" : "lg:col-span-5"
				}`}
			>
				<div className={`flex justify-center flex-col m-6 md:max-w-[50vw] md:mx-auto`}>
					{children}
				</div>
				{currConversation.length >= minConversationLenForEnd && (
					<EndChatButton
						conversationState={conversationState}
						handleGetResult={handleGetResult}
						classes="m-6 mt-0 flex flex-col items-center sm:items-end sm:text-sm"
					/>
				)}
			</div>
			{showTranscript && (
				<div className="p-5 col-span-5 lg:col-span-2 lg:border-l 2xl:border-r border-stone-200">
					<ConversationTranscript
						qna={currConversation}
						isTranscriptionRunning={
							conversationState === CONVERSATION_STATE.TranscribingUser
						}
						isLoadingCoachResponse={
							conversationState === CONVERSATION_STATE.WaitingForCoach
						}
					/>
				</div>
			)}
		</div>
	);
}
