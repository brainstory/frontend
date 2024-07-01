import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://app.brainstory.ai",
	integrations: [tailwind(), sitemap(), react()],
	server: { port: 5173 } // TODO change when not local
});
