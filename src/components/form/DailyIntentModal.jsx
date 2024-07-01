import { useState, useEffect } from "react";
import { getQueryParam } from "@helpers/helpers";

import {
	getDailyLogQuestionsApi,
	submitDailyLogQuestionsApi,
	getSurveyFieldsApi,
	submitSurveyResponseApi
} from "@helpers/api/forms";

import PinkButton from "@ds/PinkButton";
import ModalTitleBar from "@components/global/ModalTitleBar";
import StartLogSection from "./StartLogSection";
import EndSurveySection from "./EndSurveySection";
import ModalTabBar from "../global/ModalTabBar";

const TAB_NAME = {
	START_LOG: "Status Log",
	END_SURVEY: "Feelings Survey"
};

export default function DailyIntentModal({ logId, setLogId, onClose, isAtStart }) {
	const disabledTabs = isAtStart ? [TAB_NAME.END_SURVEY] : [];
	// const [modalTab, setModalTab] = useState(logId ? TAB_NAME.END_SURVEY : TAB_NAME.END_SURVEY);
	const [modalTab, setModalTab] = useState(logId ? TAB_NAME.END_SURVEY : TAB_NAME.START_LOG);
	// state for start log
	const [isLogLoading, setIsLogLoading] = useState(true);
	const [logItems, setLogItems] = useState([]);
	const [isSaving, setIsSaving] = useState(false);
	// state for end survey
	const [surveyItems, setSurveyItems] = useState([]);
	const [surveyStarRange, setSurveyStarRange] = useState();

	useEffect(() => {
		getDailyLogQuestionsApi()
			.then((logQuestions) => {
				const updateLogItems = (logQuestions = logQuestions.map((question) => ({
					id: question.id,
					text: question.text,
					value: false // default is always false
				})));
				setLogItems(updateLogItems);
				setIsLogLoading(false);
			})
			.catch((err) => {
				console.log("Error getting daily log questions " + err);
			});
		// getSurveyFieldsApi()
		// 	.then((resp) => {
		// 		setSurveyStarRange(resp.range);
		// 		setSurveyItems(resp.labels.map((label) => ({ id: label, value: 0 })));
		// 	})
		// 	.catch((e) => console.log("Error from get survey fields api", e));
	}, []);

	const onSubmit = () => {
		if (modalTab === TAB_NAME.START_LOG) {
			submitDailyLogQuestionsApi(logItems)
				.then((logId) => {
					onClose();
					setLogId(logId);
				})
				.catch((err) => {
					console.log("Error submitting daily log answers " + err);
				})
				.finally(() => setIsSaving(false));
		} else if (modalTab === TAB_NAME.END_SURVEY) {
			submitSurveyResponseApi(surveyItems, getQueryParam("id"))
				.then(() => onClose())
				.catch((e) => console.log("Error in submitting survey api", e));
		}
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center ${
				!isLogLoading ? "" : "hidden"
			}`}
		>
			<div className="fixed inset-0 bg-black opacity-40"></div>
			<div className="flex flex-col max-w-[600px] w-[90vw] max-h-[95vh] bg-white mx-auto rounded-lg relative shadow-md p-5 md:p-7">
				<ModalTitleBar title="Daily Intent Log" onClose={onClose} classes="mb-2" />
				{/* <ModalTabBar
					allTabs={Object.values(TAB_NAME)}
					currentTab={modalTab}
					setTab={setModalTab}
					disabledTabs={disabledTabs}
				/> */}
				{modalTab === TAB_NAME.START_LOG ? (
					<StartLogSection
						logItems={logItems}
						// logItems={logItems.concat(logItems)}
						setLogItems={setLogItems}
						disabled={isSaving}
					/>
				) : (
					<EndSurveySection
						surveyItems={surveyItems}
						setSurveyItems={setSurveyItems}
						starRange={surveyStarRange}
					/>
				)}
				<PinkButton
					disabled={isSaving}
					onClick={() => {
						setIsSaving(true);
						onSubmit();
					}}
					classes="mx-auto mt-auto flex-end w-6em"
				>
					{isSaving && (
						<div className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full mr-2" />
					)}
					{isSaving ? "Saving" : "Submit"}
				</PinkButton>
			</div>
		</div>
	);
}
