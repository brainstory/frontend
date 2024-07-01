import ReactMarkdown from "react-markdown";
import LoadingAnimation from "@components/global/LoadingAnimation";

let defaultContent = "# Loading... \n\n This idea is loading. Please wait.";

export default function IdeaSummary({ content = defaultContent }) {
	return (
		<div
			className={
				"p-5 pb-8 mx-auto prose prose-stone prose-headings:underline prose-headings:decoration-pink-500 prose-headings:text-xl prose-h1:no-underline prose-h1:text-xl " +
				"prose-p:leading-normal lg:prose-p:leading-loose"
			}
		>
			{content === defaultContent && <LoadingAnimation />}
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
}
