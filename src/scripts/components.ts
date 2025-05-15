const componentMap: Record<string, string> = {}

export function injectComponents(container: HTMLElement) {
	const nodes = container.querySelectorAll("[data-component]")
	for (const node of nodes) {
		const name = node.getAttribute("data-component")
		if (name && componentMap[name]) {
			node.innerHTML = componentMap[name]
		}
	}
}
