import React from "react";

export default function AddProfilePictureModal({ isOpen, onClose }) {
	return (
		<div
			className={`fixed inset-0 flex items-center justify-center z-50 ${
				isOpen ? "" : "hidden"
			}`}
		>
			<div className="fixed inset-0 bg-black opacity-60" onClick={onClose}></div>
			<div className="relative bg-white w-[90vw] max-w-md p-6 rounded-lg shadow-md">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-stone-400 hover:text-stone-500 focus:outline-none"
				>
					<span className="sr-only">Close</span>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
				<div className="text-stone-700">
					<h2 className="text-xl font-semibold mb-4">Upload Profile Picture</h2>
					<p className="mb-4">To set your profile picture, follow these steps:</p>
					<ol className="list-decimal pl-6 space-y-2">
						<li>
							Go to{" "}
							<a
								href="https://gravatar.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline"
							>
								gravatar.com
							</a>
							.
						</li>
						<li>Sign in or create an account.</li>
						<li>Add an email address associated with this account.</li>
						<li>Upload your profile picture.</li>
					</ol>
					<p className="mt-6 text-center text-stone-500">
						It could take up to 24 hours for a newly uploaded image to appear
					</p>
				</div>
			</div>
		</div>
	);
}
