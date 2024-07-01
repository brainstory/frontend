const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;
import { authRedirect, getDefaultAPIHeaders } from "@helpers/api/auth";

export async function getDailyLogQuestionsApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/form/log`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return response.log.map((question) => ({
		id: question.id,
		text: question.text,
		label: question.label
	}));
}

/**
 * Submit user's answers to their daily log
 * @param {list} logItems list of objects with field "id" and "value" [bool]
 * @returns
 */
export async function submitDailyLogQuestionsApi(logItems) {
	const body = {
		log: logItems
	};
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/form/log`, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(body),
			headers: getDefaultAPIHeaders()
		})
	);

	console.log("body", body);
	console.log("create log", response.id);
	return response.id;
}

export async function getSurveyFieldsApi() {
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/form/survey`, {
			method: "GET",
			credentials: "include",
			headers: getDefaultAPIHeaders()
		})
	);

	return { labels: response.ids, range: response.range };
}

/**
 * Submit user's survey response after completing an idea
 * @param {list} surveyItems list of objects with field "id" and "value" [int]
 * @param {int} ideaId idea the survey is in resposne to
 * @returns
 */
export async function submitSurveyResponseApi(surveyItems, ideaId) {
	const body = {
		survey: surveyItems,
		idea_id: ideaId
	};
	const response = await authRedirect(() =>
		fetch(`${PUBLIC_API_URL}api/story/form/survey`, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(body),
			headers: getDefaultAPIHeaders()
		})
	);

	console.log("body", body);
	console.log("create log", response.id);
	return response.id;
}

export default {
	getDailyLogQuestionsApi,
	submitDailyLogQuestionsApi,
	getSurveyFieldsApi,
	submitSurveyResponseApi
};
