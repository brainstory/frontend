export default function Button({
	children,
	icon = null,
	full = false,
	left = false,
	iconClasses = "",
	classes = "",
	disabled = false,
	sr = "",
	href = null,
	...props
}) {
	return (
		<a href={href}>
			<button
				className={`flex items-center rounded-md ${
					children !== undefined ? "px-4" : "px-2"
				} py-2 text-sm font-medium focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-pink-300 transition-all ${
					full && "w-full"
				} ${left ? "justify-start" : "justify-center"} ${
					disabled && "opacity-50 cursor-not-allowed"
				} ${classes}`}
				disabled={disabled}
				{...props}
			>
				{icon && (
					<span
						className={`inline-flex items-start ${
							children !== undefined ? "w-4 mr-2" : "justify-center w-6 h-6"
						} ${iconClasses}`}
					>
						<ion-icon
							class={`hydrated ${children !== undefined ? "" : "w-6 h-6"}`}
							name={icon}
							role="img"
							aria-label={icon}
						/>
					</span>
				)}
				<span className="sr-only">{sr}</span>
				{children}
			</button>
		</a>
	);
}
