import { useState, useEffect, useContext } from "react";
import { AppContext } from "@src/components/chat/reusable/AppWrapper";
import { CONVERSATION_STATE } from "../../const";
import { ICON } from "./RecordIcons";
import { transcribeApi } from "@helpers/api/ai";
import ChangeInputTypeButton from "./ChangeInputTypeButton";

function RecordButton({
	isRecording,
	isDisabledOverride,
	conversationState,
	setIsRecording,
	setIsTranscribing,
	setTranscript,
	getCoachResponse,
	time,
	resetTimer,
	isCompressed
}) {
	const RECORDING_MAX_DURATION = 240000; // 4 minutes
	const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	const [timer, setTimer] = useState(null);
	const [warningType, setWarningType] = useState(null);
	const [readyToSend, setReadyToSend] = useState(
		conversationState === CONVERSATION_STATE.ReadyToSendUserTranscript
	);
	const [audioStream, setAudioStream] = useState(null);
	const [mediaRecorder, setMediaRecorder] = useState(null);
	const [status, setStatus] = useState("idle");
	const [isTextInput, setIsTextInput] = useState(false);
	const [userTextInput, setUserTextInput] = useState("");
	const [micPermissionDenied, setMicPermissionDenied] = useState(false);
	const context = useContext(AppContext);

	const buttonSizing = isCompressed ? "w-[54px] h-[54px]" : "w-[96px] h-[96px]";
	const shadownSizing = isCompressed
		? "w-[60px] h-[60px] group-hover:w-[66px] group-hover:h-[66px]"
		: "w-[108px] h-[108px] group-hover:w-[116px] group-hover:h-[116px]";

	useEffect(() => {
		setReadyToSend(conversationState === CONVERSATION_STATE.ReadyToSendUserTranscript);
	}, [conversationState]);

	useEffect(async () => {
		if (readyToSend === true) {
			resetTimer();
			await getCoachResponse();
			setReadyToSend(false);
			// clear any possible user text input
			setUserTextInput("");
		}
	}, [readyToSend]);

	useEffect(() => {
		if (!audioStream) {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					setAudioStream(stream);
					let mimeType;
					if (isFirefox) {
						mimeType = "video/webm";
					} else if (isSafari) {
						mimeType = "video/mp4;codecs=avc1";
					} else {
						mimeType = "video/webm;codecs=vp8,opus";
					}
					const mediaRecorder = new MediaRecorder(stream, { mimeType });
					setMediaRecorder(mediaRecorder);
					let audio;

					mediaRecorder.ondataavailable = (event) => {
						if (event.data.size > 0) {
							audio = [event.data];
						}
					};

					mediaRecorder.onstop = (event) => {
						const audioBlob = new Blob(audio, { type: "audio/wav" });
						generateTranscript(audioBlob);
						setStatus("idle");
					};
				})
				.catch((error) => {
					console.error("Error accessing microphone:", error);
					setMicPermissionDenied(true);
				});
		}
	}, [audioStream]);

	const handleToggleRecording = () => {
		if (isRecording) {
			mediaRecorder.stop();
			setIsRecording(false);
			setWarningType(null);
			clearTimeout(timer);
		} else {
			setStatus("recording");
			setWarningType(null);
			mediaRecorder.start();
			setIsRecording(true);

			const recordingTimeout = setTimeout(() => {
				mediaRecorder.stop();
				setIsRecording(false);
				setWarningType("timer"); // Set warning when time limit is exceeded
			}, RECORDING_MAX_DURATION);

			setTimer(recordingTimeout);
		}
	};

	function handleError(error) {
		setIsTranscribing(false);
		setTranscript("");
		console.log(error);
		setReadyToSend(false);
		setWarningType("error");
	}

	function generateTranscript(blobby, retriesLeft = 1) {
		setIsTranscribing(true);

		const apiCall = transcribeApi;

		apiCall(blobby)
			.then((transcript) => {
				setTranscript(transcript);
				setIsTranscribing(false);
				setReadyToSend(true);
			})
			.catch((error) => {
				if (retriesLeft >= 1) {
					retriesLeft--;
					setTimeout(() => {
						console.log("Error in API, retrying once");
						generateTranscript(blobby, retriesLeft);
					}, 500);
				} else {
					handleError(error);
				}
			});
	}

	function handleTextareaChange(event) {
		setUserTextInput(event.target.value);
	}

	function handleTextSend() {
		setTranscript(userTextInput);
	}

	function renderInputComponent() {
		if (isTextInput) {
			return (
				<div className="flex justify-center items-end w-full">
					<textarea
						className="w-full max-w-[500px] text-sm px-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-blue-500 resize-none md:resize-y"
						placeholder="Type something..."
						rows="5"
						value={userTextInput}
						onChange={handleTextareaChange}
						onKeyDown={handleKeyDown}
					></textarea>
					<button
						className="flex items-center h-[36px] w-[36px] ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
						onClick={handleTextSend}
						onKeyDown={handleKeyDown}
					>
						<ion-icon class="w-8 h-8 hydrated" name="send"></ion-icon>
					</button>
				</div>
			);
		} else if (micPermissionDenied) {
			return (
				<div>
					<div className="w-[244px] mx-auto group relative flex justify-center items-center my-4">
						<div
							className={`${shadownSizing} pointer-events-none rounded-full absolute bg-gradient-to-r from-pink-500 via-pink-400 to-pink-700 opacity-40 blur transition-all duration-300`}
						></div>
						<button
							className={`${buttonSizing} bg-white relative flex justify-center items-center shadow-xl border-[1px] border-stone-200 text-stone-500 font-bold rounded-full cursor-not-allowed opacity-70`}
						>
							{ICON.MicOff}
						</button>
					</div>
					<div className="text-black text-base">
						<p>Mark can't hear you without your mic!</p>
						<p>
							<b>Allow microphone</b> in your browser or device settings{" "}
							{isSafari ? "and refresh" : ""}
						</p>
					</div>
				</div>
			);
		} else {
			const { setSludgeman } = context;
			let icon;
			const baseStyleClasses = `${buttonSizing} focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-pink-300 relative flex items-center justify-center bg-white shadow-xl border-[1px] border-stone-200 text-stone-500 hover:text-stone-700 font-bold rounded-full disabled:opacity-40 disabled:cursor-not-allowed group:hover:scale-105 transform transition-transform hover:bg-stone-100 transition-colors duration-300 `;
			let disabled =
				isDisabledOverride ||
				conversationState === CONVERSATION_STATE.WaitingForCoach ||
				conversationState === CONVERSATION_STATE.TranscribingUser;
			let onClickHandler = () => {};

			if (isRecording) {
				icon = ICON.Recording;
				onClickHandler = () => {
					setSludgeman("idle");
					handleToggleRecording();
				};
			} else {
				icon = ICON.ReadyToRecord;
				onClickHandler = () => {
					setSludgeman("jump");
					handleToggleRecording();
				};
			}
			return (
				<div>
					<div className="w-[244px] group relative flex justify-center items-center my-4">
						<div
							className={`${
								isRecording && "animate-spin"
							} ${shadownSizing} pointer-events-none group-hover:w-[116px] group-hover:h-[116px] rounded-full absolute bg-gradient-to-r from-pink-500 via-pink-400 to-pink-700 opacity-60 hover:opacity-90 blur transition-all duration-300`}
						></div>
						<button
							disabled={disabled}
							className={baseStyleClasses}
							onClick={onClickHandler}
						>
							{icon}
						</button>
					</div>
					<p>{status === "idle" ? "ready to listen" : status}</p>
				</div>
			);
		}
	}

	function onInterfaceToggle() {
		setIsTextInput(!isTextInput);
	}

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleTextSend();
		}
	}

	const warningBoxStyle =
		"flex justify-center fixed z-50 left-0 right-0 w-3/4 mx-auto bg-red-700 text-white py-4 px-4 rounded-lg shadow-lg flex items-center top-8";

	return (
		<>
			{renderInputComponent()}
			{warningType && (
				<div className={warningBoxStyle}>
					<p className="text-sm font-semibold">
						{warningType === "error"
							? "An error occurred. Please contact help@brainstory.ai for help"
							: "Maximum recording time 4 minutes reached. Send message to continue."}
					</p>
				</div>
			)}
			<ChangeInputTypeButton isTextInput={isTextInput} onToggle={onInterfaceToggle} />
			{/* show time limit almost up warning if 20 seconds from max  */}
			{time + 30 > RECORDING_MAX_DURATION / 1000 && time !== 239 && (
				<div className="flex justify-center fixed z-50 top-8 left-0 right-0 w-3/4 mx-auto bg-amber-400 text-black py-4 px-4 rounded-lg shadow-lg flex items-center">
					<p className="text-sm font-semibold">
						{`Max recording limit of 4 minutes almost reached. You have ${
							RECORDING_MAX_DURATION / 1000 - (time + 1)
						} seconds remaining`}
					</p>
				</div>
			)}
		</>
	);
}

export default RecordButton;
