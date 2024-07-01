import React from "react";
import ReactMarkdown from "react-markdown";

export default function GeneratingResult({ summary }) {
	return (
		<div className="mx-auto w-full items-center scroll-mt-6 lg:px-24 max-w-7xl p-5 md:p-12">
			<div className="space-y-12 divide-y-2">
				<div className="flex flex-col flex-shrink-0 max-w-[100%]">
					<span
						className={
							"mx-auto prose prose-stone prose-headings:underline prose-headings:decoration-pink-500 prose-headings:text-xl prose-h1:lg:text-2xl prose-h1:no-underline " +
							"prose-p:leading-normal md:prose-p:leading-loose"
						}
					>
						{/* We *need* to keep the "prose" class to process the markdown properly */}
						<ReactMarkdown className="prose">{summary}</ReactMarkdown>
					</span>
				</div>
			</div>
		</div>
	);
}
