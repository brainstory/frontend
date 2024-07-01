export default function Tooltip({ children, text, position, classes = "" }) {
	let positionClasses = "left-1/2 -translate-x-1/2";
	if (position) {
		positionClasses = position;
	}

	const tooltipClass = `${positionClasses} pointer-events-none group-hover:opacity-100 transition-opacity bg-stone-800 p-2 px-4 text-xs text-white rounded-md absolute translate-y-10 opacity-0 z-50 text-center`;
	const containerClass = `group flex relative ${classes}`;

	return (
		<div className={containerClass}>
			{children}
			<span className={tooltipClass}>{text}</span>
		</div>
	);
}
