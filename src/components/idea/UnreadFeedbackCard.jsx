import { formatISO8601ToHumanReadable, getGravatarUrl } from "@helpers/helpers";

export default function UnreadFeedbackCard({ id, title, createdAt, creatorEmail }) {
	const humanReadableDate = formatISO8601ToHumanReadable(createdAt);

	return (
		<a href={`/idea?id=${id}`}>
			<div className="relative flex flex-col justify-between mx-auto max-w-sm h-full p-6 bg-white border border-stone-200 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-transform">
				<div>
					<PinkIcon />
					<h3 className="mb-4 text-2xl font-semibold tracking-tight text-stone-900">
						{title.length > 100 ? `${title.slice(0, 100)}...` : title}
					</h3>

					<p className="mb-3 text-xs text-stone-400">{humanReadableDate}</p>
				</div>

				<div>
					<FeedbackFrom creatorEmail={creatorEmail} />
					<hr className="w-8/12 h-1 mx-auto my-4 bg-stone-100 border-0 rounded md:my-4" />
					<p className="flex justify-end items-center text-pink-700 hover:underline mt-3">
						<span className="mr-2">View Feedback</span>
						<ion-icon
							class="w-4 h-4 md hydrated"
							name="arrow-forward-outline"
							role="img"
							aria-label="expand"
						></ion-icon>
					</p>
				</div>
			</div>
		</a>
	);
}

function FeedbackFrom({ creatorEmail }) {
	return (
		<div className="group mb-4 flex items-center">
			<img
				key={creatorEmail + "-creator-gravatar"}
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white mr-2"
				src={getGravatarUrl(creatorEmail)}
				alt={`${creatorEmail}'s Gravatar `}
			/>
			<div className="width-[100%] truncate">
				<p className="text-xs font-medium text-pink-700">Feedback from</p>
				<p className="text-xs font-medium text-pink-700 truncate">{creatorEmail}</p>
			</div>
		</div>
	);
}

function PinkIcon() {
	return (
		<div className="float-left">
			<span className="flex items-center justify-center mt-1 mr-2 w-6 h-6 bg-pink-100 text-pink-600 rounded-full -left-4 ring-8 ring-white">
				<ion-icon
					class="w-4 md hydrated"
					name="mail-outline"
					role="img"
					aria-label="feedback message"
				></ion-icon>
			</span>
		</div>
	);
}
