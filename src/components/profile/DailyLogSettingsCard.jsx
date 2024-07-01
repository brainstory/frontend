import React, { useState } from "react";

import { Card } from "./ProfileCards";
import LogEntry from "@components/form/LogEntryInput";
import PinkButton from "@ds/PinkButton";

const getEnabledLogQidsFromData = (apiData) => {
	return apiData.reduce((acc, currField) => {
		if (currField.enabled) {
			acc.push(currField.id);
			return acc;
		}
		return acc;
	}, []);
};

export function DailyLogSettingsCard({ logFieldsData = [], saveSettings }) {
	const [enabledLogQids, setEnabledLogQids] = useState(getEnabledLogQidsFromData(logFieldsData));
	const [hasChanged, setHasChanged] = useState(false);
	const [errorMessage, setErrorMessage] = useState();

	const handleToggle = (toggledId) => {
		let updatedEnabledLogQids = [...enabledLogQids];
		if (enabledLogQids.includes(toggledId)) {
			updatedEnabledLogQids = updatedEnabledLogQids.filter((id) => id !== toggledId);
		} else {
			updatedEnabledLogQids.push(toggledId);
		}
		setEnabledLogQids(updatedEnabledLogQids);
		setHasChanged(true);
	};

	const handleSaveClick = () => {
		if (enabledLogQids.length === 0) {
			setErrorMessage("Must have at least 1 question enabled");
		} else {
			saveSettings(enabledLogQids);
			setHasChanged(false);
			setErrorMessage();
		}
	};

	return (
		<Card
			columns={3}
			title="Daily Log Questions"
			subtitle="Included at the start of every daily intent"
			classes=""
		>
			<div className="flex flex-col gap-4">
				{renderlogFields(logFieldsData, enabledLogQids, handleToggle)}
			</div>
			{errorMessage && <p className="mt-1 text-pink-600 text-sm">{errorMessage}</p>}
			<PinkButton disabled={!hasChanged} onClick={handleSaveClick} classes="mt-6 mx-auto">
				Save
			</PinkButton>
		</Card>
	);
}

const renderlogFields = (logFieldsApiData, enabledLogQids, handleToggle) => {
	// First, format api array data to an object with key as label
	let fieldLabels = [];
	let labelToFields = {};
	logFieldsApiData.forEach((field, i) => {
		const label = field.label;
		const fieldData = {
			id: field.id,
			label: field.label,
			text: field.questionText,
			value: enabledLogQids.includes(field.id)
		};
		if (fieldLabels.includes(label)) {
			labelToFields[label].push(fieldData);
		} else {
			labelToFields[label] = [fieldData];
			fieldLabels.push(label);
		}
	});

	// Iterate over every category of fields, then render each field
	return fieldLabels.map((label) => {
		const fieldsInLabel = labelToFields[label];
		return (
			<div key={label}>
				<h3 className="font-medium underline decoration-pink-500 my-1">{label}</h3>
				<div className="flex flex-col gap-1">
					{fieldsInLabel.map((field, i) => {
						const lineBreak =
							fieldsInLabel.length == i + 1 ? null : (
								<div key={"divider-" + field.id} className="h-[1px] bg-slate-200" />
							);
						return [
							<LogEntry
								key={field.id}
								onChange={() => handleToggle(field.id)}
								checkedState="On"
								uncheckedState="Off"
								{...field}
							/>,
							lineBreak
						];
					})}
				</div>
			</div>
		);
	});
};
