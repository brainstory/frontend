export default function Avatar({ id, charToShow, size = 10, style = "" }) {
	const containerClasses = `h-${size} w-${size} relative inline-flex items-center justify-center overflow-hidden rounded-full ${style} `;

	return (
		<div className={containerClasses + getColorFromId(id)}>
			<span className="capitalize font-medium text-white text-sm">{charToShow}</span>
		</div>
	);
}

const bgColors = [
	"bg-slate-600",
	"bg-red-700",
	"bg-pink-600",
	"bg-amber-600",
	"bg-emerald-600",
	"bg-green-800",
	"bg-lime-700",
	"bg-cyan-600",
	"bg-blue-800",
	"bg-indigo-700",
	"bg-violet-800",
	"bg-fuchsia-700",
	"bg-rose-700"
];

function getColorFromId(id) {
	let hash = 0,
		i,
		chr;
	for (i = 0; i < id.length; i++) {
		chr = id.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	const index = Math.abs(hash) % bgColors.length;
	return bgColors[index];
}
