export const SUCCESS_COPY = {
	DEFAULT: "Success!",
	SAVE: "Changes Saved!"
};

export const ERROR_COPY = {
	DEFAULT: "Error! Contact support@brainstory.ai for assistance.",
	RESET_PWD: "Error resetting password! Contact support@brainstory.ai for assistance.",
	SAVE: "Error saving changes. Try again or contact support@brainstory.ai"
};

export function Snackbar({ isSuccess, message, closeAfterTime }) {
	const successStyle =
		"bg-green-500 z-20 fixed z-100 mt-5 p-4 rounded-md shadow-lg top-0 text-center";
	const errorStyle = "bg-red-500 z-20 fixed mt-5 p-4 rounded-md shadow-lg top-0 text-center";
	const style = isSuccess ? successStyle : errorStyle;

	closeAfterTime();

	return (
		<div className={style}>
			<p className="text-white">{message}</p>
		</div>
	);
}

export default {
	Snackbar,
	SUCCESS_COPY,
	ERROR_COPY
};
