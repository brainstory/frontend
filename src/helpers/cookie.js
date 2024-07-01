// A function that sets a browser cookie
const setCookie = (name, value, days = 400) => {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; secure; path=/";
};

const getCookie = (cookieName) => {
	let cookie = undefined;
	if (document.cookie.length > 0) {
		cookie = document.cookie?.split("; ").find((row) => row.startsWith(`${cookieName}=`));

		if (cookie !== undefined) {
			cookie = cookie.split("=")[1];
		}
	}

	return cookie;
};

function clearCookie(name) {
	if (getCookie(name) !== undefined) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}
  }

export { setCookie, getCookie, clearCookie };
