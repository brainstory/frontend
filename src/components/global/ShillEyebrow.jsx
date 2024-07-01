import { useState } from "react";

export default function ShillEyebrow() {
	useState;

	return (
		<div className="w-full p-1 h-fit flex flex-col text-stone-900 items-center bg-gradient-to-r from-indigo-100 to-pink-200 rounded">
			<p className="text-md font-semibold">🚀 We just launched on Product Hunt!</p>
			<p className="text-sm">
				Show support by upvoting{" "}
				<a
					className="text-blue-700 underline hover:no-underline"
					href="https://www.producthunt.com/posts/brainstory-for-teams"
					target="_blank"
				>
					here
				</a>{" "}
				<span className="text-red-500">❤️</span>
			</p>
		</div>
	);
}
