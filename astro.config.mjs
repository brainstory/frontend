import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://app.brainstory.ai",
	integrations: [sitemap(), react()],
	vite: {
		plugins: [tailwindcss()]
	},
	server: { port: 5173 } // TODO change when not local
});
