import IdeaPlaceholder from "./IdeaPlaceholder";
import IdeaCard from "./IdeaCard";

export default function IdeaBranches({ kids }) {
	return (
		<div className="mx-10 space-y-12">
			<div className="flex justify-center flex-wrap gap-4 mb-10">
				{kids.map((idea) => (
					<IdeaCard
						key={"card-" + idea.id}
						id={idea.id}
						title={idea.title}
						summaryPreview={idea.summaryPreview}
						createdAt={idea.createdAt}
						creatorEmail={idea.creatorEmail}
						isUnread={idea.isUnread}
						shared={true}
						isFeedback={true}
					/>
				))}
			</div>
		</div>
	);
}
