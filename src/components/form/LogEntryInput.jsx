import { useEffect } from "react";

import OnOffToggleButton from "@components/global/design-system/OnOffToggleButton";

export default function LogEntryInput({
	id,
	text,
	value,
	onChange,
	checkedState = "Yes",
	uncheckedState = "No",
	...props
}) {
	return (
		<div className="flex justify-between items-center text-sm md:text-md leading-snug">
			<p className="pr-2">{text}</p>
			<OnOffToggleButton
				id={id}
				checkedState={checkedState}
				uncheckedState={uncheckedState}
				defaultChecked={value}
				onToggle={onChange}
				{...props}
			/>
		</div>
	);
}
