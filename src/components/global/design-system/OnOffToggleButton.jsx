import { useState } from "react";

export default function OnOffToggleButton({
	id = null,
	checkedState = "On",
	uncheckedState = "Off",
	defaultChecked = false,
	onToggle,
	disabled
}) {
	const [isChecked, setIsChecked] = useState(defaultChecked);

	const handleCheckboxChange = (event) => {
		if (disabled) return;
		const newCheckedState = event.target.checked;
		setIsChecked(newCheckedState);

		// Call callback with updated state
		onToggle(newCheckedState);
	};

	const handleKeyDown = (e) => {
		if ((e.key === " " || e.key === "Enter") && !disabled) {
			setIsChecked(!isChecked);
			onToggle(!isChecked);
		}
	};

	return (
		<>
			<label
				id={id}
				disabled={disabled}
				className={`m-1 border shadow rounded-full relative inline-flex cursor-pointer select-none items-center ${
					isChecked
						? "transition-colors duration-500 bg-green-200 border-green-400"
						: "transition-colors duration-500 bg-stone-200 border-stone-300"
				} ${disabled && "opacity-70"}`}
				tabIndex="0"
				role="switch"
				aria-checked={isChecked}
				onKeyDown={handleKeyDown}
			>
				<input
					type="checkbox"
					checked={isChecked}
					onChange={handleCheckboxChange}
					tabIndex="-1"
					className="sr-only index-0"
				/>
				{/* Hover state to show if checked */}
				<div
					className={`h-[30px] w-[30px] bg-white absolute rounded-full transition-transform duration-500 ml-[4px] mr-[4px] ${
						isChecked && "transform translate-x-[42px]"
					}`}
				></div>
				<div className={`flex h-[36px] rounded-md`}>
					<span
						aria-label={uncheckedState}
						className={`${
							isChecked
								? "transition-opacity opacity-100 duration-500"
								: "transition-none opacity-0"
						} pl-1 text-xs font-medium flex w-[40px] items-center justify-center rounded`}
					>
						{checkedState}
					</span>
					<span
						aria-label={uncheckedState}
						className={`${
							!isChecked
								? "transition-opacity opacity-100 duration-500"
								: "transition-none opacity-0"
						} pr-1 text-xs font-medium flex w-[40px] items-center justify-center rounded`}
					>
						{uncheckedState}
					</span>
				</div>
			</label>
		</>
	);
}
