import { useState } from "react";

export default function Eyebrow({ iconName, text }) {
	const [isClose, setIsClose] = useState(false);
	return (
		<div
			className={`relative z-50 bg-yellow-400 w-full text-xs md:text-sm ease-in-out transform text-stone-900 p-1 flex gap-1 justify-center items-center flex-nowrap justify-items-stretch ${
				isClose && "hidden"
			}`}
		>
			<p className="truncate inline-block align-middle mx-3">
				<ion-icon name={iconName} class="hydrated inline-block align-middle mr-1" />
				{text}
			</p>
			<button
				onClick={() => setIsClose(true)}
				className="absolute right-2 inline-flex hover:opacity-60 bg-yellow-400"
			>
				<ion-icon name="close" class="hydrated" />
			</button>
		</div>
	);
}
