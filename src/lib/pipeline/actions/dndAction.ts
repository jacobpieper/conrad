import interact from 'interactjs'

export function dndAction(node: HTMLElement): { destroy: () => void } {
	const draggableElement = node.querySelector('.draggable') as HTMLElement

	if (!draggableElement) {
		console.error('No draggable element found')
		return { destroy: () => {} }
	}

	interact(draggableElement).draggable({
		listeners: {
			start(event: any) {
				// Custom logic if needed
			},
			move(event: any) {
				event.preventDefault()
				event.stopPropagation()

				const target = event.target.closest('.node-wrapper')
				if (!target) return

				const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
				const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

				target.style.transform = `translate(${x}px, ${y}px)`
				target.setAttribute('data-x', x.toString())
				target.setAttribute('data-y', y.toString())
			},
			end(event: any) {
				const target = event.target.closest('.node-wrapper')
				if (!target) return

				const x = parseFloat(target.getAttribute('data-x') || '0')
				const y = parseFloat(target.getAttribute('data-y') || '0')

				target.dispatchEvent(
					new CustomEvent('dragend', {
						detail: { x, y },
						bubbles: true,
					})
				)
			},
		},
	})

	return {
		destroy() {
			interact(draggableElement).unset()
		},
	}
}
