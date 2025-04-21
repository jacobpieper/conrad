type StateHandler = (state: string) => void

export class HashState {
	private currentState: string = $state('')
	private onChangeCallback: StateHandler | null = null

	constructor() {
		this.handleHashChange = this.handleHashChange.bind(this)
		window.addEventListener('hashchange', this.handleHashChange)
		this.handleHashChange() // initialize
	}

	private handleHashChange() {
		const newState = window.location.hash.replace(/^#/, '')
		if (newState !== this.currentState) {
			this.currentState = newState
			this.onChangeCallback?.(this.currentState)
		}
	}

	public onChange(callback: StateHandler) {
		this.onChangeCallback = callback
	}

	public setState(state: string) {
		const url = new URL(window.location.href)
		url.hash = state
		window.location.replace(url.toString()) // Replaces history entry
	}

	public getState(): string {
		return this.currentState
	}

	public destroy() {
		window.removeEventListener('hashchange', this.handleHashChange)
		this.onChangeCallback = null
	}

	public isEditState(): boolean {
		return this.getState() === 'edit'
	}
}
