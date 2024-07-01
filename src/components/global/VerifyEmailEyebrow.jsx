import { useStore } from "@nanostores/react";
import { $userState } from "@components/global/userStore.js";

import Eyebrow from "@ds/Eyebrow";

export default function VerifyEmailEyebrow({ loggedOut = false }) {
	const userState = useStore($userState);
	const { userMailVerified, userEmail } = userState || {};
	if (
		!loggedOut &&
		$userState !== undefined &&
		userMailVerified === false &&
		!window.location.href.includes("/get-started")
	) {
		return <Eyebrow iconName="warning-outline" text={"Verify your email: " + userEmail} />;
	} else {
		return <></>;
	}
}
