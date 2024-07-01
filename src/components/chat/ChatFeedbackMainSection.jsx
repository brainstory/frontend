import { CONVERSATION_STATE } from "@src/const";
import ConversationTranscript from "@components/chat/ConversationTranscript";
import ParentIdeaText from "@components/global/ParentIdeaText";
import TransparentButton from "@ds/TransparentButton";
import EndChatButton from "./reusable/EndChatButton";

export default function ChatFeedbackMainSection({
	showTranscript,
	setShowTranscript,
	parentIdea,
	currConversation,
	conversationState,
	handleGetResult,
	minConversationLenForEnd,
	children
}) {
	const stickyStyle = "sticky bottom-0 bg-white border-t";
	return (
		<div className="relative grid grid-cols-5 grid-flow-row lg:h-[calc(100vh-158px)] lg:overflow-hidden">
			<div className="relative col-span-5 lg:col-span-3 lg:overflow-y-auto">
				{parentIdea && <ParentIdeaText content={parentIdea?.summary} />}
			</div>
			<div
				className={`${stickyStyle} p-5 col-span-5 lg:col-span-2 lg:border-l 2xl:border-r border-stone-200 lg:overflow-y-auto lg:overflow-x-hidden lg:border-t-0`}
			>
				<div className={`flex justify-center flex-col gap-2`}>{children}</div>
				<div className="flex flex-col items-center">
					{currConversation.length >= minConversationLenForEnd && (
						<EndChatButton
							conversationState={conversationState}
							handleGetResult={handleGetResult}
							classes="flex flex-col items-center"
						/>
					)}
					{currConversation.length > 1 && (
						<TransparentButton
							classes="border border-stone-200 mt-6 hidden sm:block"
							onClick={() => {
								setShowTranscript(!showTranscript);
							}}
						>
							{showTranscript ? "Hide Transcript" : "Show Transcript"}
						</TransparentButton>
					)}
					{showTranscript && (
						<div className="mt-4">
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
			</div>
		</div>
	);
}
