import { useState } from "react";

import { $userState } from "@components/global/userStore.js";
import { getCookie } from "@src/helpers/cookie";

import LoadingAnimation from "@components/global/LoadingAnimation";

export default function IndexWrapper() {
	const [isLoading, setIsLoading] = useState(true);

	$userState.listen((value, oldValue) => {
		setIsLoading(!value);
	});

	if (isLoading || getCookie("auth_redirect_url") !== undefined) {
		return (
			<div className="mx-auto mt-8">
				<LoadingAnimation />
			</div>
		);
	} else {
		if (getCookie("has_done_getting_started")) {
			location.href = "/dashboard";
		} else {
			location.href = "/get-started";
		}
	}
}
