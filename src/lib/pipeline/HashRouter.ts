type RouteHandler = (route: string) => void

export class HashRouter {
	private currentRoute: string = ''
	private onChangeCallback: RouteHandler | null = null

	constructor() {
		this.handleHashChange = this.handleHashChange.bind(this)
		window.addEventListener('hashchange', this.handleHashChange)

		// Initialize with current hash
		this.handleHashChange()
	}

	private handleHashChange() {
		const newRoute = window.location.hash.replace(/^#/, '') || ''
		if (newRoute !== this.currentRoute) {
			this.currentRoute = newRoute
			if (this.onChangeCallback) {
				this.onChangeCallback(this.currentRoute)
			}
		}
	}

	public onChange(callback: RouteHandler) {
		this.onChangeCallback = callback
	}

	public navigate(route: string) {
		if (route !== this.currentRoute) {
			history.pushState(null, '', `#${route}`)
			this.handleHashChange()
		}
	}

	public replace(route: string) {
		history.replaceState(null, '', `#${route}`)
		this.handleHashChange()
	}

	public getRoute(): string {
		return this.currentRoute
	}

	public destroy() {
		window.removeEventListener('hashchange', this.handleHashChange)
		this.onChangeCallback = null
	}
}
