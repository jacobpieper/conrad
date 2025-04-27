import Vector2 from '$lib/utils/Vector2'

export class MouseInput {
	private element: HTMLElement | null = null
	public position: Vector2 = $state(new Vector2(0, 0))
	private offset: Vector2 = new Vector2(0, 0)
	private isMouseDown: boolean = false
	private isMouseInside: boolean = false

	init(element: HTMLElement, offset: Vector2) {
		this.element = element
		this.offset = offset

		this.setupListeners()
	}

	//~ PRIVATE METHODS
	private setupListeners(): void {
		if (!this.element) return
		this.element.addEventListener('mousemove', this.handleMouseMove)
		this.element.addEventListener('mouseenter', this.handleMouseEnter)
		this.element.addEventListener('mouseleave', this.handleMouseLeave)
		this.element.addEventListener('mousedown', this.handleMouseDown)
		window.addEventListener('mouseup', this.handleMouseUp)
	}

	private handleMouseMove = (event: MouseEvent): void => {
		this.position = new Vector2(event.clientX - this.offset.x, event.clientY - this.offset.y)
	}

	private handleMouseEnter = (): void => {
		this.isMouseInside = true
	}

	private handleMouseLeave = (): void => {
		this.isMouseInside = false
	}

	private handleMouseDown = (event: MouseEvent): void => {
		if (event.button === 0) {
			this.isMouseDown = true
		}
	}

	private handleMouseUp = (event: MouseEvent): void => {
		if (event.button === 0) {
			this.isMouseDown = false
		}
	}

	//~ PUBLIC METHODS
	public destroy(): void {
		this.element.removeEventListener('mousemove', this.handleMouseMove)
		this.element.removeEventListener('mouseenter', this.handleMouseEnter)
		this.element.removeEventListener('mouseleave', this.handleMouseLeave)
		this.element.removeEventListener('mousedown', this.handleMouseDown)
		window.removeEventListener('mouseup', this.handleMouseUp)
	}
}
