import { useState, useEffect, useMemo } from "react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { getArrowByType, getValidHour, setDateByType } from "./utils";

// https://time.openstatus.dev/

export default function TimePickerInput({
	className,
	type = "tel",
	value,
	id,
	name,
	date = new Date(new Date().setHours(0, 0, 0, 0)),
	setDate,
	onChange,
	onKeyDown,
	picker,
	onLeftFocus,
	onRightFocus,
	...props
}) {
	const [flag, setFlag] = useState(false);

	/**
	 * allow the user to enter the second digit within 2 seconds
	 * otherwise start again with entering first digit
	 */
	useEffect(() => {
		if (flag) {
			const timer = setTimeout(() => {
				setFlag(false);
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [flag]);

	const calculatedHour = getValidHour(String(date.getHours()));
	// console.log("calculatedHour", calculatedHour);

	const handleKeyDown = (e) => {
		if (e.key === "Tab") return;
		e.preventDefault();
		// if (e.key === "ArrowRight") onRightFocus?.();
		// if (e.key === "ArrowLeft") onLeftFocus?.();
		if (["ArrowUp", "ArrowDown"].includes(e.key)) {
			const step = e.key === "ArrowUp" ? 1 : -1;
			const newValue = getArrowByType(calculatedHour, step, picker);
			if (flag) setFlag(false);
			const tempDate = new Date(date);
			setDate(setDateByType(tempDate, newValue, picker));
		}
		if (e.key >= "0" && e.key <= "9") {
			const newValue = !flag ? e.key : calculatedHour.slice(1, 2) + e.key;
			// if (flag) onRightFocus?.();
			setFlag((prev) => !prev);
			const tempDate = new Date(date);
			setDate(setDateByType(tempDate, newValue, picker));
		}
	};

	return (
		<Input
			id={id || picker}
			name={name || picker}
			className={cn(
				"w-[48px] text-stone-900 text-center font-mono text-sm tabular-nums focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none disabled:bg-stone-200 disabled:text-stone-700",
				className
			)}
			value={value || calculatedHour}
			onChange={(e) => {
				e.preventDefault();
				onChange?.(e);
			}}
			type={type}
			inputMode="decimal"
			onKeyDown={(e) => {
				onKeyDown?.(e);
				handleKeyDown(e);
			}}
			{...props}
		/>
	);
}
