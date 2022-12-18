import { defineConfig } from "vite";
export default defineConfig({
	// 把 CSS 移动到 dist 目录
	build: {
		lib: {
			entry: ["src/index.ts"],
			formats: ["es"],
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: [""],
		},
	},
});
