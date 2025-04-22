type ShortcutHandler = (event: KeyboardEvent) => void

export class KeyboardShortcutManager {
	private shortcuts: Map<string, ShortcutHandler> = new Map()

	constructor() {
		this.handleKeydown = this.handleKeydown.bind(this)
		window.addEventListener('keydown', this.handleKeydown)
	}

	//~ PRIVATE METHODS
	private normaliseKeyCombo(event: KeyboardEvent): string {
		const keys = []

		if (event.ctrlKey) keys.push('ctrl')
		if (event.altKey) keys.push('alt')
		if (event.shiftKey) keys.push('shift')
		if (event.metaKey) keys.push('meta')

		keys.push(event.key.toLowerCase())

		return keys.join('+')
	}

	private handleKeydown(event: KeyboardEvent): void {
		event.preventDefault()
		if (
			event.key === 'Control' ||
			event.key === 'Alt' ||
			event.key === 'Shift' ||
			event.key === 'Meta'
		)
			return

		const keyCombo = this.normaliseKeyCombo(event)

		const handler = this.shortcuts.get(keyCombo)
		if (handler) {
			event.preventDefault()
			handler(event)
		}
	}

	//~ PUBLIC METHODS
	public register(keys: string, handler: ShortcutHandler): void {
		this.shortcuts.set(keys.toLowerCase(), handler)
	}

	public unregister(keys: string): void {
		this.shortcuts.delete(keys.toLowerCase())
	}

	public destroy() {
		window.removeEventListener('keydown', this.handleKeydown)
		this.shortcuts.clear()
	}
}
