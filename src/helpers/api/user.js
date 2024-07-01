const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { authRedirect, getDefaultAPIHeaders } from "@helpers/api/auth";

/** Get user email, name, and mail verified status */
export async function getUserApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return {
		email: response.email,
		name: response?.name,
		mailVerified: response?.mail_verified,
		timezone: response?.timezone,
		createdAt: response?.created_at
	};
}

/** Get user free trial */
export async function getUserTrial() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/trial`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return {
		trialEndAt: response.trial_end,
		isPaid: response.is_paid
	};
}

export async function getUserDailyStatusApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/daily`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return {
		logId: response.log_id,
		intentIdeaId: response.intent_idea_id,
		surveyId: response.survey_id,
		isCompleted: response.is_completed,
		streak: response.streak
	};
}

/** Get all ideas that the user created */
export async function getAllIdeasApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/idea/list`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	const strip = (str) => {
		// remove the first line before the first \n\n,
		// and if the next line starts with ##, remove the ##
		// then replace all newlines with spaces
		const removedFirstLine = str.substring(str.indexOf("\n\n") + 2);
		const removedFirstLineAndHash = removedFirstLine.replace(/^##/, "");
		const removedNewLines = removedFirstLineAndHash.replace(/\n/g, " ");

		return removedNewLines.substring(0, 100).trim() + "...";
	};

	const displayDraftSummary = (idea) => {
		if (idea?.result === "") {
			// return the last idea transcript where the role is "user"
			// and the content is not empty
			return idea?.transcript
				?.filter((transcript) => transcript.role === "user" && transcript.content !== "")
				?.pop()?.content;
		}
	};

	return response?.ideas.map((idea) => ({
		id: idea.id,
		title: idea?.title,
		summaryPreview: strip(idea?.result),
		createdAt: idea?.created_at,
		creatorEmail: idea?.creator_email,
		isUnread: idea?.is_unread,
		sharedWithUsers: idea?.shared_with_users,
		feedback: idea?.feedback,
		draftSummary: displayDraftSummary(idea)
	}));
}

/** Get all notifications for user*/
export async function getAllUserNotifications() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/notifications`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.notifications;
}

/** Get all emails the user has shared with recently */
export async function getUserShareRecents() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/user/share/recents`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.recents.map((person) => ({ name: person?.name, email: person.email }));
}
