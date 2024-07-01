import Avatar from "@ds/Avatar.jsx";
import Tooltip from "@ds/Tooltip";

export default function EmojiItem({
	ideaId,
	labels,
	creatorEmail,
	onReactionClick = () => null,
	isBlue = true,
	labelsHasBorder = false,
	creatorName = null,
	style = ""
}) {
	const avatarLetter = creatorName ? creatorName.charAt(0) : creatorEmail.charAt(0);

	return (
		<button
			className={"flex flex-col items-center relative " + style}
			onClick={() => onReactionClick()}
		>
			<div
				className={`flex items-center ${!labelsHasBorder && "p-1"} ${
					isBlue && "border rounded-md border-blue-400 bg-blue-50 hover:bg-blue-200"
				}`}
			>
				<Tooltip text={creatorName ? creatorName : creatorEmail} position="left">
					<Avatar style="mr-1" id={creatorEmail} charToShow={avatarLetter} size="6" />
				</Tooltip>
				<div
					className={`flex w-max capitalize ${
						labelsHasBorder && "border rounded-md p-1"
					}`}
				>
					{labels.map((label) => (
						<Tooltip text={label.name} position="left">
							{label.emoji}
						</Tooltip>
					))}
				</div>
			</div>
		</button>
	);
}
