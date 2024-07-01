const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { authRedirect, getDefaultAPIHeaders } from "@helpers/api/auth";

/** Get user settings */
export async function getUserSettingsApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/settings`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	const user = {
		name: response.user?.name,
		timezone: "timezone" in response.user ? response.user.timezone : ""
	};

	const dailyLogQuestions = response.log.map((field) => ({
		id: field.id,
		label: field.label,
		questionText: field.text,
		enabled: field.enabled
	}));

	const notifications = response.notifications.map((field) => ({
		title: field.title,
		description: field?.description,
		value: field.value,
		valueType: field.value_type,
		enabled: field.enabled
	}));

	return {
		user: user,
		dailyLog: dailyLogQuestions,
		notifications: notifications
	};
}

/** Save user settings */
export async function saveUserSettingsApi(
	newName = null,
	newTimezone = null,
	enabledLogQids = null,
	notifications = null
) {
	let body = {};
	if (newName) {
		body.user = {};
		body.user.name = newName;
	}
	if (newTimezone) {
		if (!("user" in body)) body.user = {};
		body.user.timezone = newTimezone;
	}
	if (enabledLogQids) {
		body.enabled_log_question_ids = enabledLogQids;
	}
	if (notifications) {
		body.notifications = notifications;
	}
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/settings`, {
			method: "PUT",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return response.id;
}
