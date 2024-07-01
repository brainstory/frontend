import { useState, useEffect } from "react";
import EmailsInputField from "./EmailsInputField";
import FeedbackModalTitleBar from "./FeedbackModalTitleBar";
import SharedList from "./SharedList";
import SharePear from "./SharePear";
import {
	TailwindTabs,
	TailwindTabList,
	TailwindTab,
	TailwindTabPanels,
	TailwindTabPanel
} from "@ds/TailwindTabs.jsx";
import PinkButton from "@ds/PinkButton";
import { useStore } from "@nanostores/react";
import { $userState } from "@components/global/userStore.js";

import { createShareLinkApi, getShareLinkApi } from "@helpers/api/idea_share";

export default function ShareOptions({
	onClose,
	onAddPeople,
	ideaId,
	ideaTitle,
	ideaSummary,
	sharedPeople,
	isLoadingSharedPeople
}) {
	const userState = useStore($userState);
	const { isUnlimited } = userState || {};
	const [shareLink, setShareLink] = useState();
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		getShareLinkApi(ideaId)
			.then((link) => {
				setShareLink(link);
			})
			.catch((err) => {
				console.log("Error getting share link from idea ", ideaId, err);
			});
	}, []);

	const handleCopy = () => {
		navigator.clipboard.writeText(shareLink);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	const handleCreateShareLink = () => {
		createShareLinkApi(ideaId).then((link) => {
			setShareLink(link);
		});
	};

	return (
		<div>
			<FeedbackModalTitleBar ideaTitle={ideaTitle} onClose={onClose} />

			<div className="p-7 pt-0">
				<TailwindTabs>
					<TailwindTabList>
						<TailwindTab>Feedback</TailwindTab>
						<TailwindTab>Read-only sharing</TailwindTab>
					</TailwindTabList>
					<TailwindTabPanels>
						<TailwindTabPanel>
							<p className="text-md text-stone-800 font-medium">Send share link</p>
							<p className="text-sm text-stone-500 italic mb-2">
								Anyone with this link can see your idea and give feedback
							</p>
							{shareLink ? (
								<div className="flex">
									<input
										id="share-link"
										defaultValue={shareLink}
										className="w-full px-3 py-2 placeholder-stone-400 border border-stone-300 rounded-md"
									/>
									<PinkButton
										id="copy-button"
										disabled={!!isCopied}
										onClick={handleCopy}
										classes="ml-2"
										data-te-clipboard-init
										data-te-clipboard-target="#share-link"
									>
										{isCopied ? "Copied!" : "Copy"}
									</PinkButton>
								</div>
							) : (
								<PinkButton onClick={handleCreateShareLink}>
									Generate a share link
								</PinkButton>
							)}
							<div className="flex flex-row my-4 items-center text-stone-500">
								<hr className="w-full" />
								<p className="mx-4 text-sm">or</p>
								<hr className="w-full" />
							</div>
							<EmailsInputField onClick={onAddPeople} />
							<div className="mt-6 border-t"></div>
							<SharedList people={sharedPeople} isLoading={isLoadingSharedPeople} />
						</TailwindTabPanel>
						<TailwindTabPanel>
							<SharePear ideaSummary={ideaSummary} />
						</TailwindTabPanel>
					</TailwindTabPanels>
				</TailwindTabs>
			</div>
		</div>
	);
}
