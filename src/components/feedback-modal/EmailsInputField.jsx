import { useState, useEffect } from "react";
import { getGravatarUrl } from "@helpers/helpers";

export default function EmailsInputField({
	onClick,
	onChange,
	onBlur,
	onKeyDown,
	onSelectEmailOption,
	removeEmail,
	value = "",
	emailError = null,
	autoFocus = false,
	sendToEmails = [],
	recentShares
}) {
	const suggestions = recentShares
		? recentShares.filter((e) => !sendToEmails.includes(e.email))
		: [];
	const hasSuggestions = suggestions.length > 0;
	const [showSuggestions, setShowSuggestions] = useState(false);

	useEffect(() => {
		const hasSuggestions = suggestions.length > 0;
		setShowSuggestions(autoFocus && hasSuggestions);
	}, [recentShares]);

	const renderSelectedEmails = () => {
		return sendToEmails.map((email, index) => (
			<span key={index} className="bg-pink-100 rounded-full px-2 py-1 flex text-sm">
				{
					<img
						src={getGravatarUrl(email)}
						alt="Gravatar"
						className="w-6 h-6 rounded-full mr-2"
					/>
				}
				{email}
				<button
					type="button"
					onClick={() => removeEmail(email)}
					className="ml-2 focus:outline-none"
				>
					<svg className="h-4 w-4" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M14.243 13.95a.6.6 0 01-.849 0L10 10.848l-3.394 3.395a.6.6 0 11-.849-.85L9.15 10 5.755 6.606a.6.6 0 11.85-.85L10 9.15l3.394-3.393a.6.6 0 11.85.848L10.85 10l3.394 3.394a.6.6 0 010 .849z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</span>
		));
	};

	return (
		<div>
			<p className="text-md text-stone-800 font-medium">Send emails</p>
			<p className="text-sm text-stone-500 italic mb-2">
				Create groups and email people the share link with instructions
			</p>
			<div className="flex flex-wrap mb-1 gap-1">{renderSelectedEmails()}</div>
			<div className="flex flex-col">
				<input
					autoFocus={autoFocus}
					type="email"
					value={value}
					readOnly={!onChange}
					onClick={onClick}
					onFocus={() => setShowSuggestions(hasSuggestions)}
					onChange={onChange}
					onBlur={(e) => {
						onBlur();
						setShowSuggestions(false);
					}}
					onKeyDown={(e) => {
						onKeyDown(e);
						if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
							setShowSuggestions(false);
							e.currentTarget.blur();
						}
					}}
					placeholder="Add people or create groups"
					className="sm:max-w-[350px] px-3 py-2 placeholder-stone-400 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
				></input>

				{hasSuggestions && showSuggestions && (
					<div className="relative top-1">
						<div className="absolute w-full sm:max-w-[350px] max-h-[170px] overflow-auto bg-stone-100 shadow-md scroll-smooth">
							{suggestions.map((person) => (
								<button
									key={person.email}
									className="flex gap-3 items-center w-full text-sm p-2 leading-tight hover:bg-pink-100"
									onMouseDown={() => {
										onSelectEmailOption(person.email);
										setShowSuggestions(false);
									}}
								>
									<img
										src={getGravatarUrl(person.email)}
										alt="Gravatar"
										className="w-6 h-6 rounded-full"
									/>
									<div className="flex flex-col items-start justify-center truncate">
										<p>{person?.name ? person.name : person.email}</p>
										<p className="text-stone-500">
											{person?.name && person.email}
										</p>
									</div>
								</button>
							))}
						</div>
					</div>
				)}

				{emailError && <p className="text-red-500 text-sm mb-1">{emailError}</p>}
			</div>
		</div>
	);
}
