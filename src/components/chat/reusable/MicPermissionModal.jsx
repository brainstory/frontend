import { useState } from "react";

export default function MicPermissionModal({ setIsClose }) {
	/** granted, denied, prompt */
	const [micPermissionStatus, setMicPermissionStatus] = useState(null);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	if (!isSafari) {
		navigator.permissions
			.query({ name: "microphone" })
			.then((permissionStatus) => {
				console.log("set permissions from navigator.permssions");
				setMicPermissionStatus(permissionStatus.state);
			})
			.catch(() => {});
	}

	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
			setMicPermissionStatus("granted");
			// console.log("set granted", stream);
		})
		.catch((e) => {
			if (e?.message === "Permission dismissed") {
				// console.log("permission dismissed");
				setIsClose(true);
			} else {
				setMicPermissionStatus("denied");
				// console.log("set denied");
			}
		});

	const renderContent = () => {
		const iconStyle = "hydrated w-14 h-14 mx-auto";
		if (micPermissionStatus === "denied") {
			return (
				<>
					<ion-icon name="alert-circle" class={iconStyle + " text-red-500"} />
					<div className="text-center">
						<h1 className="text-2xl my-5">
							Mark can't hear you! <br />
							Allow microphone permission
						</h1>
						<p className="text-stone-700">
							Check your browser or device settings and turn on your mic to get the
							most out of your thoughts, out loud.
						</p>
					</div>
				</>
			);
		} else if (micPermissionStatus === "prompt") {
			return (
				<>
					<ion-icon name="mic-circle" class={iconStyle + " text-green-500"} />
					<div className="text-center">
						<h1 className="text-2xl my-5">
							Mark can't hear you! Click <b>Allow</b>
						</h1>
						<p className="text-stone-700">
							Turn on your mic and get the most out of your thoughts, out loud.
						</p>
					</div>
				</>
			);
		}
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center ${
				micPermissionStatus === "granted" || micPermissionStatus === null ? "hidden" : ""
			}`}
		>
			<div className="fixed inset-0 bg-black opacity-40"></div>
			<div className="flex flex-col max-w-[500px] w-[90vw] bg-white mx-auto rounded-lg relative shadow-md p-8 md:p-10">
				{micPermissionStatus !== "prompt" && (
					<button
						className="absolute right-4 top-4 opacity-60 hover:opacity-100"
						onClick={() => setIsClose(true)}
						onBlur={() => setIsClose(true)}
					>
						<ion-icon class="hydrated h-6 w-6" name="close-outline" />
					</button>
				)}

				{renderContent()}
			</div>
		</div>
	);
}
