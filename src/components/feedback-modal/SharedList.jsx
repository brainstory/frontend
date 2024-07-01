import LoadingAnimation from "@components/global/LoadingAnimation";
import { getGravatarUrl } from "@helpers/helpers";

export default function SharedList({ people, isLoading }) {
	const renderPeopleList = () => {
		return people.map((user, i) => (
			<li key={i} className="flex justify-between w-full my-2 px-1">
				<div className="flex flex-row flex-wrap mr-2 min-w-0 gap-2 items-center">
					<img
						src={getGravatarUrl(user.email)}
						alt="Gravatar"
						className="w-6 h-6 rounded-full"
					/>
					<span className="text-sm gap-2 sm:flex leading-tight sm:leading-normal">
						{<p className="truncate">{user?.name ? user.name : user.email}</p>}
						<p className="truncate text-stone-500">{user?.name && user.email}</p>
					</span>
				</div>
				<p className="whitespace-nowrap">{user.groupName}</p>
			</li>
		));
	};

	return (
		<div className="mt-5 min-h-[50px]">
			<p className="text-md text-stone-800 font-medium mb-2">People with access</p>
			{isLoading ? (
				<LoadingAnimation />
			) : (
				<ul className="text-sm bg-white max-h-[120px] overflow-y-auto overflow-x-hidden">
					{people.length > 0 ? (
						renderPeopleList()
					) : (
						<p className="mr-1 italic">You haven't shared this idea with anyone yet</p>
					)}
				</ul>
			)}
		</div>
	);
}
