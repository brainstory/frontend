import { useState } from "react";

const questionIcon = "help-outline";
const closeIcon = "close-outline";

export default function HelpIcon({ size = 8, classes = "" }) {
	const [isOpen, setIsOpen] = useState(false);
	const [icon, setIcon] = useState(questionIcon);

	const divStyles = `relative text-stone-500 ${classes}`;
	const buttonStyles = `flex items-center justify-center h-${size} w-${size} rounded-full border bg-white`;

	const handleToggleDialog = () => {
		console.log(!isOpen, icon);
		setIsOpen(!isOpen);
		setIcon(isOpen ? questionIcon : closeIcon);
	};

	const handleCloseDialog = () => {
		setIsOpen(false);
		setIcon(questionIcon);
	};

	return (
		<div className={divStyles}>
			{isOpen && (
				<div className="absolute bottom-[36px] right-[36px] z-50 bg-white border rounded-md shadow-lg p-4 text-center">
					<p>Need help? Have feedback?</p>
					<p>
						Contact us at{" "}
						<a className="text-blue-700" href="mailto:support@brainstory.ai">
							support@brainstory.ai
						</a>{" "}
						or via{" "}
						<a className="text-blue-700" href="https://discord.com/invite/jjzRgxZ63h">
							Discord
						</a>
						!
					</p>
				</div>
			)}
			<button
				className={buttonStyles}
				onClick={handleToggleDialog}
				onKeyDown={(e) => {
					if (e.key === "Escape") e.currentTarget.blur();
				}}
				onBlur={handleCloseDialog}
			>
				<ion-icon class="hydrated" name={icon} />
			</button>
		</div>
	);
}
