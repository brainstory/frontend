import EmojiItem from "./EmojiItem";
import React, { useState } from "react";

/**
 * EmojiList Component
 *
 * Displays a list of reactions with avatars and labels, and provides a tooltip on hover.
 *
 * @component
 * @param {Object[]} reactions - An array of reactions with each item in format [{feedbackItem, paragraphIndex}]
 * @param {function} onReactionClick - A callback function triggered when a reaction is clicked.
 *
 * @example
 * <EmojiList
 *   reactions={[
 *     { feedbackItem: { creatorEmail: "john@example.com", labels: [{ name: "like", emoji: "👍" }] }, paragraphIndex: 0 },
 *     { feedbackItem: { creatorEmail: "jane@example.com", labels: [{ name: "love", emoji: "❤️" }] }, paragraphIndex: 1 },
 *   ]}
 *   onReactionClick={(reaction) => handleReactionClick(reaction)}
 * />
 */
export default function EmojiList({ reactions, onReactionClick, isFocused }) {

	const outlineClass = isFocused && 'outline outline-blue-500 outline-2 ease-in-out duration-300';

	return (
		<div className={`flex flex-wrap p-1 rounded-lg w-fit ${outlineClass}`}>
			{reactions &&
				reactions
					.slice(0, 6)
					.map((reaction, index) => (
						<EmojiItem
							key={index}
							labels={reaction.labels}
							creatorEmail={reaction.creatorEmail}
							onReactionClick={() => onReactionClick(reaction)}
							style="m-1 "
						/>
					))}
			{reactions && reactions.length > 6 && (
				<button
					className="flex items-center"
					onClick={() => onReactionClick(reactions[6])}
				>
					<span className="text-gray-600 w-max">+{reactions.length - 6} more</span>
				</button>
			)}
		</div>
	);
}
