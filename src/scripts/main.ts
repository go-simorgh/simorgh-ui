import { renderWithLayout, resolveRoute } from "./router"
import { injectComponents } from "./components"

const app = document.getElementById("app")

async function loadRoute() {
	const route = location.hash.slice(2) || "home"
	const page = await resolveRoute(route)

	if (!app) throw new Error("Element with id='app' not found!")

	const fullHtml = renderWithLayout(page)
	app.innerHTML = fullHtml

	injectComponents(app)

	const slot = document.getElementById("component-slot")
	if (slot?.dataset?.script) {
		const script = document.createElement("script")
		script.type = "module"
		script.textContent = decodeURIComponent(slot.dataset.script)
		document.body.appendChild(script)
	}

	if (slot?.dataset?.style) {
		const style = document.createElement("style")
		style.textContent = decodeURIComponent(slot.dataset.style)
		document.head.appendChild(style)
	}
}

window.addEventListener("hashchange", loadRoute)
window.addEventListener("DOMContentLoaded", loadRoute)
