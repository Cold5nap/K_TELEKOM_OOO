import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import path from "node:path";

export default defineConfig({
	// base: '/static/',
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// build: {
	// 	outDir: "../server/static",
	// 	emptyOutDir: true,
	// },
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:8002",
				changeOrigin: true,
				secure: false,
			},
		},
	},
	plugins: [
		vue({
			template: { transformAssetUrls },
		}),
		quasar({
			sassVariables: fileURLToPath(
				new URL("./src/quasar-variables.sass", import.meta.url)
			),
		}),
	],
});
