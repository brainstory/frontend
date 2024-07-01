import { useRive } from "@rive-app/react-canvas";

export default function RivePencil({ type = "wave", small = false }) {
	return (
		<div className={small ? `w-24 h-28` : `w-20 h-32 md:w-36 md:h-44`}>
			{type === "wave" && <Wave />}
			{type === "look" && <Look />}
			{type === "jump" && <Jump />}
		</div>
	);
}

function Wave() {
	const { rive, RiveComponent } = useRive({
		src: "/rive/pencilwave_375_460.riv",
		autoplay: true
	});

	return (
		<RiveComponent
			onMouseEnter={() => rive && rive.play()}
			onMouseLeave={() => rive && rive.pause()}
		/>
	);
}

function Look() {
	const { rive, RiveComponent } = useRive({
		src: "/rive/pencillook_375_460.riv",
		autoplay: false
	});

	return (
		<RiveComponent
			onMouseEnter={() => rive && rive.play()}
			onMouseLeave={() => rive && rive.pause()}
		/>
	);
}

function Jump() {
	const { RiveComponent } = useRive({
		src: "/rive/penciljump.riv",
		autoplay: true
	});

	return <RiveComponent />;
}
