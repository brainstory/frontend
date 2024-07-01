import { useEffect, useState } from "react";
import { getIdeaApi, getIdeaChildrenApi, markIdeaReadApi } from "@helpers/api/idea.js";
import { getAllUserNotifications } from "@helpers/api/user";

import { TailwindComposedTabs } from "@ds/TailwindTabs.jsx";
import LoadingAnimation from "@components/global/LoadingAnimation";
import IdeaTitleBar from "./IdeaTitleBar.jsx";
import IdeaSummary from "./IdeaSummary.jsx";
import IdeaSection from "@components/idea/feedback-aggregation/IdeaSection.jsx";
import IdeaTranscript from "./IdeaTranscript.jsx";
import IdeaBranches from "./IdeaBranches.jsx";
import { getQueryParam } from "@helpers/helpers.js";
import ErrorSection from "../error/ErrorSection.jsx";
import { useStore } from "@nanostores/react";
import { $userState } from "@components/global/userStore.js";

export default function IdeaResultContent() {
	const tabs = {
		summary: 0,
		transcript: 1,
		feedback: 2
	};

	const userState = useStore($userState);
	const { userEmail } = userState || {};
	const [activeTab, setActiveTab] = useState(tabs.summary);
	const [isLoading, setIsLoading] = useState(true);
	const [idea, setIdea] = useState({});
	const [parentIdea, setParentIdea] = useState(null);
	const [errorFound, setErrorFound] = useState(false);
	const [ideaChildren, setIdeaChildren] = useState(null);
	const [headingIdxToComments, setHeadingIdxToComments] = useState({});
	const [isMdSizeOrLess, setIsMdSizeOrLess] = useState(window.innerWidth <= 768);
	const [feedbackDraftId, setFeedbackDraftId] = useState();

	useEffect(() => {
		// Event listener to keep track of screen size
		const handleResize = () => {
			setIsMdSizeOrLess(window.innerWidth <= 768);
		};
		window.addEventListener("resize", handleResize);

		const ideaId = getQueryParam("id");
		const tab = getQueryParam("tab");
		if (tab) {
			setActiveTab(tabs[tab]);
		}

		let isCurrent = true;

		getUserFeedbackDraftId(ideaId).then((draftId) => setFeedbackDraftId(draftId));

		getIdeaApi(ideaId)
			.then((res) => {
				if (isCurrent) {
					useIdeaChildrenApi(ideaId).then(
						([updateIdeaChildren, updateOidHeadingToFeedbackComments]) => {
							setIdeaChildren(updateIdeaChildren);
							setHeadingIdxToComments(updateOidHeadingToFeedbackComments);
						}
					);

					let ideaContent = {
						id: ideaId,
						title: res.title,
						summary: res.summary,
						transcript: res.transcript,
						isUnread: res.isUnread,
						numOfShares: res.sharedWithUsers.length,
						creatorEmail: res.creatorEmail,
						creatorName: res.creatorName,
						resultJson: res.resultJson
					};

					if (res?.parentIdea) {
						let parentIdea = {
							id: res.parentIdea.id,
							title: res.parentIdea.title,
							creatorEmail: res.parentIdea.creatorEmail,
							isUnread: res.parentIdea.isUnread
						};
						setParentIdea(parentIdea);
					}

					setIdea(ideaContent);
					setIsLoading(false);
				}
			})
			.catch((err) => {
				console.error("PROBABLY IDEA NOT FOUND WITH ID: " + ideaId);
				setErrorFound(true);
				setIsLoading(false);
				throw err;
			});
		return () => {
			isCurrent = false;
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const tabData =
		isMdSizeOrLess || parentIdea
			? [
					{
						label: "Summary",
						content: <IdeaSummary content={idea.summary} />
					},
					{
						label: "Transcript",
						content: <IdeaTranscript title={idea.title} transcript={idea.transcript} />
					}
			  ]
			: [
					{
						label: "Summary",
						content: (
							<IdeaSection
								resultSections={idea.resultJson}
								ideaFeedbackChildren={ideaChildren}
								headingIdxToComments={headingIdxToComments}
								canShare={userEmail === idea.creatorEmail}
							/>
						)
					},
					{
						label: "Transcript",
						content: <IdeaTranscript title={idea.title} transcript={idea.transcript} />
					}
			  ];

	if (!parentIdea) {
		if (ideaChildren && ideaChildren.length > 0) {
			console.log(ideaChildren);
			const feedbackCount = ideaChildren.length;
			tabData.push({
				label: feedbackCount > 0 ? `Feedback (${feedbackCount})` : "Feedback",
				content: <IdeaBranches kids={ideaChildren} />
			});
		} else {
			const isOwner = userEmail === idea.creatorEmail;
			const tooltipText = isOwner
				? "Share your idea for feedback"
				: "No feedback on this idea yet";
			tabData.push({
				label: "Feedback",
				tooltipText: tooltipText,
				disabled: true,
				content: <IdeaBranches kids={[]} />
			});
		}
	}

	if (errorFound) {
		return <ErrorSection title="Idea not found" />;
	} else if (isLoading) {
		return (
			<div className="p-4">
				<LoadingAnimation text="Loading user profile..." />
			</div>
		);
	} else {
		const feedbackGiven =
			!ideaChildren ||
			ideaChildren.reduce(
				(acc, childIdea) => acc || userEmail === childIdea.creatorEmail,
				false
			);
		const canShare = userEmail && userEmail === idea.creatorEmail && !parentIdea;
		const isFeedbackMissing = userEmail !== idea.creatorEmail && !parentIdea && !feedbackGiven;
		return (
			<div className="h-full">
				<IdeaTitleBar
					idea={idea}
					userEmail={userEmail}
					canShare={canShare}
					isFeedbackMissing={isFeedbackMissing}
					requestedDraftId={feedbackDraftId}
					parentId={parentIdea?.id}
				/>
				<TailwindComposedTabs data={tabData} activeTab={activeTab} accentColor="pink" />
			</div>
		);
	}
}

async function useIdeaChildrenApi(ideaId) {
	const result = await getIdeaChildrenApi(ideaId)
		.then((res) => {
			const oidHeadingToFeedbackComments = {};
			const ideaChildren = res.map((idea) => {
				idea.feedbackComments.map((comment) => {
					const headingIdx = Number(comment.oidHeadingText.split("#")[0]);
					let currMap = oidHeadingToFeedbackComments[headingIdx] || [];
					currMap.push({
						ideaId: idea.id,
						creatorEmail: idea.creatorEmail,
						creatorName: idea.creatorName,
						createdAt: idea.createdAt,
						matchedSpans: comment.matchedSpans,
						feedbackText: comment.feedbackText,
						labels: comment.labels
					});
					oidHeadingToFeedbackComments[headingIdx] = currMap;
				});
				return { ...idea, isFeedback: true };
			});
			return [ideaChildren, oidHeadingToFeedbackComments];
		})
		.catch((err) => {
			console.error("PROBABLY IDEA NOT FOUND WITH ID: " + ideaId, err);
			throw err;
		});

	return result;
}

function useMarkReadApi(id, isUnread) {
	useEffect(() => {
		let isCurrent = true;

		if (!isUnread) {
			return;
		}

		markIdeaReadApi(id)
			.then((res) => {
				if (isCurrent) {
					console.log("marked idea as read: ", res);
				}
			})
			.catch((err) => {
				console.error("PROBABLY IDEA NOT FOUND WITH ID: " + ideaId);
				throw err;
			});
		return () => {
			isCurrent = false;
		};
	}, [id]);
}

const getUserFeedbackDraftId = async (parentId) => {
	const notifications = await getAllUserNotifications();
	const draftNotification = notifications.find(
		(notification) => notification.related_idea_id === parentId
	);
	return draftNotification?.draft_response_idea_id;
};
