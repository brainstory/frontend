const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL;

/** Data from idea being shared. */
export async function getShareIdeaApi(shareId) {
	const response = await fetch(`${PUBLIC_API_URL}api/story/guest/idea/share`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${shareId}`
		}
	});

	if (response.ok) {
		const data = await response.json();
		return {
			parentId: data.id,
			title: data?.title,
			summary: data?.result,
			creatorName: data?.creator_name,
			creatorEmail: data?.creator_email,
			sharedWithEmail: data?.shared_with_email,
			shareMessage: data?.share_message
		};
	} else {
		throw Error(response.status);
	}
}
