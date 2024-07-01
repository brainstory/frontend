import React, { useState } from "react";
import TimezoneSelect from "react-timezone-select";

import { resetPasswordApi } from "@helpers/api/auth.js";
import { getGravatarUrl } from "@helpers/helpers";

import SubscriptionModal from "@components/buying/SubscriptionModal";
import AddProfilePictureModal from "@components/profile/AddProfilePictureModal";

import BorderedButton from "@ds/BorderedButton";
import PinkButton from "@ds/PinkButton";
import { ERROR_COPY } from "@ds/Snackbar";
import { formatISO8601ToHumanReadable } from "@helpers/helpers";

export function Card({ children, title, subtitle, columns = 1, classes = "" }) {
	let colspan = "lg:col-span-1";
	if (columns === 2) {
		colspan = "lg:col-span-2";
	} else if (columns === 3) {
		colspan = "lg:col-span-3";
	}

	return (
		<div
			className={`w-full bg-white p-4 sm:p-8 sm:border border-stone-200 sm:rounded-lg sm:shadow ${colspan} col-span-full ${classes}`}
		>
			{title && (
				<div className="mb-6">
					<h2 className="font-semibold text-xl mb-1">{title}</h2>
					{subtitle && <h2 className="italic text-sm">{subtitle}</h2>}
				</div>
			)}
			{children}
		</div>
	);
}

export function PhotoNameCard({ userName, userEmail, createdAt, openSnackbar }) {
	const [isResetPasswordLoading, setResetPasswordLoading] = useState(false);
	const [isAddProfilePicModalOpen, setIsAddProfilePicModalOpen] = useState(false);
	const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

	const manageSubscription = () => {
		setSubscriptionModalOpen(true);
	};

	const closeSubscriptionModal = () => {
		setSubscriptionModalOpen(false);
	};

	const handleResetPassword = async () => {
		setResetPasswordLoading(true);

		await resetPasswordApi()
			.then((res) => {
				const pwdSuccessMessage = `Password reset instructions sent to ${userEmail}`;
				openSnackbar(true, pwdSuccessMessage);
			})
			.catch((err) => {
				openSnackbar(false, ERROR_COPY.RESET_PWD);
				console.log("error", err);
			})
			.finally(() => setResetPasswordLoading(false));
	};

	return (
		<Card columns={1}>
			<button
				onClick={() => setIsAddProfilePicModalOpen(true)}
				className="group bg-stone-200 flex items-center justify-center rounded-md text-4xl text-pink-600 relative"
			>
				<img
					src={getGravatarUrl(userEmail)}
					alt="User Gravatar"
					className="w-32 h-32 rounded-md"
				/>
			</button>
			<p className="text-2xl font-semibold mt-4 mb-1 truncate">{userName}</p>
			<p className="text-stone-600 mb-1 truncate">{userEmail}</p>
			<p className="text-xs text-stone-600 mt-4 mb-1 truncate">
				Joined on{" "}
				{formatISO8601ToHumanReadable(createdAt, {
					month: "short",
					day: "numeric",
					year: "numeric"
				})}
			</p>
			<div className="flex flex-col gap-1">
				<BorderedButton onClick={manageSubscription} title="Submit survey">
					Manage Subscription
				</BorderedButton>
				<BorderedButton onClick={handleResetPassword}>
					{isResetPasswordLoading ? "Sending reset email..." : "Reset Password"}
				</BorderedButton>
			</div>

			<AddProfilePictureModal
				isOpen={isAddProfilePicModalOpen}
				onClose={() => setIsAddProfilePicModalOpen(false)}
			/>
			<SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={closeSubscriptionModal} />
		</Card>
	);
}

export function GeneralCard({ userName, timezone, saveSettings }) {
	const [editedName, setEditedName] = useState(userName);
	const [selectedTimezone, setSelectedTimezone] = useState(timezone);
	const [errorMessage, setErrorMessage] = useState();
	const [hasChanged, setHasChanged] = useState(false);

	const handleNameChange = (e) => {
		const input = e.target.value;
		setEditedName(input);
		if (input.length <= 0) {
			setErrorMessage("Name cannot be empty");
		} else if (input.length > 70) {
			setErrorMessage("Name cannot be over 70 characters");
		} else {
			setErrorMessage();
		}
		const updateHasChanged = input !== userName || selectedTimezone !== timezone;
		setHasChanged(updateHasChanged);
	};

	const handleTimezoneSelect = (e) => {
		const input = e.value;
		setSelectedTimezone(input);
		const updateHasChanged = input !== userName || selectedTimezone !== timezone;
		setHasChanged(updateHasChanged);
	};

	const handleSaveClick = () => {
		if (editedName.length > 0 || input.length <= 70) {
			saveSettings(editedName, selectedTimezone);
			setHasChanged(false);
		}
	};

	return (
		<Card columns={2} title="General Information">
			<div className="mb-4">
				<label className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">
					Your name
				</label>
				<input
					value={editedName}
					type="text"
					className={`border text-stone-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ${
						errorMessage ? "border-pink-600" : "border-stone-300"
					}`}
					onChange={handleNameChange}
				/>
				{errorMessage && <p className="mt-1 text-pink-600 text-sm">{errorMessage}</p>}
			</div>
			<div className="[&_:focus-visible]:ring-0">
				<label className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">
					Your timezone
				</label>
				<TimezoneSelect
					value={selectedTimezone}
					onChange={handleTimezoneSelect}
					styles={{
						control: (baseStyles, state) => ({
							...baseStyles,
							// backgroundColor: "rgb(250 250 249 / 1)",
							fontSize: "0.875rem",
							lineHeight: "1.5rem",
							borderRadius: "0.5rem",
							fontFamily: `"Inter var", sans-serif`,
							padding: "0"
						}),
						input: (baseStyles, state) => ({
							...baseStyles,
							margin: "0"
						}),
						valueContainer: (baseStyles, state) => ({
							...baseStyles,
							padding: "0.375rem",
							margin: "0"
						}),
						menu: (baseStyles, state) => ({
							...baseStyles,
							fontSize: "0.875rem",
							lineHeight: "1.5rem"
						})
					}}
				/>
			</div>
			<PinkButton disabled={!hasChanged} onClick={handleSaveClick} classes="mt-6 mx-auto">
				Save
			</PinkButton>
		</Card>
	);
}

export default {
	PhotoNameCard,
	GeneralCard
};
