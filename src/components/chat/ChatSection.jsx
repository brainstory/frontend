import { useState, useEffect, useRef } from "react";
import {
	CONVERSATION_STATE,
	CHAT_SAVE_STATE,
	ERROR_MESSAGE_MAP,
	MIN_CONVERSATION_LENGTH_BEFORE_SAVE,
	CHAT_TYPE
} from "@src/const";
import {
	handleWebsocketStreamResult,
	addConversationMessage,
	removeLastConversationMessage,
	findMostRecentAssistantContent,
	getFirstPrompt,
	useIdeaIdFromUrl
} from "@helpers/chat";
import { setCookie } from "@helpers/cookie";
import { getIdeaApi, createIdeaApi, updateIdeaApi } from "@helpers/api/idea";
import { generateResponseApi, generateResponseStreamApi } from "@helpers/api/ai";
import { getQueryParam, callApiWithRetry } from "@helpers/helpers";

import ChatRecorder from "@components/chat/reusable/ChatRecorder";
import FinishedResultSection from "@components/chat/reusable/FinishedResultSection";
import ChatIdeaMainSection from "@components/chat/ChatIdeaMainSection";
import ChatFeedbackMainSection from "@components/chat/ChatFeedbackMainSection";
import MicPermissionModal from "@components/chat/reusable/MicPermissionModal";
import ErrorSection from "@components/error/ErrorSection";

import { AssistantResponseText } from "@components/chat/AssistantResponseText";
import ChatTopBar from "./reusable/ChatTopBar";

const parentId = getQueryParam("parentId");
const isFeedbackAndFrom = getQueryParam("isFeedbackAndFrom");
const isFromGuide = getQueryParam("topic");
let chatType = CHAT_TYPE.ORIGINAL;
if (getQueryParam("dailyIntent")) {
	chatType = CHAT_TYPE.DAILY_INTENT;
} else if (parentId) {
	chatType = CHAT_TYPE.FEEDBACK;
}

