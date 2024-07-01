export default function ErrorSection({ title, paragraphs = [] }) {
	// Fix for issue when redirecting on feedback. This is very hackish
	if (
		window.location.pathname.includes("/auth-redirect") &&
		window.location.pathname.includes("/feedback")
	) {
		window.location.href = "/feedback" + window.location.search;
	}

	return (
		<div className="mx-auto w-full px-6 md:px-24 max-w-4xl py-12 scroll-mt-12">
			<p className="text-black font-bold lg:text-5xl text-4xl tracking-tight">{title}</p>
			<div className="text-stone-500 lg:text-xl text-base flex flex-col gap-3 mt-6">
				{paragraphs.map((pText, i) => {
					return <p key={i}>{pText}</p>;
				})}
				<p>
					If you're seeing this page in error, contact{" "}
					<a className="underline" href="mailto:support@brainstory.ai">
						support@brainstory.ai
					</a>
				</p>
			</div>
		</div>
	);
}
