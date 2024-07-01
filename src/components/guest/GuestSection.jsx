import { useEffect, useState } from "react";

import { getShareIdeaApi } from "@helpers/api/guest";
import { getQueryParam } from "@helpers/helpers";

import ErrorSection from "../error/ErrorSection";
import LoadingAnimation from "@components/global/LoadingAnimation";
import CreateAccountCTA from "@components/guest/CreateAccountCTA";

export default function GuestSection() {
	const [shareIdea, setShareIdea] = useState();
	const [errorFound, setErrorFound] = useState(false);

	useEffect(async () => {
		const shareId = getQueryParam("share");
		getShareIdeaApi(shareId)
			.then((shareData) => {
				setShareIdea(shareData);

				// If logged in, send user to /chat of parent id
				const isAuthenticated = localStorage.getItem("csrf_verify") !== null;
				if (isAuthenticated) {
					location.href = `/chat?parentId=${shareData.parentId}&isFeedbackAndFrom=${shareData.creatorName}`;
				}
			})
			.catch((err) => {
				console.error(err);
				setErrorFound(true);
			});
	}, []);

	if (errorFound) {
		return <ErrorSection title="Invalid share link" paragraphs={["Check for typos!"]} />;
	} else if (shareIdea) {
		return (
			<CreateAccountCTA
				creatorName={shareIdea.creatorName}
				sharedIdeaTitle={shareIdea.title}
			/>
		);
	} else {
		// loading
		return <LoadingAnimation />;
	}
}
