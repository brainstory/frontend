import TransparentButton from "@ds/TransparentButton";

export default function ModalTitleBar({ title, onClose, onBack = null, classes }) {
	return (
		<div className={`flex flex-row items-start justify-between ${classes}`}>
			<span className="flex flex-row items-start">
				{onBack && (
					<TransparentButton
						onClick={onBack}
						classes="w-8	h-8 mr-3"
						icon="arrow-back"
						sr="Go back to more share options"
					/>
				)}
				<h2 className="mr-3 text-xl font-semibold text-gray-900">{title}</h2>
			</span>
			<TransparentButton onClick={onClose} classes="w-8 h-8" icon="close" sr="Close modal" />
		</div>
	);
}
