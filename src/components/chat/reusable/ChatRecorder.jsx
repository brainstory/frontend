import { useState, useEffect } from "react";
import { CONVERSATION_STATE, CHAT_SAVE_STATE } from "@src/const";
import { addConversationMessage } from "@helpers/chat";
import AudioRecorder from "@components/recording-ui/AudioRecorder";

/**
 * PLEASE: state var conversationState setting logic should only be in this component!
 *
 * aka don't pass setConversationState as a prop to children
 * This is so state changes can tracked easier rather than having it done in child components
 */
export default function ChatRecorder({
	conversationState,
	setConversationState,
	currConversation,
	setCurrConversation,
	setSaveState,
	handleGetResponse,
	isCompressed,
	allowFinishMinConversationLength
}) {
	/** if the min content required is met, allow for the user to get the final result */
	const [allowFinish, setAllowFinish] = useState(
		currConversation.length >= allowFinishMinConversationLength
	);
	/** if the max content is met, disable further addition to conversation */
	const [forceFinish, setForceFinish] = useState(currConversation.length > 100);

	useEffect(() => {
		if (currConversation.length >= allowFinishMinConversationLength) {
			setAllowFinish(true);
		} else if (currConversation.length > 100) {
			// TODO picked an arbitrary number for now
			setForceFinish(true);
		}
	}, [currConversation]);

	useEffect(
		() => console.log("conversationState change:", conversationState, currConversation),
		[conversationState]
	);

	return (
		<section
			className={`w-full ${
				isCompressed ? "md:py-4 py-2" : "md:p-8 p-4"
			} bg-white flex justify-center items-center flex-col rounded-lg`}
		>
			<AudioRecorder
				isCompressed={isCompressed}
				isDisabled={forceFinish}
				conversationState={conversationState}
				currConversation={currConversation}
				setIsTranscribing={(isTranscribing) => {
					if (isTranscribing) {
						setConversationState(CONVERSATION_STATE.TranscribingUser);
					}
				}}
				setUiTranscript={async (userMessage) => {
					const isUser = true;
					await addConversationMessage(
						userMessage,
						isUser,
						currConversation,
						setCurrConversation,
						() => setSaveState(CHAT_SAVE_STATE.SAVING)
					);
					setConversationState(CONVERSATION_STATE.ReadyToSendUserTranscript);
				}}
				getCoachResponse={async () => await handleGetResponse()}
				startRecordingCallback={() => setSaveState(CHAT_SAVE_STATE.WAITING)}
			/>
			{/* <div className="mt-8">{renderButton()}</div> */}
		</section>
	);
}
