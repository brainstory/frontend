import { useState } from "react";

import { Card } from "./ProfileCards";
import TimePickerInput from "@components/global/time-picker/TimePickerInput";

import OnOffToggleButton from "@ds/OnOffToggleButton";
import PinkButton from "@ds/PinkButton";

import { useEffect } from "react";

export function NotificationsCard({ notificationsData = [], saveSettings }) {
	const [notificationFields, setNotificationFields] = useState(notificationsData);
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		setNotificationFields(notificationsData);
	}, [notificationsData]);

	const handleSaveClick = () => {
		saveSettings(notificationFields);
		setHasChanged(false);
	};

	const renderNotificationFields = () => {
		return notificationFields.map((field, i) => {
			const handleEnabledToggle = (e) => {
				let updatedNotificationFields = [...notificationFields];
				updatedNotificationFields[i].enabled = !updatedNotificationFields[i].enabled;
				setNotificationFields(updatedNotificationFields);
				setHasChanged(true);
			};
			const setHour = (inputDate) => {
				console.log("setHour", inputDate);
				const hourDigitPadded = String(inputDate.getHours()).padStart(2, "0");
				let updatedNotificationFields = [...notificationFields];
				updatedNotificationFields[i].value = `${hourDigitPadded}:00:00`;
				setNotificationFields([...updatedNotificationFields]);
				setHasChanged(true);
			};

			if (field.valueType === "time") {
				const hourDigit = Number(field.value.split(":")[0]);
				const hourAsDate = new Date(new Date().setHours(hourDigit, 0, 0, 0));

				return (
					<div className="flex justify-between" key={i}>
						<div className="flex flex-col">
							<h3 className="font-medium mb-1">{field.title}</h3>
							<p className="text-sm leading-snug italic">{field.description}</p>
						</div>
						<div className="flex flex-wrap gap-1 justify-end">
							<OnOffToggleButton
								defaultChecked={field.enabled}
								onToggle={handleEnabledToggle}
							/>
							<div className="flex items-center flex-nowrap m-1 gap-1">
								<TimePickerInput
									picker="hours"
									date={hourAsDate}
									setDate={setHour}
									disabled={!field.enabled}
								/>
								<p className="font-mono tabular-nums text-sm">:00</p>
							</div>
						</div>
					</div>
				);
			}
		});
	};

	return (
		<Card columns={3} title="Email Notifications">
			<div className="flex flex-col gap-4">
				{renderNotificationFields(notificationFields)}
			</div>

			<PinkButton disabled={!hasChanged} onClick={handleSaveClick} classes="mt-8 mx-auto">
				Save
			</PinkButton>
		</Card>
	);
}
