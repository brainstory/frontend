export default function IdeaTranscript({ transcript }) {
	const splitConversation = (conversation) => {
		let userContent = [];
		let assistantContent = [];
		conversation.forEach((message) => {
			if (message.role === "user") {
				userContent.push(message.content);
			} else {
				assistantContent.push(message.content);
			}
		});

		return { assistantContent, userContent };
	};

	const { assistantContent, userContent } = splitConversation(transcript);

	return (
		<div className="mx-10 space-y-12 divide-y-2">
			{assistantContent.map((question, index) => (
				<div
					className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-3 lg:pt-12 first:pt-2 last:pb-12"
					key={`transcript-${index}`}
				>
					<div className="flex flex-col flex-shrink-0 mb-6 lg:pr-12 md:mb-0">
						<span className="text-lg font-semibold leading-6 text-black font-display tracking-tight">
							{question}
						</span>
					</div>
					<div className="lg:col-span-2">
						<p className="text-stone-500 text-sm">
							{userContent[index] ? userContent[index] : ""}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
