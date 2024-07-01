const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { authRedirect, getDefaultAPIHeaders } from "@helpers/api/auth";

/**
 * @param {Blob} blobby
 * @returns {string} text of transcribed audio
 */
export async function transcribeApi(blobby) {
	const formData = new FormData();
	formData.append("data", blobby, "audio.wav");

	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/stt`, {
			method: "POST",
			body: formData,
			credentials: "include",
			headers: getDefaultAPIHeaders(true)
		})
	);

	return response.transcript;
}

export async function generateResponseStreamApi(messages, summarize = false, reactTo = null) {
	let body = {
		messages: messages,
		summarize: summarize
		// customization: {
		// 	prepend_prompts: customization?.prepend,
		// 	append_prompts: customization?.append
		// }
	};
	if (reactTo) {
		body["react_to"] = reactTo;
	}

	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/streaming-response`, {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return {
		url: response.socket_target.url,
		isSuccessful: response.socket_target?.is_successful,
		friendlyErrMsg: response.socket_target?.friendly_error_message,
		tokenCountMsg: response.socket_target?.token_count_message
	};
}

/** @returns {string} response text */
export async function generateResponseApi(messages, reactTo = null) {
	let body = {
		messages: messages
		// customization: {
		// 	prepend_prompts: customization?.prepend,
		// 	append_prompts: customization?.append
		// }
	};
	if (reactTo) {
		body["react_to"] = reactTo;
	}

	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/response`, {
			method: "POST",
			body: JSON.stringify(body),
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return response?.response;
}
