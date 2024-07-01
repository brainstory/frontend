import ReactMarkdown from "react-markdown";

export default function ParentIdeaText({ content }) {
	return (
		<div
			className={
				"prose text-sm md:text-lg prose-stone prose-headings:underline prose-headings:decoration-pink-500 prose-headings:text-xl prose-h1:no-underline prose-h1:lg:text-2xl p-5 sm:p-6 mx-auto " +
				"prose-p:leading-normal md:prose-p:leading-loose"
			}
		>
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
}
