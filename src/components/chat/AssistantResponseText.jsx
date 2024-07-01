import RivePencil from "@components/global/RivePencil";
import { useAppContext } from "@src/components/chat/reusable/AppWrapper";
import TransparentButton from "@ds/TransparentButton";
import Tooltip from "@ds/Tooltip";

export function AssistantResponseText({
	content,
	enableSkip,
	handleSkipQuestion,
	didFailToSend,
	styleSetting
}) {
	const { sludgeman } = useAppContext();

	let assistantTextStyle = `tracking-tight text-black whitespace-pre-wrap ${
		styleSetting === "feedback"
			? "font-medium text-md md:text-lg leading-tight md:leading-snug mr-1 md:my-0"
			: "font-semibold text-xl md:text-2xl max-w-2xl"
	}`;

	const renderText = () => {
		if (didFailToSend) {
			return (
				<div>
					<p className={assistantTextStyle}>
						Sorry, your message was flagged by OpenAI for being inappropriate. You can
						continue your Brainstory by rewording what you said:
					</p>
					<p className="tracking-tight mt-4 md:text-lg md:leading-snug italic">
						{content}
					</p>
				</div>
			);
		} else {
			return <p className={assistantTextStyle}>{content}</p>;
		}
	};

	return (
		<div className="flex flex-col gap-2 lg:gap-4 md:flex-row justify-center items-center">
			<div className="sludge-sludge-maaaan hidden lg:block">
				{sludgeman == "idle" ? (
					<RivePencil type="wave" small={styleSetting === "feedback"} />
				) : (
					<RivePencil type="jump" small={styleSetting === "feedback"} />
				)}
			</div>
			{renderText()}
			<Tooltip text="Another question">
				<TransparentButton
					id="subscription-modal-btn"
					icon="refresh"
					title="Ask a different question"
					classes={`${!enableSkip && "cursor-not-allowed"}`}
					onClick={handleSkipQuestion}
					disabled={!enableSkip}
				/>
			</Tooltip>
		</div>
	);
}
