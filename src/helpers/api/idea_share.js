const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { authRedirect, getDefaultAPIHeaders } from "@helpers/api/auth";

/**
 * Get share link if it exists for an idea
 */
export async function getShareLinkApi(ideaId) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${ideaId}/share/link`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	if (response?.detail === "Couldn't find share link!") {
		return null;
	}
	// TODO handle when the share link doesn't exist
	return response.link;
}

/**
 * Create a new share link for an idea
 */
export async function createShareLinkApi(ideaId) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${ideaId}/share/link`, {
			method: "POST",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.link;
}

export default { getShareLinkApi, createShareLinkApi };

/**
 * Get shared groups
 */
export async function getSharedGroupListApi(ideaId) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${ideaId}/share/group/list`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.groups;
}

/**
 * Get shared individuals
 */
export async function getSharedIndividualListApi(ideaId) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${ideaId}/share/individual/list`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.shares;
}

/**
 * Share idea to email or emails
 *
 * ideaId: String of idea id
 * message: String of message to send
 * shareEmail: string email address to share with
 */
export async function shareIdeaApi(ideaId, message, shareEmail) {
	const body = {
		share_with_email: shareEmail,
		share_message: message
	};

	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${ideaId}/share`, {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	if (response?.detail === "Idea is already shared!") return null;

	return response.id;
}

/**
 * Share idea to email or emails
 *
 * ideaId: String of idea id
 * message: String of message to send
 * groupEmails: Array of email addresses to send to
 */
export async function shareIdeaWithGroup(ideaId, message, groupEmails) {
	const body = {
		group_share_emails: groupEmails,
		share_message: message
	};

	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${ideaId}/share`, {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.id;
}