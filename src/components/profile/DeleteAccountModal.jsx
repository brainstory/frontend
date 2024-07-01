import React, { useState } from "react";
import { deleteUserApi } from "@helpers/api/auth.js";
let baseUrl = import.meta.env.PUBLIC_API_URL;

function DeleteConfirmationModal({
	isOpen,
	onClose,
	setSnackbarErrorOpen,
	setSnackbarErrorMessage
}) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		console.log("DELETE ACCOUNT");
		setIsDeleting(true);
		await deleteUserApi()
			.then((notice) => {
				console.log("Account deleted", notice);
				// clear auth session data and logout to direct to login page
				localStorage.removeItem("csrf_verify");
				window.location.href = `${baseUrl}auth-brainstory/v1/flow/logout`;
			})
			.catch((err) => {
				setIsDeleting(false);
				setSnackbarErrorOpen(true);
				setSnackbarErrorMessage(
					"Error deleting account! Contact support@brainstory.ai for help."
				);
				console.log("error", err);
			});
	};

	return (
		<div
			className={`absolute w-screen h-screen inset-0 z-50 flex items-center justify-center ${
				isOpen ? "" : "hidden"
			}`}
		>
			<div className="modal-background" onClick={onClose} />
			<div className="w-[90vw] bg-white mx-auto rounded-lg p-8 relative shadow-md">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-stone-400 hover:text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
				>
					<span className="sr-only">Close menu</span>
					<svg
						className="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<div className="box">
					<p>Are you sure you want to delete your account?</p>
					<div className="flex align-end">
						<button
							className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</button>
					</div>
				</div>
			</div>
			<button className="modal-close is-large" aria-label="close" onClick={onClose} />
		</div>
	);
}

export default DeleteConfirmationModal;
