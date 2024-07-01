import { useState, useEffect } from "react";

import LoadingAnimation from "@components/global/LoadingAnimation";
import BorderedButton from "@ds/BorderedButton";

import { getSurveyFieldsApi } from "@helpers/api/forms";

const headingStyle = "mb-4 lg:mb-5 font-bold text-stone-900 text-center text-xl lg:text-2xl";

export default function StickyLoadingSection({ isFinishedGenerating, ideaId }) {
	const [starRange, setStarRange] = useState();
	const [surveyFieldsInput, setSurveyFieldsInput] = useState([]);

	useEffect(() => {
		getSurveyFieldsApi()
			.then((resp) => {
				setStarRange(resp.range);
				setSurveyFieldsInput(resp.labels.map((label) => ({ id: label, value: 0 })));
			})
			.catch((e) => console.log("Error from get survey fields api", e));
	}, []);

	const title = isFinishedGenerating
		? "Finished! Saved your summary ✅"
		: "Hang tight! Writing your thoughts down...";

	return (
		<div className="sticky bottom-0 bg-white border-t px-7 py-9">
			<h1 className={headingStyle}>{title}</h1>
			{isFinishedGenerating ? (
				<div>
					<BorderedButton
						onClick={() => (window.location.href = `/idea?id=${ideaId}`)}
						classes="ml-auto"
						title="Submit survey"
					>
						See more -->
					</BorderedButton>
				</div>
			) : (
				<LoadingAnimation text="Saving. Don't close this tab." />
			)}
		</div>
	);
}
