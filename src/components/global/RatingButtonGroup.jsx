import { useState } from "react";

export default function RatingButtonGroup({ value, range = 5, setRatingValue, label = null }) {
	const [isHover, setIsHover] = useState(false);
	const [hoverStarCount, setHoverStarCount] = useState(value);

	/**
	 * @param {int} starIndex first start index is 1
	 * @returns
	 */
	const getStarName = (starIndex) => {
		let isFilled = starIndex <= value;
		if (isHover) {
			isFilled = starIndex <= hoverStarCount;
		}

		if (isFilled) {
			return "sunny";
			// return "radio-button-on";
		} else {
			return "sunny-outline";
			// return "radio-button-off";
		}
	};

	const handleStarClick = (e) => {
		const starCount = Number(e.currentTarget.id);
		setRatingValue(starCount);
	};

	const handleStarHover = (e) => {
		if (window.innerWidth > 768) {
			const starCount = Number(e.currentTarget.id);
			setIsHover(true);
			setHoverStarCount(starCount);
		}
	};

	const handleStarUnHover = () => {
		if (window.innerWidth > 768) {
			setIsHover(false);
			setHoverStarCount(0);
		}
	};

	return (
		<div className="flex justify-between">
			{label && <p>{label}</p>}
			<div className="flex">
				{[...Array(range).keys()].map((_, starIndex) => (
					<button
						id={starIndex + 1}
						key={starIndex + 1}
						className="flex items-center px-1"
						title={`${starIndex + 1} stars`}
						onClick={handleStarClick}
						onMouseEnter={handleStarHover}
						onMouseLeave={handleStarUnHover}
					>
						<ion-icon
							name={getStarName(starIndex + 1)}
							class="w-6 h-6 hydrated pointer-events-none fill-pink-500"
						></ion-icon>
					</button>
				))}
			</div>
		</div>
	);
}
