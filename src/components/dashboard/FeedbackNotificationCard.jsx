import { useState, useEffect } from "react";
import { formatISO8601ToHumanReadable } from "@helpers/helpers";

export default function FeedbackNotificationCard({ notification }) {
	const monthAndDateReceived = formatISO8601ToHumanReadable(notification.created_at, {
		month: "short",
		day: "numeric"
	});
	const senderEmail = notification.related_idea_owner_email;
	const redirectLink = notification.draft_response_idea_id
		? `/chat?id=${notification.draft_response_idea_id}&isFeedbackAndFrom=${notification.related_idea_owner_name}`
		: `/chat?parentId=${notification.related_idea_id}&isFeedbackAndFrom=${notification.related_idea_owner_name}`;

	return (
		<button
			className="my-1 group relative w-[275px] bg-white p-4 rounded-lg text-left shadow hover:shadow-lg hover:-translate-y-1 transition-transform"
			onClick={() => (window.location.href = redirectLink)}
		>
			<span className="w-[243px] inline-flex justify-between items-baseline">
				<h3 className="tracking-tight font-semibold text-stone-900 truncate">
					{notification.related_idea_title}
				</h3>
				{notification.draft_response_idea_id && <p className="ml-1 text-xs">DRAFT</p>}
			</span>

			<span className="w-[243px] mt-1 text-xs text-stone-400 inline-flex justify-between">
				<p className="truncate" title={senderEmail}>
					Requested by <b>{senderEmail}</b>
				</p>
				<p className="ml-1 whitespace-nowrap">{monthAndDateReceived}</p>
			</span>
		</button>
	);
}
