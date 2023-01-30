import { defineConfig } from "vite";
export default defineConfig({
	resolve: {
		alias: {
			jwcjs: "../../packages/core/index.ts",
		},
	},
});
