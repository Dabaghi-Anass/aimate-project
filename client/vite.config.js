import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"#minpath": path.resolve(
				__dirname,
				"node_modules/vfile/lib/minpath.browser"
			),
			"#minproc": path.resolve(
				__dirname,
				"node_modules/vfile/lib/minproc.browser"
			),
			"#minurl": path.resolve(
				__dirname,
				"node_modules/vfile/lib/minurl.browser"
			),
			"./runtimeConfig": "./runtimeConfig.browser",
		},
	},
	define: {
		"process.env": {},
	},
});
