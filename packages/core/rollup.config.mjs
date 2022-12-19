import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { minify } from "rollup-plugin-esbuild";

export default defineConfig({
	input: "./index.ts",
	output: {
		file: "./dist/index.js",
	},
	plugins: [
		nodeResolve(),
		typescript({ exclude: "../starter-vite-ts/**" }),
		minify(),
	],
});
