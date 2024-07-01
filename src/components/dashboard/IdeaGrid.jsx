import { useEffect } from "react";
import IdeaCard from "@components/idea/IdeaCard.jsx";
import IdeaPlaceholder from "@components/idea/IdeaPlaceholder.jsx";
import DraftIdeaCard from "@components/idea/DraftIdeaCard.jsx";
import { useStore } from "@nanostores/react";
import { $userState } from "@components/global/userStore.js";

export default function IdeaGrid({ userIdeas }) {
	const userState = useStore($userState);
	const { userEmail } = userState || {};

	useEffect(() => {}, [userIdeas]);

	if (userIdeas === null) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{[...Array(4)].map((_, i) => (
					<IdeaPlaceholder key={`placeholder-grid-${i}`} />
				))}
			</div>
		);
	} else {
		return (
			<div className="flex flex-wrap items-stretch justify-center sm:justify-start gap-5 mx-auto">
				{userIdeas.map((idea, index) => {
					// If summaryPreview is ... then is a draft summary
					if (idea.summaryPreview === "...") {
						return (
							<DraftIdeaCard
								key={`draft-idea-card-${index}-${idea.id}`}
								id={idea.id}
								createdAt={idea.createdAt}
								draftSummary={idea.draftSummary}
							/>
						);
					} else {
						return (
							<IdeaCard
								key={`idea-card-${index}-${idea.id}`}
								id={idea.id}
								title={idea.title}
								createdAt={idea.createdAt}
								creatorEmail={idea.creatorEmail}
								sharedWithUsers={idea.sharedWithUsers}
								isUnread={idea.isUnread}
								currentUserEmail={userEmail}
								feedback={idea.feedback}
								index={index}
							/>
						);
					}
				})}
			</div>
		);
	}
}
