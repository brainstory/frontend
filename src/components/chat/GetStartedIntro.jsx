import { useState } from "react";
import { getCookie } from "@helpers/cookie";
import { TOPICS } from "@src/const";

import { useAppContext } from "@components/chat/reusable/AppWrapper";

import RivePencil from "@components/global/RivePencil";
import TextsFadeIn from "./reusable/TextsFadeIn";

export default function GetStartedIntro({}) {
	const [isTextLoading, setIsTextLoading] = useState(true);
	const { sludgeman } = useAppContext();

	const hasDone = getCookie("has_done_getting_started");

	let introTextComponents;
	if (hasDone) {
		introTextComponents = [
			<p className="text-accent-900 font-semibold">
				Hey there!{" "}
				<span className="hidden lg:inline">It's your favorite pencil, Mark.</span>
			</p>,
			<p>Need some inspiration? Here are some things we can start with! Do you want to:</p>
		];
	} else {
		introTextComponents = [
			<p className="text-accent-900 font-semibold">
				Hey there! <span className="hidden lg:inline">My name is Mark.</span>
			</p>,
			<p>
				Welcome to Brainstory, your{" "}
				<p className="underline decoration-accent-900 inline font-semibold">
					think-out-loud tool
				</p>{" "}
				for quick insights and creative boosts.
			</p>,
			<p>Here are some things we can start with! Do you want to:</p>
		];
	}

	setTimeout(() => {
		setIsTextLoading(false);
	}, 1800);

	return (
		<div className="p-6 md:p-10">
			<div className="flex flex-col md:flex-row justify-center items-center">
				<div className="sludge-sludge-maaaan hidden lg:block lg:mr-4">
					{sludgeman == "idle" ? (
						<RivePencil type="wave" small={false} />
					) : (
						<RivePencil type="jump" small={false} />
					)}
				</div>
				<TextsFadeIn
					animationFinishedCallbacks={() => setIsTextLoading(false)}
					classes="tracking-tight text-xl md:text-2xl max-w-2xl flex flex-col gap-3"
				>
					{introTextComponents}
				</TextsFadeIn>
			</div>
			<div className="flex flex-wrap gap-3 max-w-7xl justify-center mx-auto my-6">
				{!isTextLoading &&
					TOPICS.map((topic, index) => (
						<a
							key={`topic-${topic}-${index}`}
							className="p-6 font-semibold flex flex-col gap-3 justify-center items-center animate-appear block w-72 bg-white border border-stone-200 text-center cursor-pointer rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-transform min-h-[144px]"
							href={`/chat?topic=${index}`}
						>
							<ion-icon name={topic.iconName} class="hydrated w-8 h-8" />
							{topic.topic}
						</a>
					))}
			</div>
		</div>
	);
}
