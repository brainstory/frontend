import { useEffect } from "react";

export default function ChangeInputTypeButton({ isTextInput, onToggle }) {
	const buttonStyle = "text-stone-500 text-sm underline underline-offset-2 hover:no-underline";

	useEffect(() => {}, [isTextInput]);

	if (isTextInput) {
		return (
			<button className={buttonStyle} onClick={onToggle}>
				Switch back for the optimal experience!
			</button>
		);
	} else {
		return (
			<button className={buttonStyle} onClick={onToggle}>
				Not in a place to talk out-loud?
			</button>
		);
	}
}
