import { useState } from "react";
import PinkButton from "@ds/PinkButton";
import { generateSmallId } from "@helpers/api/auth";

const SharePear = ({ ideaSummary }) => {
	const [isCopied, setIsCopied] = useState(false);
	const [shareLink, setShareLink] = useState();
	const [loading, setLoading] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(shareLink);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	const handleCreateShareLink = () => {
		let slug = generateSmallId();
		setLoading(true);
		useShareBlogApi(slug, encodeURIComponent(ideaSummary))
			.then((r) => {
				setShareLink(`https://share.contenda.co/blog/${slug}`);
				setLoading(false);
			})
			.catch((error) => {
				console.log("error", error);
				setLoading(false);
			});
	};

	return (
		<div className="min-h-[358px]">
			<p className="text-md text-stone-800 font-medium">Send read-only share link</p>
			<p className="text-sm text-stone-500 italic mb-6">
				Anyone with this link can see your idea, but they cannot offer feedback or comment.
				Be sure to only share this link with people who you want to see your idea!
			</p>
			<div className="mb-10">
				{shareLink ? (
					<div className="flex">
						<input
							id="share-pear-link"
							defaultValue={shareLink}
							className="w-full px-3 py-2 placeholder-stone-400 border border-stone-300 rounded-md"
						/>
						<PinkButton
							id="copy-button"
							disabled={!!isCopied}
							onClick={handleCopy}
							classes="ml-2"
							data-te-clipboard-init
							data-te-clipboard-target="#share-pear-link"
						>
							{isCopied ? "Copied!" : "Copy"}
						</PinkButton>
					</div>
				) : (
					<PinkButton onClick={handleCreateShareLink} disabled={loading}>
						{loading ? "Loading..." : "Generate a read-only share link"}
					</PinkButton>
				)}
			</div>
		</div>
	);
};

const shareBlog = async (shareSlug, markdown) => {
	if (!shareSlug) throw new Error(`No share slug provided.`);

	const response = await fetch(`https://share.contenda.co/blog/${shareSlug}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			markdown: markdown
		}
	});

	return await response.json();
};

async function useShareBlogApi(slug, markdown) {
	let response = null;
	let loading = true;
	let error = null;

	await shareBlog(slug, markdown)
		.then((res) => {
			response = res;
			loading = false;
		})
		.catch((e) => {
			error = e;
			loading = false;
		});

	return { response, loading, error };
}

export default SharePear;
