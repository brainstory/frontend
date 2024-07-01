import { useState, useEffect } from "react";
import ShareWithEmail from "./ShareWithEmail";
import ShareOptions from "./ShareOptions";

import { getSharedGroupListApi, getSharedIndividualListApi } from "@helpers/api/idea_share";

export default function GetFeedbackModal({ isOpen, onClose, ideaId, ideaTitle, ideaSummary }) {
	const [isOnMainModal, setIsOnMainModal] = useState(true);
	const [sharedPeople, setSharedPeople] = useState([]);
	const [isLoadingSharedPeople, setIsLoadingSharedPeople] = useState(true);

	useEffect(() => {
		setIsLoadingSharedPeople(true);

		fetchAllSharedUsers(ideaId)
			.then((users) => {
				setSharedPeople(users);
			})
			.catch((err) => {
				console.log("Error getting users shared with ", ideaId, err);
			})
			.finally(() => setIsLoadingSharedPeople(false));
	}, [isOnMainModal]);

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center ${
				isOpen ? "" : "hidden"
			}`}
		>
			<div className="fixed inset-0 bg-black opacity-40"></div>
			<div className="max-w-[650px] w-[90vw] bg-white mx-auto rounded-lg relative shadow-md">
				{isOnMainModal ? (
					<ShareOptions
						onAddPeople={() => setIsOnMainModal(false)}
						onClose={onClose}
						ideaId={ideaId}
						ideaTitle={ideaTitle}
						sharedPeople={sharedPeople}
						isLoadingSharedPeople={isLoadingSharedPeople}
						ideaSummary={ideaSummary}
					/>
				) : (
					<ShareWithEmail
						onReturnToMain={() => setIsOnMainModal(true)}
						onClose={onClose}
						ideaId={ideaId}
						ideaTitle={ideaTitle}
						sharedPeople={sharedPeople}
					/>
				)}
			</div>
		</div>
	);
}

const fetchAllSharedUsers = async (ideaId) => {
	const allSharedGroupPeople = await getSharedGroupListApi(ideaId)
		.then((sharedGroups) => {
			return sharedGroups.reduce((allUsers, group, gIndex) => {
				const users = group.users.map((user) => ({
					name: user.name,
					email: user.email,
					sharedAt: user.shared_at,
					groupName: "Group " + (gIndex + 1)
				}));
				return allUsers.concat(users);
			}, []);
		})
		.catch((err) => {
			console.log("Error getting shared groups", ideaId, err);
			return [];
		});
	const allSharedIndivPeople = await getSharedIndividualListApi(ideaId)
		.then((sharedIndivs) => {
			const allSharedIndivs = sharedIndivs.map((user) => ({
				name: user.name,
				email: user.email,
				sharedAt: user.shared_at,
				groupName: "Individual"
			}));
			return allSharedIndivs;
		})
		.catch((err) => {
			console.log("Error getting shared individuals", ideaId, err);
			return [];
		});
	let allShared = allSharedGroupPeople.concat(allSharedIndivPeople);
	allShared.sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));
	return allShared;
};
