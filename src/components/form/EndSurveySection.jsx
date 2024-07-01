import RatingButtonGroup from "@components/global/RatingButtonGroup";

export default function EndSurveySection({ surveyItems, setSurveyItems, starRange }) {
	const renderSurveyFields = () => {
		return surveyItems.map((field, labelIndex) => {
			const setRatingValue = (score) => {
				let updateSurveyInput = [...surveyItems];
				updateSurveyInput[labelIndex].value = score;
				setSurveyItems(updateSurveyInput);
			};
			const capitalizedLabel = field.id.charAt(0).toUpperCase() + field.id.slice(1);
			return (
				<RatingButtonGroup
					range={starRange}
					label={capitalizedLabel}
					key={capitalizedLabel}
					value={surveyItems[labelIndex].value}
					setRatingValue={setRatingValue}
				/>
			);
		});
	};

	return (
		<div className="my-5 py-3">
			<p className="mb-5 text-sm italic text-center">Rate how you feel</p>
			<div className="flex flex-col gap-5 max-w-[250px] mx-auto">{renderSurveyFields()}</div>
		</div>
	);
}
