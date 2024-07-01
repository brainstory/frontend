import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $userState } from "@components/global/userStore.js";

import { getUserSettingsApi, saveUserSettingsApi } from "@helpers/api/settings.js";
import { getQueryParam } from "@helpers/helpers.js";

import { PhotoNameCard, GeneralCard } from "./ProfileCards";
import { DailyLogSettingsCard } from "./DailyLogSettingsCard";
import { NotificationsCard } from "./NotificationsCard";

import LoadingAnimation from "@components/global/LoadingAnimation";
import { Snackbar, ERROR_COPY, SUCCESS_COPY } from "@ds/Snackbar";
import { TailwindComposedTabs } from "@ds/TailwindTabs.jsx";

const TAB_MAP = {
	general: 0,
	dailyLog: 1
};

export default function Profile() {
	const userState = useStore($userState);
	const { userEmail, createdAt } = userState || {};

	const [activeTab, setActiveTab] = useState(0);
	const [userName, setUserName] = useState("");
	const [userTimezone, setUserTimezone] = useState("");
	const [notifications, setNotifications] = useState([]);
	const [dailyLogSettings, setDailyLogSettings] = useState();
	// TODO stupid snack bar makes component rerender way too much
	const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
	const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState(SUCCESS_COPY.DEFAULT);
	const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
	const [snackbarErrorMessage, setSnackbarErrorMessage] = useState(ERROR_COPY.DEFAULT);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setSettingDataFromApi();
		const tab = getQueryParam("tab");
		if (tab) {
			setActiveTab(TAB_MAP[tab]);
		}
	}, []);

	const setSettingDataFromApi = () => {
		getUserSettingsApi()
			.then((res) => {
				setUserName(res.user.name);
				setUserTimezone(res.user.timezone ? res.user.timezone : "Etc/GMT");
				setDailyLogSettings(res.dailyLog);
				setNotifications(res.notifications);
				setIsLoading(false);
			})
			.catch((e) => console.log("error getting user settings", e));
	};

	const openSnackbar = (isSuccess, message) => {
		if (isSuccess) {
			setSnackbarSuccessOpen(true);
			setSnackbarSuccessMessage(message);
		} else {
			setSnackbarErrorOpen(true);
			setSnackbarErrorMessage(message);
		}
	};

	const closeSnackbarAfterTime = (isSuccess) => {
		setTimeout(() => {
			if (isSuccess) {
				setSnackbarSuccessOpen(false);
				setSnackbarSuccessMessage();
			} else {
				setSnackbarErrorOpen(false);
				setSnackbarErrorMessage();
			}
		}, 5000);
	};

	const handleUserSettingsSave = (newName, newTimezone) => {
		saveUserSettingsApi(newName, newTimezone, null, null)
			.then(() => {
				setSettingDataFromApi();
				openSnackbar(true, SUCCESS_COPY.SAVE);
			})
			.catch((e) => {
				openSnackbar(false, ERROR_COPY.SAVE);
				throw e;
			});
	};

	const handleNotificationsSave = (notificationFields) => {
		saveUserSettingsApi(null, null, null, notificationFields)
			.then(() => {
				openSnackbar(true, SUCCESS_COPY.SAVE);
			})
			.catch((e) => {
				openSnackbar(false, ERROR_COPY.SAVE);
				throw e;
			});
	};

	const handleLogSettingsSave = (enabledLogQids) => {
		const sortedEnabledLogQids = enabledLogQids.sort(); // sorting isn't necessary, but makes it easier for humans to look through
		saveUserSettingsApi(null, null, sortedEnabledLogQids, null)
			.then(() => {
				openSnackbar(true, SUCCESS_COPY.SAVE);
			})
			.catch((e) => {
				openSnackbar(false, ERROR_COPY.SAVE);
				throw e;
			});
	};

	const tabData = [
		{
			label: "General",
			content: (
				<div className="grid grid-cols-3 gap-4 divide-y">
					<PhotoNameCard
						userEmail={userEmail}
						userName={userName}
						createdAt={createdAt}
						openSnackbar={openSnackbar}
					/>
					<GeneralCard
						userName={userName}
						timezone={userTimezone}
						saveSettings={handleUserSettingsSave}
					/>
					<NotificationsCard
						key={userTimezone} // rerender when timezone changes
						notificationsData={notifications}
						saveSettings={handleNotificationsSave}
					/>
				</div>
			)
		},
		{
			label: "Daily Log Settings",
			content: (
				<DailyLogSettingsCard
					logFieldsData={dailyLogSettings}
					saveSettings={handleLogSettingsSave}
				/>
			)
		}
	];

	return (
		<div className="flex flex-col items-center">
			{snackbarSuccessOpen && (
				<Snackbar
					isSuccess={true}
					message={snackbarSuccessMessage}
					closeAfterTime={() => closeSnackbarAfterTime(true)}
				/>
			)}
			{snackbarErrorOpen && (
				<Snackbar
					isSuccess={false}
					message={snackbarErrorMessage}
					closeAfterTime={() => closeSnackbarAfterTime(false)}
				/>
			)}

			{!userEmail || isLoading ? (
				<LoadingAnimation text="Loading user profile..." />
			) : (
				<TailwindComposedTabs data={tabData} activeTab={activeTab} accentColor="pink" />
			)}
		</div>
	);
}
