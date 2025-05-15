import layout from "../pages/layout.html?raw"
import home from "../pages/home.html?raw"
import components from "../pages/components.html?raw"

export const routes: Record<string, string> = {
	home,
	components,
}

export function renderWithLayout(pageHtml: string): string {
	const parser = new DOMParser()
	const layoutDoc = parser.parseFromString(layout, "text/html")
	const pageSlot = layoutDoc.querySelector("#page-slot")

	if (!pageSlot) {
		throw new Error("No element with id='page-slot' found in layout.html")
	}

	pageSlot.innerHTML = pageHtml

	return layoutDoc.body.innerHTML
}

export async function resolveRoute(route: string): Promise<string> {
	if (routes[route]) return routes[route]

	const match = route.match(/^component\/(.+)$/)
	if (match) {
		const name = match[1]
		try {
			const raw = await import(`../components/${name}.html?raw`)
			const previewTemplate = await import(
				"../assets/component-preview.html?raw"
			)

			const parser = new DOMParser()
			const doc = parser.parseFromString(previewTemplate.default, "text/html")
			const slot = doc.getElementById("component-slot")

			// Parse component HTML
			const compDoc = parser.parseFromString(raw.default, "text/html")
			const compScript = compDoc.querySelector("script")
			const compStyle = compDoc.querySelector("style")
			const compHTML = compDoc.body.innerHTML
				.replace(compScript?.outerHTML || "", "")
				.replace(compStyle?.outerHTML || "", "")
				.trim()

			if (slot) {
				slot.innerHTML = compHTML
				slot.setAttribute("data-component", name)

				if (compScript) {
					slot.setAttribute(
						"data-script",
						encodeURIComponent(compScript.innerHTML),
					)
				}

				if (compStyle) {
					slot.setAttribute(
						"data-style",
						encodeURIComponent(compStyle.innerHTML),
					)
				}
			}

			const section = doc.querySelector("section")
			if (section) section.setAttribute("x-data", `{ name: '<${name}>' }`)

			return doc.body.innerHTML
		} catch {
			return `<h1 class="text-red-500 font-bold text-xl">Component "${name}" not found.</h1>`
		}
	}

	return "<h1>404 - Page Not Found</h1>"
}
