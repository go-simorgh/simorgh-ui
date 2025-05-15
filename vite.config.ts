import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import fs from "node:fs"

function generateComponentList() {
	const componentsDir = path.resolve(__dirname, "src/components")

	const files = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith(".html"))
		.map((file) => path.basename(file, ".html"))

	fs.writeFileSync(
		path.resolve(__dirname, "public/components-list.json"),
		JSON.stringify(files, null, 2),
	)
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		{
			name: "simorgh-generate-component-list",
			configureServer() {
				generateComponentList()
			},
			watchChange(id) {
				if (!id.includes("list.json")) generateComponentList()
			},
		},
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
})
