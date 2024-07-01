/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		fontSize: {
			xs: [
				"0.75rem",
				{
					lineHeight: "1rem"
				}
			],
			sm: [
				"0.875rem",
				{
					lineHeight: "1.5rem"
				}
			],
			base: [
				"1rem",
				{
					lineHeight: "1.75rem"
				}
			],
			lg: [
				"1.125rem",
				{
					lineHeight: "2rem"
				}
			],
			xl: [
				"1.25rem",
				{
					lineHeight: "2rem"
				}
			],
			"2xl": [
				"1.5rem",
				{
					lineHeight: "2rem"
				}
			],
			"3xl": [
				"2rem",
				{
					lineHeight: "2.5rem"
				}
			],
			"4xl": [
				"2.5rem",
				{
					lineHeight: "3.5rem"
				}
			],
			"5xl": [
				"3rem",
				{
					lineHeight: "3.5rem"
				}
			],
			"6xl": [
				"3.75rem",
				{
					lineHeight: "1"
				}
			],
			"7xl": [
				"4.5rem",
				{
					lineHeight: "1.1"
				}
			],
			"8xl": [
				"6rem",
				{
					lineHeight: "1"
				}
			],
			"9xl": [
				"8rem",
				{
					lineHeight: "1"
				}
			]
		},
		extend: {
			textDecorationColor: "#e49671",
			colors: {
				black: "#2B2723",
				orange: "#e49671",
				accent: {
					50: "#f3bb9e",
					100: "#e49671",
					200: "#d4b38f",
					300: "#cdaa84",
					400: "#786b5b",
					500: "#675b4e",
					600: "#564c41",
					700: "#FFCBE2", // lightest pink
					800: "#FFA0CA", // lighter pink
					900: "#FF54A0" // pink
				}
			},
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans]
			},
			animation: {
				border: "border 4s ease infinite",
				appear: "appear 600ms ease-in 0ms forwards",
				appear0: "appear 1s ease-in 0ms forwards",
				appear1: "appear 1s ease-in 400ms forwards",
				appear2: "appear 1s ease-in 1000ms forwards",
				appear3: "appear 1s ease-in 1500ms forwards",
				appear4: "appear 1s ease-in 1600ms forwards",
				appear5: "appear 1s ease-in 2000ms forwards",
				appear6: "appear 1s ease-in 2400ms forwards"
				// "accordion-down": "accordion-down 0.2s ease-out",
				// "accordion-up": "accordion-up 0.2s ease-out"
			},
			keyframes: {
				border: {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" }
				},
				appear: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 }
				}
				// "accordion-down": {
				// 	from: { height: "0" },
				// 	to: { height: "var(--radix-accordion-content-height)" }
				// },
				// "accordion-up": {
				// 	from: { height: "var(--radix-accordion-content-height)" },
				// 	to: { height: "0" }
				// }
			},
			zIndex: {
				1: "1",
				2: "2"
			}
		}
	},
	variants: {
		lineClamp: ["responsive"]
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms")
		// require("tailwindcss-animate")
	]
};
