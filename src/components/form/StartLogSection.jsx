import LogEntry from "./LogEntryInput";

export default function StartLogSection({ logItems, setLogItems, disabled }) {
	return (
		<div className="flex flex-col gap-1 my-5 h-[calc(100%-152px)] overflow-y-auto">
			{logItems.map((item, i) => {
				const toggleItem = (e) => {
					let updateLogItems = [...logItems];
					updateLogItems[i].value = !updateLogItems[i].value;
					setLogItems(updateLogItems);
				};
				const lineBreak =
					logItems.length == i + 1 ? null : (
						<div key={"divider-" + item.id} className="h-[1px] bg-stone-200" />
					);
				return [
					<LogEntry key={item.id} disabled={disabled} onChange={toggleItem} {...item} />,
					lineBreak
				];
			})}
			<div className="p-5 mt-4 md:flex-col bg-stone-100 text-center flex text-sm items-center text-stone-600 gap-1 rounded-lg">
				<ion-icon name="bulb-outline" class="w-5 h-5 hydrated mr-3 lg:mr-1" />
				<div>
					<p className="text-left md:text-center">
						You can customize your questions in{" "}
						<a className="text-blue-700 hover:underline" href="/profile?tab=dailyLog">
							My Profile
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
