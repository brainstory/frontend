export default function IdeaPlaceholder() {
	return (
		<div
			role="status"
			className="max-w-sm p-6 border border border-stone-200 rounded-lg shadow animate-pulse"
		>
			<div className="h-4 bg-stone-200 rounded-full w-48 mb-4"></div>

			{[...Array(3)].map((_, i) => (
				<div key={"long" + i} className="h-2 bg-stone-200 rounded-full mb-3.5"></div>
			))}
			{[...Array(3)].map((_, i) => (
				<div key={"short" + i} className="h-2 bg-stone-200 rounded-full w-48 mb-3.5"></div>
			))}
			<div className="h-2 bg-stone-200 rounded-full mb-3.5"></div>
			<div className="h-2 bg-stone-200 rounded-full"></div>
			<span className="sr-only">Loading...</span>
		</div>
	);
}
