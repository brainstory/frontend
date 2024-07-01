import { useState } from "react";

export default function CollapsingText({
	children,
	openLabel = "",
	closeLabel = "Show",
	initCollapsed = false,
	labelStyle
}) {
	const [isCollapsed, setIsCollapsed] = useState(initCollapsed);

	let labelClasses = "text-stone-500 md:text-xl mt-3.5 text-base cursor-pointer";

	if (labelStyle === "bold") {
		labelClasses = "my-6 text-xl font-semibold cursor-pointer";
	}

	return (
		<div className="relative pl-4">
			<CollapsingButton
				collapsed={isCollapsed}
				setCollapsed={setIsCollapsed}
				labelStyle={labelStyle}
			/>
			<div
				className={`${
					isCollapsed ? "h-0" : "h-84 sm:h-84"
				} transition-all delay-100 duration-200 overflow-hidden`}
			>
				<p
					className={labelClasses}
					onClick={() => {
						setIsCollapsed(!isCollapsed);
					}}
				>
					{openLabel}
				</p>
				{children}
			</div>
			<div
				className={`${
					isCollapsed ? "mb-3.5" : "h-0 hidden"
				} transition-all delay-150 duration-200`}
			>
				<p
					className={labelClasses}
					onClick={() => {
						setIsCollapsed(!isCollapsed);
					}}
				>
					{closeLabel}
				</p>
			</div>
		</div>
	);
}

function CollapsingButton({ collapsed, setCollapsed, labelStyle }) {
	let arrowClasses = "absolute -left-2 sm:-left-4 top-4 sm:top-5 text-stone-500 text-base";

	if (labelStyle === "bold") {
		arrowClasses = "absolute -left-2 top-[1.9rem]";
	}
	return (
		<button
			className={arrowClasses}
			onClick={() => {
				setCollapsed(!collapsed);
			}}
		>
			<ion-icon
				class="w-4 sm:w-6 md:w-8 sm:h-6 md:h-8 md hydrated"
				name={collapsed ? "chevron-forward-outline" : "chevron-down-outline"}
				role="img"
				aria-label="chevron-down-outline outline"
			></ion-icon>
		</button>
	);
}
