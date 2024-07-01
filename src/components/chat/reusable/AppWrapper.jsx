import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export function AppWrapper({ children }) {
	const [sludgeman, setSludgeman] = useState("idle");
	const sharedState = {
		sludgeman,
		setSludgeman
	};

	return <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	return useContext(AppContext);
}
