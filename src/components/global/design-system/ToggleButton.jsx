import React, { useState } from "react";

export default function ToggleButton({
	id = null,
	checkedState,
	uncheckedState,
	defaultChecked = false,
	onToggle
}) {
	const [isChecked, setIsChecked] = useState(defaultChecked);

	const handleCheckboxChange = (event) => {
		const newCheckedState = event.target.checked;
		setIsChecked(newCheckedState);

		// Call callback with updated state
		onToggle(newCheckedState);
	};

	const handleKeyDown = (e) => {
		if (e.key === " " || e.key === "Enter") {
			setIsChecked(!isChecked);
			onToggle(!isChecked);
		}
	};

	return (
		<>
			<label
				id={id}
				className="bg-stone-200 m-1 border border-stone-300 shadow rounded-lg relative inline-flex cursor-pointer select-none items-center"
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
					className={`h-[30px] w-[60px] bg-white absolute rounded-lg transition-transform duration-500 ml-[4px] mr-[4px] ${
						isChecked && "transform translate-x-[68px]"
					}`}
				></div>
				<div className={`z-10 flex h-[36px] w-[136px] rounded-md`}>
					{/* Checked state */}
					<span
						aria-label={checkedState}
						className={`text-xs flex  w-[68px] items-center justify-center rounded transition duration-500 ${
							!isChecked && "font-bold"
						}`}
					>
						{checkedState}
					</span>
					{/* Unchecked state */}
					<span
						aria-label={uncheckedState}
						className={`text-xs flex w-[68px] items-center justify-center rounded transition duration-500 ${
							isChecked && "font-bold "
						}`}
					>
						{uncheckedState}
					</span>
				</div>
			</label>
		</>
	);
}
