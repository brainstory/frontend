import TransparentButton from "@ds/TransparentButton";

export default function FeedbackModalTitleBar({
	ideaTitle,
	onClose,
	onBack = null,
	overrideTitle = null
}) {
	const h2Style = "mr-3 text-xl font-semibold text-gray-900";

	return (
		<div className="flex flex-row items-start justify-between p-4 sm:p-7 pb-2">
			<span className="flex flex-row items-start">
				{onBack && (
					<TransparentButton
						onClick={onBack}
						classes="w-8 h-8 mr-3"
						icon="arrow-back"
						sr="Go back to more share options"
					/>
				)}
				{overrideTitle ? (
					<h2 className={h2Style}>{overrideTitle}</h2>
				) : (
					<h2 className={h2Style}>
						Get Feedback on
						<p className="text-pink-700 italic line-clamp-1 text-ellipsis">
							{ideaTitle}
						</p>
					</h2>
				)}
			</span>
			<TransparentButton onClick={onClose} classes="w-8 h-8" icon="close" sr="Close modal" />
		</div>
	);
}
