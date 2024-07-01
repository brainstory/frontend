import { getQuestionOfTheDay } from "@helpers/qotd";

function InspiringQuote() {
	return (
		<p className="text-md font-normal text-stone-500 mb-3 lg:text-xl sm:mb-6 sm:mx-8">
			{getQuestionOfTheDay()}
			<button className="ml-2 text-accent-900 whitespace-nowrap hover:text-stone-500 hover:underline">
				<a href="/chat?qotd=true" className="ml-1">
					Start this thought
				</a>
				<span className="relative top-2 inline-block w-12">
					<ion-icon
						class="w-8 h-8 hydrated"
						name="return-down-back-outline"
						role="img"
						aria-label="Start this thought"
					></ion-icon>
				</span>
			</button>
		</p>
	);
}

export default InspiringQuote;
