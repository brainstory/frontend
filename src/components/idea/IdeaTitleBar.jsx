import { useState, useRef, useEffect } from "react";
import GetFeedbackModal from "@src/components/feedback-modal/GetFeedbackModal";
import { updateIdeaTitleApi } from "@helpers/api/idea";
import PinkButton from "@ds/PinkButton.jsx";
import { getAllUserNotifications } from "@helpers/api/user";

export default function IdeaTitleBar({
	idea,
	userEmail,
	canShare,
	isFeedbackMissing,
	requestedDraftId,
	parentId
}) {
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
	const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(idea.title);
	const h1Ref = useRef(null);
	const textarea = useRef(null);

	let createdByText = userEmail;
	if (idea.creatorEmail === userEmail) {
		createdByText = "You";
	} else if (idea.creatorName) {
		createdByText = idea.creatorName;
	}

	const startEditing = () => {
		setIsEditing(true);
		if (textarea.current) {
			textarea.current.focus();
		}
	};

	const finishEditing = () => {
		const strippedTitle = textarea.current.innerText.replace(/\n/g, "").trim();
		if (strippedTitle.length === 0) {
			setSnackbarErrorOpen(true);
			setTimeout(() => {
				setSnackbarErrorOpen(false);
			}, 4000);
		} else {
			setEditedTitle(strippedTitle);
			updateIdeaTitleApi(idea.id, strippedTitle).then((res) => {
				console.log("SAVED", res);
			});
		}

		setIsEditing(false);
	};

	useEffect(() => {
		if (isEditing && textarea.current) {
			textarea.current.focus();
		}
	}, [isEditing]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			finishEditing();
		}
	};

	const renderShareFeedbackButton = () => {
		if (canShare) {
			// share button
			return [
				<PinkButton onClick={() => setIsFeedbackModalOpen(true)}>Share</PinkButton>,
				<GetFeedbackModal
					isOpen={isFeedbackModalOpen}
					onClose={() => setIsFeedbackModalOpen(false)}
					ideaId={idea.id}
					ideaTitle={idea.title}
					ideaSummary={idea.summary}
				/>
			];
		} else if (isFeedbackMissing) {
			let feedbackHref = requestedDraftId
				? `/chat?id=${requestedDraftId}&isFeedbackAndFrom=${idea.creatorName}`
				: `/chat?parentId=${idea.id}&isFeedbackAndFrom=${idea.creatorName}`;
			console.log(isFeedbackMissing, feedbackHref);

			return <PinkButton href={feedbackHref}>Give Feedback</PinkButton>;
		}
	};

	return (
		<div className="px-5 pt-5 md:px-7 md:pt-7">
			{snackbarErrorOpen && (
				<div className="mt-3 z-50 bg-red-500 p-4 rounded-md shadow-lg absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center min-w-[300px]">
					<p className="text-white">Error: Title field is empty</p>
				</div>
			)}
			<div className="flex flex-wrap gap-4 justify-between">
				<div className="flex flex-wrap gap-4 justify-between">
					{parentId && (
						<a
							href={`/idea?id=${parentId}`}
							className="flex mt-1 h-min"
							title="Go back to original idea"
						>
							<ion-icon
								class="w-5 h-5 hydrated pointer-events-none"
								name="arrow-back-outline"
							></ion-icon>
						</a>
					)}
					<div className="flex flex-col">
						<div className="flex flex-row text-left text-base text-stone-900">
							{/* do not allow editing title if not users idea */}
							{userEmail !== idea.creatorEmail && (
								<h1
									ref={h1Ref}
									className="group-hover:underline underline-offset-2 decoration-dotted rounded cursor-text md:mr-2 relative"
								>
									{editedTitle}
								</h1>
							)}

							{/* allow title editing if it's the user's idea */}
							{userEmail === idea.creatorEmail && isEditing && (
								<div className="flex flex-row">
									<h1
										tabIndex="0"
										ref={textarea}
										role="textbox"
										contentEditable="true"
										onKeyDown={handleKeyDown}
										onFocus={(e) => {
											// set cursor to end when focused
											const range = document.createRange();
											const sel = window.getSelection();
											range.selectNodeContents(textarea.current);
											range.collapse(false);
											sel.removeAllRanges();
											sel.addRange(range);
										}}
										autoFocus
										className={`md:mr-4 resize-none border-none bg-transparent outline-none focus:ring-0`}
									>
										{editedTitle}
									</h1>

									<button
										onClick={finishEditing}
										className="disabled:text-stone-400 hover:bg-stone-200 p-1 leading-none rounded-full"
										aria-label="Finish editing"
									>
										<ion-icon
											class="w-4 h-4 hydrated pointer-events-none"
											name="checkmark-outline"
											role="img"
										></ion-icon>
									</button>
								</div>
							)}
							{userEmail === idea.creatorEmail && !isEditing && (
								<div className="flex flex-row items-center relative group">
									<button onClick={startEditing}>
										<h1
											ref={h1Ref}
											className="group-hover:underline underline-offset-2 decoration-dotted rounded cursor-text md:mr-2 relative"
										>
											{editedTitle}
										</h1>
									</button>
									{userEmail === idea.creatorEmail && (
										<button
											onClick={startEditing}
											aria-label="Start editing"
											className="disabled:text-stone-400 hover:bg-stone-200 self-center p-1 leading-none rounded-full"
										>
											<ion-icon
												class="w-4 h-4 hydrated pointer-events-none"
												name="create-outline"
												role="img"
											></ion-icon>
										</button>
									)}
								</div>
							)}
						</div>
						<h2 className="text-sm tracking-tight text-stone-500 mt-1">
							Created by {createdByText}
						</h2>
					</div>
				</div>

				<div className="flex rounded-md shadow-sm self-center" role="group">
					{renderShareFeedbackButton()}
				</div>
			</div>
		</div>
	);
}
