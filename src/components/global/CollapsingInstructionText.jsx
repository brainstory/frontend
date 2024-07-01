import CollapsingText from "./CollapsingText";

export default function CollapsingInstructionText({
	displayLabel = "",
	closeLabel = "Show me the instructions again.",
	initCollapsed = false
}) {
	return (
		<CollapsingText
			openLabel={displayLabel}
			closeLabel={closeLabel}
			initCollapsed={initCollapsed}
		>
		</CollapsingText>
	);
}
