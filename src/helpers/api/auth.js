const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { setCookie, getCookie, clearCookie } from "@helpers/cookie";
import { v4 as uuidv4 } from "uuid";
import { ERROR_MESSAGE_MAP } from "@src/const";

function generateId() {
	return uuidv4();
}

export function generateSmallId() {
	const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const hexString = generateId().replace(/-/g, "");
	let base62String = "";
	let num = BigInt("0x" + hexString);
	const base = BigInt(base62Chars.length);

	while (num > 0) {
		base62String = base62Chars[Number(num % base)] + base62String;
		num /= base;
	}

	return base62String.slice(0, 12);
}

/**
	Will create, set, and return the Frontend Session ID (FSID) if it does not exist
    or will return the FSID if it exists
*/
function getFSID() {
	if (!localStorage.getItem("fsid")) {
		localStorage.setItem("fsid", generateId());
	}
	return localStorage.getItem("fsid");
}

export async function csrfApi() {
	const useCSRF = false;
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}auth-brainstory/v1/csrf`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders(useCSRF)
		})
	);
	return response;
}

/** Reset user password */
export async function resetPasswordApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}auth-brainstory/v1/reset-password`, {
			method: "POST",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return {
		notice: response?.notice
	};
}

/** Exchange auth token */
const EXCHANGE_TOKEN_STATUS = {
	REFRESHING: "REFRESHING",
	GOOD: "GOOD",
	EXPIRED: "EXPIRED",
	REFRESH_FAILED: "REFRESH_FAILED"
};

const delay = (delayInms) => {
	return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export async function exchangeToken(logName) {
	// console.log("start exchangeToken", getCookie("tokenRefreshStatus"), logName);
	if (getCookie("tokenRefreshStatus") === EXCHANGE_TOKEN_STATUS.EXPIRED) {
		console.log("exchanging token api call (should only be once):", logName);
		setCookie("tokenRefreshStatus", EXCHANGE_TOKEN_STATUS.REFRESHING);
		const response = await fetch(`${PUBLIC_API_URL}auth-brainstory/v1/flow/exchange`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		}).then((resp) => {
			setCookie(
				"tokenRefreshStatus",
				resp.status < 300
					? EXCHANGE_TOKEN_STATUS.GOOD
					: EXCHANGE_TOKEN_STATUS.REFRESH_FAILED
			);

			return resp;
		});
		return response;
	} else if (getCookie("tokenRefreshStatus") === EXCHANGE_TOKEN_STATUS.REFRESHING) {
		// api call for exchanging token already in progress, so poll every .7s up to 6x
		let i = 0;
		while (getCookie("tokenRefreshStatus") === EXCHANGE_TOKEN_STATUS.REFRESHING && i <= 5) {
			console.log("delay", i);
			i++;
			await delay(700);
		}
		/*  edge case: cookie starts with tokenRefreshStatus === EXCHANGE_TOKEN_STATUS.REFRESHING
			but there's no /exchange call made that session  */
		throw Error("Timed out waiting for the /exchange call to refresh token");
	}
	// console.log("end exchangeToken", getCookie("tokenRefreshStatus"), logName);
}

export async function deleteUserApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}auth-brainstory/v1/delete-user`, {
			method: "POST",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return {
		notice: response?.notice
	};
}

export async function resendEmailVerification() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}auth-brainstory/v1/flow/resend-verification`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);
	return {
		notice: response?.notice
	};
}

export function getDefaultAPIHeaders(noContentType = false, useCSRF = true) {
	const headers = {
		"X-Contenda-Frontend-Session-Key": getFSID()
	};

	if (!noContentType) {
		headers["Content-Type"] = "application/json";
	}

	if (useCSRF) {
		headers["X-CSRF-Verify"] = localStorage.getItem("csrf_verify");
	}

	return headers;
}

/**
	Function to redirect to sign in

	`redirectFlag` ensures only one redirect to /flow/user to log in user
	per batch of api requests
*/
let redirectFlag = false;

function redirectToSignInFlow() {
	if (!redirectFlag) {
		// Set the flag to true to indicate redirection has occurred
		redirectFlag = true;

		// Send to sign in as they are not signed in
		clearCookie("tokenRefreshStatus");
		setCookie("auth_redirect_url", window.location.href);
		window.location.href = `${PUBLIC_API_URL}auth-brainstory/v1/flow/user`;
	}
}

/**
	Function to route all api calls through
	allows to have standard responses to errors
*/
export async function authRedirect(apiCall) {
	try {
		const res = await apiCall();

		// user needs to accept terms status
		if (res.status === 231) {
			location.href = `/terms`;
		}

		// user needs to verify email status
		if (res.status === 233) {
			window.location.href = `/verify-email`;
		}

		// submitted access token expired status
		if (res.status === 234) {
			//exchange token for new one
			if (getCookie("tokenRefreshStatus") !== EXCHANGE_TOKEN_STATUS.REFRESHING) {
				setCookie("tokenRefreshStatus", EXCHANGE_TOKEN_STATUS.EXPIRED);
			}
			return exchangeToken(apiCall.toString())
				.then((res) => {
					// console.log("inside then", res);
					// rerun apiCall and return result since token is now valid
					if (res?.status > 299) {
						// refresh token expired (1 week) and we must sign in again
						// fyi refresh token used to get new refresh and access token
						redirectToSignInFlow();
					}
					return authRedirect(apiCall);
				})
				.catch((err) => {
					redirectToSignInFlow();
				});
		} else {
			setCookie("tokenRefreshStatus", EXCHANGE_TOKEN_STATUS.GOOD);
		}

		// malformed request status
		if (res.status === 400) {
			// Throw error so caller can handle
			throw new Error("400 Error in request");
		}

		// user does not exist on our end, invalid tokens;hackery, CSRF not set up or done incorrectly status
		if (res.status === 401) {
			redirectToSignInFlow();
		}

		// Teapot status for maintenance mode when api is unavailable
		// if (res.status === 418) {
		// 	const data = await res.json();
		// 	window.location.href = `/maintenance?message=${data.maintenance}`;
		// }

		if (res.status > 401) {
			let errorMessage = ERROR_MESSAGE_MAP[res.status] || `${res.status} Error in request`;
			throw Error(errorMessage);
		}

		const data = await res.json();

		return data;
	} catch (error) {
		// Throw error so caller can handle
		throw new Error(error);
	}
}

export default {
	generateSmallId,
	csrfApi,
	resetPasswordApi,
	deleteUserApi,
	resendEmailVerification,
	getDefaultAPIHeaders,
	authRedirect
};
