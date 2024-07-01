import Button from "./Button";

export default function BorderedButton({
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
			classes={`bg-white hover:bg-slate-200 border border-black text-black disabled:border-slate-500 ${classes}`}
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
