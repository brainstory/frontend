import { map } from "nanostores";
import { getUserApi, getUserTrial } from "@helpers/api/user";
import { saveUserSettingsApi } from "@helpers/api/settings";

/**
 * Initialize state as undefined.
 * If undefined consumers know api has not yet resolved to populate state
 */

/**
 * When populated, the userState will contain:
 * - name: Name of the current user
 * - email: Email of the current user
 * - createdAt: when account was created in UTC
 * - isPaid: Whether the account is paid else is a free trial
 * - trialEndAt: when the free trial ends in UTC if isPaid is true
 */
export const $userState = map({});
export const $userTrial = map({});

// Api calls to populate userState
getUserApi()
	.then((userRes) => {
		$userState.set({
			userName: userRes?.name,
			userEmail: userRes?.email,
			userMailVerified: userRes?.mailVerified,
			createdAt: userRes?.createdAt,
			timezone: userRes?.timezone
		});

		if (!userRes.timezone) {
			const userBrowserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			saveUserSettingsApi(null, userBrowserTimezone)
				.then(() => {
					console.log("successful set timezone", userBrowserTimezone);
					$userState.setKey("timezone", userBrowserTimezone);
				})
				.catch((err) => console.log("unsuccessful at setting timezone", err));
		}
	})
	.catch((err) => {
		console.log("error getting user data", err);
	});

getUserTrial()
	.then((res) => {
		let updateMap = {
			isPaid: res.isPaid
		};
		if (!res.isPaid) {
			updateMap["trialEndAt"] = res?.trialEndAt;
		}
		$userTrial.set(updateMap);
	})
	.catch((err) => console.log("error getting user trial data", err));