export function ChatSection({ draftId, dailyLogId, conversationEndCallbacks }) {
	const [result, setResult] = useState("");
	const [parentIdea, setParentIdea] = useState();
	const [conversationState, setConversationState] = useState(CONVERSATION_STATE.Start);
	const [ideaId, setIdeaId] = useState(draftId);
	/** true if result finished generating result */
	const [readyToSave, setReadyToSave] = useState(false);
	/** true if there's no id in query param and conversation meets length */
	const [readyToCreateIdea, setReadyToCreateIdea] = useState(false);
	/** true if user message was inappropriate by openai */
	const [isUserResendRequired, setIsUserResendRequired] = useState(false);
	/** if isUserResendRequired is true, then this field value is the inappropriate flagged transcript */
	const [inappropriateUserTranscript, setInappropriateUserTranscript] = useState(null);
	const [showTranscript, setShowTranscript] = useState(false);
	/** display error component as the section instead of mic ui */
	const [errorComponent, setErrorComponent] = useState();
	/** true if saving is in progress, false if already saved */
	const [saveState, setSaveState] = useState(CHAT_SAVE_STATE.WAITING);
	/** true if close mic permissions modal */
	const [isMicPermissionModalClose, setIsMicPermissionModalClose] = useState(false);

	let firstPrompt = getFirstPrompt(chatType);
	const localStoreConversation = JSON.parse(localStorage.getItem(`currConversation+${parentId}`));
	const [currConversation, setCurrConversation] = useState(
		isFeedbackAndFrom && localStoreConversation
			? localStoreConversation
			: [{ role: "assistant", content: firstPrompt }]
	);
	const askADifferentQuestionString = "Ask me a different question!";
	const minConversationLenForCreateAndEnd =
		MIN_CONVERSATION_LENGTH_BEFORE_SAVE[chatType] ||
		MIN_CONVERSATION_LENGTH_BEFORE_SAVE.DEFAULT;

	const hasMounted = useRef(false);

	useIdeaIdFromUrl(hasMounted, setIdeaId);

	useEffect(() => {
		// this useEffect is to protect from creating duplicates of the same idea if the currConversation is set twice
		// perhaps to the same value but the useEffect is triggered since array variables are pointers to memory
		// WARNING: this is a bandiad as it doesn't help debug why currConversation might be set twice to the same value
		if (readyToCreateIdea) {
			createIdeaApi(result, currConversation, chatType, parentId, dailyLogId).then(
				(createdIdeaId) => {
					console.log("NEW IDEA CREATED", createdIdeaId);
					setIdeaId(createdIdeaId);
					let url = new URL(window.location.href);
					let params = new URLSearchParams(url.search);
					params.set("id", createdIdeaId);
					history.pushState(null, null, "?" + params.toString());
				}
			);
		}
	}, [readyToCreateIdea]);

	useEffect(() => {
		if (currConversation.length >= minConversationLenForCreateAndEnd) {
			if (ideaId) {
				updateIdeaApi(ideaId, currConversation)
					.then(() => {
						console.log("SAVED", ideaId);
						// don't show SAVED visual for saving the user message so that
						// the switch from SAVING to SAVED doesn't happen twice
						if (currConversation[currConversation.length - 1].role === "assistant") {
							setSaveState(CHAT_SAVE_STATE.SUCCESS);
						}
					})
					.catch((e) => {
						console.log("save failed", e);
						setSaveState(CHAT_SAVE_STATE.FAILED);
					});
			} else {
				console.log("Meets requirements for creating idea to database", currConversation);
				setReadyToCreateIdea(true);
			}
		}
	}, [currConversation]);

	useEffect(() => {
		if (ideaId) {
			getIdeaApi(ideaId)
				.then((res) => {
					if (res.summary) {
						// if result already present, change to idea result page
						// it's not the smoothest transition I'll admit
						window.location.href = `/idea?id=${res.id}`;
						return;
					}
					// this is commented out because chatType should be updated if it'll be a variable that will be used beyond creation
					// but right now, it's only used when the idea has not been created yet and therefore this update doesn't matter
					// if (res.type) {
					// 	chatType = res.type;
					// }
					const savedConversation = [...res.transcript];
					// only set if values are different from db in order to not trigger an extra update to the db
					if (JSON.stringify(savedConversation) !== JSON.stringify(currConversation)) {
						setCurrConversation(savedConversation);
						const lastMessage = savedConversation.at(-1);
						if (lastMessage?.role === "user") {
							setConversationState(CONVERSATION_STATE.ReadyToSendUserTranscript);
						} else {
							setConversationState(CONVERSATION_STATE.Idle);
						}
					}

					const parentIdData = res.parentIdea?.id;
					if (parentIdData) {
						fetchParentIdea(parentIdData);
					}
				})
				.catch((err) => {
					console.log("idea not found with ID " + ideaId, err);
					setErrorComponent(
						<ErrorSection
							title="Draft idea not found"
							paragraphs={[
								"This draft does not exist or you do not have access",
								"If you did not mean to open a draft, start a new idea instead"
							]}
						/>
					);
				});
		} else if (parentId) {
			// when idea id isn't in the query parameter bc the idea hasn't been created yet
			fetchParentIdea(parentId);
		}
	}, [ideaId]);

	const fetchParentIdea = (parentId) => {
		getIdeaApi(parentId)
			.then((res) => {
				let ideaContent = {
					id: res.id,
					title: res.title,
					summary: res.summary
				};
				document.title = `Feedback for \"${res.title}\"`;
				setParentIdea(ideaContent);
			})
			.catch((err) => {
				console.log("Parent Idea not found with ID " + parentId, err);
				setErrorComponent(
					<ErrorSection
						title="Shared idea not found"
						paragraphs={["This idea does not exist or you do not have access"]}
					/>
				);
			});
	};

	/** Generate assistant response. NOT for the final outline result. */
	const handleGetResponse = () => {
		setConversationState(CONVERSATION_STATE.WaitingForCoach);
		try {
			const apiCall = () => generateResponseApi(currConversation, parentIdea?.summary);
			callApiWithRetry(apiCall)
				.then((message) => {
					const isUser = false;
					addConversationMessage(
						message,
						isUser,
						currConversation,
						setCurrConversation,
						() =>
							currConversation.length >= minConversationLenForCreateAndEnd &&
							setSaveState(CHAT_SAVE_STATE.SAVING)
					);
					setIsUserResendRequired(false);
					setInappropriateUserTranscript(null);
				})
				.catch((err) => {
					if (err.message.includes(ERROR_MESSAGE_MAP[469])) {
						setIsUserResendRequired(true);
						const removedMessage = removeLastConversationMessage(
							currConversation,
							setCurrConversation
						);
						setInappropriateUserTranscript(removedMessage);
					}
				})
				.finally(() => {
					setConversationState(CONVERSATION_STATE.Idle);
				});
		} catch (error) {
			console.error(error);
			setConversationState(CONVERSATION_STATE.Idle);
		}
	};

	/** Generate idea summary result */
	const handleGetResult = () => {
		conversationEndCallbacks();
		setConversationState(CONVERSATION_STATE.FinishWithResult);
		const resultFinishedCallbacks = (result) => {
			setReadyToSave(true);
			// final update with saving result
			updateIdeaApi(ideaId, currConversation, result);
			if (isFromGuide) {
				setCookie("has_done_getting_started", true);
			}
		};
		handleWebsocketStreamResult(
			() => generateResponseStreamApi(currConversation, true, parentIdea?.summary),
			setResult,
			resultFinishedCallbacks
		);
	};

	const askADifferentQuestion = async () => {
		const isUser = true;
		addConversationMessage(
			askADifferentQuestionString,
			isUser,
			currConversation,
			setCurrConversation,
			() => {
				currConversation.length >= minConversationLenForCreateAndEnd &&
					setSaveState(CHAT_SAVE_STATE.SAVING);
			}
		);
		setConversationState(CONVERSATION_STATE.ReadyToSendUserTranscript);
	};

	if (result) {
		return (
			<FinishedResultSection
				ideaId={ideaId}
				result={result}
				parentSummary={parentIdea?.summary}
				readyForFinish={readyToSave}
			/>
		);
	} else if (errorComponent) {
		return errorComponent;
	} else {
		const aiMessageContent = isUserResendRequired
			? inappropriateUserTranscript
			: findMostRecentAssistantContent(currConversation);
		const enableSkip =
			currConversation.length > 1 && conversationState === CONVERSATION_STATE.Idle;

		const mainSectionChildren = [
			<AssistantResponseText
				styleSetting={parentIdea && "feedback"}
				content={aiMessageContent}
				enableSkip={enableSkip}
				handleSkipQuestion={askADifferentQuestion}
				didFailToSend={isUserResendRequired}
			/>,
			<ChatRecorder
				allowFinishMinConversationLength={minConversationLenForCreateAndEnd}
				isCompressed={parentIdea && "feedback"}
				conversationState={conversationState}
				setConversationState={setConversationState}
				currConversation={currConversation}
				setCurrConversation={setCurrConversation}
				setResult={setResult}
				setSaveState={(state) =>
					currConversation.length >= minConversationLenForCreateAndEnd &&
					setSaveState(state)
				}
				handleGetResponse={handleGetResponse}
			/>
		];

		return (
			<section className="wow">
				{!isMicPermissionModalClose && (
					<MicPermissionModal setIsClose={setIsMicPermissionModalClose} />
				)}

				<ChatTopBar
					parentIdea={parentIdea}
					showTranscript={showTranscript}
					setShowTranscript={setShowTranscript}
					leftButtonIcon={
						isFromGuide && !getQueryParam("id") ? "arrow-back-outline" : null
					}
					leftButtonHref="/get-started"
					saveState={saveState}
				/>
				{parentIdea ? (
					<ChatFeedbackMainSection
						showTranscript={showTranscript}
						setShowTranscript={setShowTranscript}
						parentIdea={parentIdea}
						currConversation={currConversation}
						conversationState={conversationState}
						handleGetResult={handleGetResult}
						minConversationLenForEnd={minConversationLenForCreateAndEnd}
					>
						{mainSectionChildren}
					</ChatFeedbackMainSection>
				) : (
					<ChatIdeaMainSection
						showTranscript={showTranscript}
						setShowTranscript={setShowTranscript}
						currConversation={currConversation}
						conversationState={conversationState}
						handleGetResult={handleGetResult}
						minConversationLenForEnd={minConversationLenForCreateAndEnd}
					>
						{mainSectionChildren}
					</ChatIdeaMainSection>
				)}
			</section>
		);
	}
}
