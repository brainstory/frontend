import { useState, useEffect } from "react";
import { shareIdeaApi, shareIdeaWithGroup } from "@helpers/api/idea_share";
import { getUserShareRecents } from "@helpers/api/user";
import { isEmailValid } from "@helpers/helpers";
import FeedbackModalTitleBar from "./FeedbackModalTitleBar";
import EmailsInputField from "./EmailsInputField";
import PinkButton from "@ds/PinkButton";

const defaultMessage = `Could you take a look at this idea I had and give me feedback?`;

export default function ShareWithEmail({ onReturnToMain, onClose, ideaId, ideaTitle }) {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [emailError, setEmailError] = useState("");
	const [sendError, setSendError] = useState("");
	const [emailsAlreadySharedError, setEmailsAlreadySharedError] = useState([]);
	const [emailSent, setEmailSent] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [sendToEmailAddresses, setSendToEmailAddresses] = useState([]);
	const [checkedGroupShare, setCheckedGroupShare] = useState(true);
	const [recentShares, setRecentShares] = useState([]);

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		if (emailError) {
			setEmailError("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			addEmailToSendToEmailAddresses();
		}
	};

	const handleBlur = () => {
		addEmailToSendToEmailAddresses();
	};

	const handleSelectEmailOption = (email) => {
		const strippedEmail = email.trim().replace(/,/g, "");
		if (!sendToEmailAddresses.includes(strippedEmail)) {
			setSendToEmailAddresses([...sendToEmailAddresses, strippedEmail]);
		}
	};

	const addEmailToSendToEmailAddresses = () => {
		const strippedEmail = email.trim().replace(/,/g, ""); // Remove commas and spaces from the email

		if (strippedEmail !== "" && isEmailValid(strippedEmail)) {
			setSendToEmailAddresses([...sendToEmailAddresses, strippedEmail]);
			setEmail("");
			setEmailError(""); // Clear any previous error messages
		} else if (strippedEmail !== "") {
			setEmailError(
				`${strippedEmail} is not a valid email. Please add a valid email address.`
			);
		}
	};

	const removeEmail = (email) => {
		const updatedEmails = sendToEmailAddresses.filter((e) => e !== email);
		setSendToEmailAddresses(updatedEmails);
	};

	const handleMessageChange = (e) => {
		setMessage(e.target.value);
	};

	const setEmailSentSuccessful = () => {
		setEmailSent(true);
		setEmailError("");
		setSendError("");
	};

	const handleSend = async () => {
		if (sendToEmailAddresses.length === 0) {
			setEmailError("Please add at least one email address");
			return;
		}

		setIsSending(true);
		const messageToSend = message ? message.trim() : defaultMessage;

		if (sendToEmailAddresses.length >= 2 && checkedGroupShare) {
			await shareIdeaWithGroup(ideaId, messageToSend, sendToEmailAddresses)
				.then(setEmailSentSuccessful)
				.catch((err) => {
					console.log("Error:", err);
					setSendError(
						"Error sharing. You can't send feedback request to an email more than once. Contact support@brainstory.ai for help."
					);
				})
				.finally(() => {
					setIsSending(false);
				});
		} else {
			const alreadySharedEmails = [];
			const promises = sendToEmailAddresses.map((email) =>
				shareIdeaApi(ideaId, messageToSend, email).then((resp) => {
					if (resp === null) {
						alreadySharedEmails.push(email);
					}
				})
			);
			Promise.all(promises)
				.then(setEmailSentSuccessful)
				.catch((err) => console.log("Error:", err))
				.finally(() => {
					if (alreadySharedEmails.length > 0) {
						setEmailsAlreadySharedError(alreadySharedEmails);
					}
					setIsSending(false);
				});
		}
	};

	const handleBackToOriginal = () => {
		setSendToEmailAddresses([]);
		setEmailSent(false);
		setEmail("");
		setMessage("");
	};

	useEffect(() => {
		getUserShareRecents().then((recents) => setRecentShares(recents));
	}, []);

	return (
		<div>
			<FeedbackModalTitleBar
				ideaTitle={ideaTitle}
				onClose={onClose}
				onBack={onReturnToMain}
				overrideTitle={emailSent && "Feedback Request Sent!"}
			/>

			<div className="p-7">
				{emailSent ? (
					<div>
						{emailsAlreadySharedError.length > 0 && (
							<p className="text-md text-red-500 mb-4">
								Idea already shared with emails:{" "}
								{emailsAlreadySharedError.join(", ")}
							</p>
						)}
						<p className="text-md text-stone-700 mb-6">
							Recipients will get an email to give feedback to your idea. When they
							submit feedback you will be notified by email and it will appear on your
							dashboard.
						</p>
						<button
							onClick={handleBackToOriginal}
							type="button"
							className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full"
						>
							Send another feedback request
						</button>
					</div>
				) : (
					<div>
						<EmailsInputField
							autoFocus={true}
							value={email}
							onChange={handleEmailChange}
							onBlur={handleBlur}
							onKeyDown={handleKeyDown}
							onSelectEmailOption={handleSelectEmailOption}
							removeEmail={removeEmail}
							emailError={emailError}
							sendToEmails={sendToEmailAddresses}
							recentShares={recentShares}
						/>

						<div className="flex sm:items-center my-6">
							<input
								type="checkbox"
								checked={checkedGroupShare}
								onChange={() => setCheckedGroupShare(!checkedGroupShare)}
								disabled={sendToEmailAddresses.length < 2}
								className="w-5 h-5 disabled:bg-stone-200 border-stone-300 rounded focus:ring-blue-500 disabled:pointer-events-none"
							/>
							<label className="ms-2 text-md text-stone-800 ">
								Allow group access to each other's feedback
							</label>
						</div>

						<div className="flex text-stone-800 font-medium mt-4 mb-2">
							<p className="text-md">Message</p>
							<p className="text-sm text-stone-500 italic"> &nbsp;(optional)</p>
						</div>

						<div className="mb-6">
							<textarea
								value={message}
								placeholder={defaultMessage}
								onChange={handleMessageChange}
								rows="2"
								className="w-full px-3 py-2 placeholder-stone-400 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							></textarea>
						</div>

						<div className="flex justify-end">
							<PinkButton onClick={handleSend} disabled={isSending}>
								{isSending ? "Sending..." : "Send"}
							</PinkButton>
						</div>

						{sendError && <p className="text-red-500 mt-1">{sendError}</p>}
					</div>
				)}
			</div>
		</div>
	);
}
