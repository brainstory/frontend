import LoadingAnimation from "@components/global/LoadingAnimation";

export default function LoadingScreen() {
	return (
		<div className="">
			<LoadingAnimation text={loadingCopies[0]} />
		</div>
	);
}

const loadingCopies = [
	"Authenticating...",
	"Staring at the sun...",
	"Growing brain cells...",
	"Connecting neurons...",
	"Seeking the amulet...",
	"Building pyramids...",
	"Lotioning elbows...",
	"Applying lip balm...",
	"Melting...",
	"Howling at the moon...",
	"Wishing upon a star...",
	"Drawing a cool S...",
	"Opening windows...",
	"Sharpening pencils...",
	"Stretching arms..."
];
