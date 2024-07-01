import Button from "./Button";

export default function PinkButton({
	children,
	icon = null,
	full = false,
	left = false,
	classes = "",
	disabled = false,
	sr = "",
	...props
}) {
	return (
		<Button
			classes={`bg-pink-500 hover:bg-pink-600 text-white ${classes}`}
			icon={icon}
			full={full}
			left={left}
			disabled={disabled}
			sr={sr}
			{...props}
		>
			{children}
		</Button>
	);
}
