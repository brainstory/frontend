import ReactMarkdown from "react-markdown";

export default function Terms({ tc }) {

	return (
		<div className="w-full flex flex-col items-center justify-center bg-white">
			<div className="py-4 flex flex-col items-center justify-center">
				<ReactMarkdown className="prose">{tc}</ReactMarkdown>
			</div>
		</div>
	);
}
