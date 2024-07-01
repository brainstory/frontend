import { useEffect, useState } from "react";
import { CHAT_SAVE_STATE } from "@src/const";

import TransparentButton from "@ds/TransparentButton";
import ChatIntroText from "@components/chat/ChatIntroText";

export default function ChatTopBar({
	parentIdea,
	showTranscript,
	setShowTranscript,
	leftButtonIcon,
	leftButtonHref,
	saveState
}) {
	const [saveIconName, setSaveIconName] = useState();
	const isLeftButton = leftButtonHref && leftButtonIcon;

	useEffect(() => {
		let iconName = null;
		if (saveState === CHAT_SAVE_STATE.SAVING) {
			iconName = "sync-outline"; //reload-circle-outline
		} else if (saveState === CHAT_SAVE_STATE.SUCCESS) {
			iconName = "checkmark-outline";
		} else if (saveState === CHAT_SAVE_STATE.FAILED) {
			iconName = "close-outline";
		}
		setSaveIconName(iconName);
	}, [saveState]);

	const renderLeftComponent = () => {
		if (saveIconName) {
			return (
				<div className="flex items-center flex-nowrap gap-1 text-sm">
					<ion-icon
						name={saveIconName}
						class="hydrated w-5 h-5 text-stone-500"
					></ion-icon>
					<p className="text-stone-500">{saveState}</p>
				</div>
			);
		} else if (isLeftButton) {
			return (
				<TransparentButton
					icon={leftButtonIcon}
					onClick={() => {
						window.location.href = leftButtonHref;
					}}
					classes="order-first"
				/>
			);
		} else {
			return <div />;
		}
	};

	return (
		<div className={`flex justify-between z-10 w-full p-4 bg-white border-b border-stone-200 rounded-t-lg ${!parentIdea && "sm:grid sm:grid-cols-3"}`} >
			{renderLeftComponent()}
			<ChatIntroText parentIdea={parentIdea} classes={`sm:block ${(!parentIdea || saveIconName) && "hidden"} text-center grow`} />
			{!parentIdea && (
				<TransparentButton
					classes="border border-stone-200 order-last ml-auto text-nowrap"
					onClick={() => {
						setShowTranscript(!showTranscript);
					}}
				>
					{showTranscript ? "Hide Transcript" : "Show Transcript"}
				</TransparentButton>
			)}
		</div>
	);
}
