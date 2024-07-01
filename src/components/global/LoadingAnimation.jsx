export default function LoadingAnimation({ text, isVertical = false, classes }) {
	return (
		<div
			className={`flex justify-center items-center gap-4 p-2 ${
				isVertical && "flex-col"
			} ${classes}`}
		>
			<div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-pink-600 rounded-full"></div>
			{text && <p className="text-stone-500 text-sm md:text-base">{text}</p>}
		</div>
	);
}
