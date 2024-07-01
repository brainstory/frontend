const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { TOPICS } from "@src/const";

import { getQueryParam } from "@helpers/helpers";
import { authRedirect, getDefaultAPIHeaders } from "@helpers/api/auth";

/** Get idea */
export async function getIdeaApi(idea_id) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${idea_id}`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	const parentIdea = response?.parent_idea
		? {
				id: response.parent_idea.id,
				title: response.parent_idea?.title,
				createdAt: response.parent_idea?.created_at,
				creatorEmail: response.parent_idea?.creator_email,
				creatorName: response.parent_idea?.creator_name,
				isUnread: response.parent_idea?.is_unread
		  }
		: null;

	return {
		id: response.id,
		title: response?.title,
		type: response?.type,
		createdAt: response?.created_at,
		creatorEmail: response?.creator_email,
		creatorName: response?.creator_name,
		isUnread: response?.is_unread,
		transcript: response?.transcript,
		summary: response?.result,
		sharedWithUsers: response?.shared_with_users,
		parentIdea: parentIdea,
		resultJson: response?.result_json
	};
}

/** Get idea's children (ideas that branched off from idea_id) */
export async function getIdeaChildrenApi(idea_id) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${idea_id}/children`, {
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

	return response?.ideas.map((idea) => {
		const feedbackComments = idea?.structured_result?.feedback_items
			? idea.structured_result.feedback_items.map((feedbackComment) => ({
					oidHeadingText: feedbackComment.oid_heading_text,
					matchedSpans: feedbackComment.matched_spans,
					feedbackText: feedbackComment.feedback_text,
					labels: feedbackComment.labels
					// transcriptIndices: feedbackComment.transcript_indices
			  }))
			: [];
		return {
			id: idea.id,
			title: idea?.title,
			summaryPreview: strip(idea?.result),
			createdAt: idea?.created_at,
			creatorEmail: idea?.creator_email,
			creatorName: idea?.creator_name,
			isUnread: idea?.is_unread,
			feedbackComments: feedbackComments
		};
	});
}

/**
 * /** Create an idea saved in the database.
 * Called after user is finished with an idea and a summary is generated.
 * @param {*} result
 * @param {Array} transcript
 * @param {string} [ideaType="original"] enum string value
 * @param {string} [parentIdeaId=null] expected if idea has a parent (e.g. is feedback)
 * @param {dict} [ideaMetadata={}]
 * @param {string} [logId=null] expected if idea has a parent (e.g. is feedback)
 * @returns created idea's uuid
 */
export async function createIdeaApi(
	result,
	transcript,
	ideaType = "original",
	parentIdeaId = null,
	logId = null,
	ideaMetadata = {}
) {
	const i = getQueryParam("topic");
	if (i !== null) {
		ideaMetadata.suggestion = {
			index: i,
			topic: TOPICS[i]
		};
	}

	const body = {
		result: result,
		transcript: transcript,
		parent_idea_id: parentIdeaId,
		idea_metadata: ideaMetadata,
		idea_type: ideaType,
		log_id: logId
	};
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea`, {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return response.id;
}

/** Update an idea saved in the database.
 * Called after user is finished with an idea and a summary is generated.
 * @returns created idea's uuid
 */
export async function updateIdeaApi(ideaId, transcript, result = "") {
	const body = {
		id: ideaId,
		transcript: transcript,
		result: result
	};
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea`, {
			method: "PUT",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return response.id;
}

/** Update an idea title saved in the database.
 * Called after user edits idea title
 * @returns created idea's uuid
 */
export async function updateIdeaTitleApi(ideaId, title) {
	const body = {
		id: ideaId,
		title: title,
	};
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea`, {
			method: "PUT",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return response.id;
}

/** Mark idea read by user.
 * Only applicable for ideas that are not the user's but are shared with the user
 */
export async function markIdeaReadApi(idea_id) {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/idea/${idea_id}/mark-read`, {
			method: "PUT",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return response;
}

export default {
	getIdeaApi,
	getIdeaChildrenApi,
	createIdeaApi,
	markIdeaReadApi,
	updateIdeaTitleApi
};
