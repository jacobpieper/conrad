import Vector2 from '$lib/utils/Vector2'
import type { DragState } from '$lib/types'

export function dragAction(node: HTMLElement): { destroy: () => void } {
	const draggableElement = node.querySelector('.draggable') as HTMLElement

	if (!draggableElement) {
		console.error('No draggable element found')
		return { destroy: () => {} }
	}

	const state: DragState = {
		isDragging: false,
		start: new Vector2(0, 0),
		offset: new Vector2(0, 0),
	}

	function handleMouseDown(event: MouseEvent): void {
		// Only start drag on left mouse button
		if (event.button !== 0) return

		// Don't start drag on buttons or form elements
		const target = event.target as HTMLElement
		if (
			target.tagName === 'BUTTON' ||
			target.tagName === 'INPUT' ||
			target.tagName === 'SELECT' ||
			!draggableElement.contains(target)
		) {
			return
		}

		event.preventDefault()

		// Get initial position
		const rect = node.getBoundingClientRect() //TODO why do we need this?
		const x = parseFloat(node.getAttribute('posX') || '0')
		const y = parseFloat(node.getAttribute('posY') || '0')

		state.isDragging = true
		state.start.set(event.clientX, event.clientY)
		state.offset.set(x, y)

		// Add global event listeners
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)

		// Add dragging class for styling
		node.classList.add('dragging')
	}

	function handleMouseMove(event: MouseEvent): void {
		if (!state.isDragging) return

		event.preventDefault()

		// Calculate new position
		const dx = event.clientX - state.start.x
		const dy = event.clientY - state.start.y

		const newX = state.offset.x + dx
		const newY = state.offset.y + dy

		// Update element position
		node.style.transform = `translate(${newX}px, ${newY}px)`
		node.setAttribute('posX', newX.toString())
		node.setAttribute('posY', newY.toString())
	}

	function handleMouseUp(event: MouseEvent): void {
		if (!state.isDragging) return

		state.isDragging = false

		// Remove global event listeners
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)

		// Remove dragging class
		node.classList.remove('dragging')

		// Dispatch custom event for position update
		const x = parseFloat(node.getAttribute('posX') || '0')
		const y = parseFloat(node.getAttribute('posY') || '0')

		node.dispatchEvent(
			new CustomEvent('dragend', {
				detail: new Vector2(x, y),
				bubbles: true,
			})
		)
	}

	// Add event listener
	draggableElement.addEventListener('mousedown', handleMouseDown)

	return {
		destroy() {
			// Clean up
			draggableElement.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		},
	}
}
