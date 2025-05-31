<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Edge } from '$lib/core/graph/Edge'
	import type Vector2 from '$lib/utils/Vector2'

	let {
		edge,
		scale,
		pan,
		containerOffset,
		nodesVersion,
		gridSize,
		deleteEdge = undefined,
	}: {
		edge: Edge
		scale: number
		pan: Vector2
		containerOffset: { x: number; y: number }
		nodesVersion: number
		gridSize: number
		deleteEdge?: (event: { edgeId: string }) => void
	} = $props()

	// Track if component is mounted
	let mounted = false
	let startX = $state(0)
	let startY = $state(0)
	let endX = $state(0)
	let endY = $state(0)

	let isHovered = $state(false)

	let pathData = $state('')
	const scaledCell = $derived(gridSize * scale)

	let path = []

	onMount(() => {
		mounted = true
		updatePositions()

		// Set up observer to handle resizeing and repositioning
		window.addEventListener('resize', updatePositions)

		return () => {
			window.removeEventListener('resize', updatePositions)
		}
	})

	$effect(() => {
		let _nodesVersion = nodesVersion //TODO I dont get the behaviour here.
		// For some reason the reference to nodeVersion below doesn't trigger the reactivity so I need to reference it again within the effect rune.
		let _pan = pan // Turns out its the same for pan.
		// Why does the reactivity for scale and containerOffset work as intended?
		// Fuck it, this beautiful piece of code is staying in for now.
		if (mounted && (scale || pan || containerOffset || nodesVersion)) {
			updatePositions()
		}
	})

	function handleEdgeClick(event: MouseEvent): void {
		event.stopPropagation()

		if (deleteEdge) {
			deleteEdge({ edgeId: edge.id })
		}
	}

	function handleMouseEnter(): void {
		isHovered = true
	}

	function handleMouseLeave(): void {
		isHovered = false
	}

	function updatePositions(): void {
		const sourceId = `${edge.from.id}-socket`
		const targetId = `${edge.to.id}-socket`

		const sourceEl = document.getElementById(sourceId)
		const targetEl = document.getElementById(targetId)

		if (!sourceEl || !targetEl) {
			setTimeout(updatePositions, 50)
			return
		}

		const sourceRect = sourceEl.getBoundingClientRect()
		const targetRect = targetEl.getBoundingClientRect()

		startX = sourceRect.left + sourceRect.width / 2 - containerOffset.x
		startY = sourceRect.top + sourceRect.height / 2 - containerOffset.y
		endX = targetRect.left + targetRect.width / 2 - containerOffset.x
		endY = targetRect.top + targetRect.height / 2 - containerOffset.y

		pathData = generatePath()
	}

	function generatePath(): string {
		const deltaX = endX - startX
		const deltaY = endY - startY
		const halfDeltaX = deltaX / 2
		const halfDeltaY = deltaY / 2
		const halfScaledCell = scaledCell / 2

		path = [''] // Reset path

		if (deltaX - 2 <= 0 && Math.abs(deltaY) <= scaledCell) {
			// If sockets too close
			return path.join(' ')
		}

		//Start at source
		path.push(`M ${startX} ${startY}`)

		if (startX + 2 < endX) {
			// If start is left of end
			if (deltaY === 0) {
				// If sockets are equal horizontally
				createHorizontalPath(deltaX)
			} else {
				// If sockets are not equal horizontally
				createHorizontalPath(halfDeltaX - halfScaledCell)

				if (deltaY > 0) {
					// If going down
					createCurvePath('leftToBottom')
					createVerticalPath(deltaY - scaledCell)
					createCurvePath('topToRight')
				} else {
					// If going up
					createCurvePath('leftToTop')
					createVerticalPath(deltaY + scaledCell)
					createCurvePath('bottomToRight')
				}

				createHorizontalPath(halfDeltaX - halfScaledCell)
			}
		} else {
			// If start is not left of end
			if (deltaY > 0) {
				// If going down
				createCurvePath('leftToBottom')
				createVerticalPath(halfDeltaY - scaledCell)
				createCurvePath('topToLeft')
				createHorizontalPath(deltaX)
				createCurvePath('rightToBottom')
				createVerticalPath(halfDeltaY - scaledCell)
				createCurvePath('topToRight')
			} else {
				// If going up
				createCurvePath('leftToTop')
				createVerticalPath(halfDeltaY + scaledCell)
				createCurvePath('bottomToLeft')
				createHorizontalPath(deltaX)
				createCurvePath('rightToTop')
				createVerticalPath(halfDeltaY + scaledCell)
				createCurvePath('bottomToRight')
			}
		}

		return path.join(' ')

		function createHorizontalPath(length: number): void {
			path.push(`h ${length}`)
		}

		function createVerticalPath(length: number): void {
			path.push(`v ${length}`)
		}

		function createCurvePath(
			direction:
				| 'leftToTop'
				| 'leftToBottom'
				| 'topToRight'
				| 'topToLeft'
				| 'rightToTop'
				| 'rightToBottom'
				| 'bottomToLeft'
				| 'bottomToRight'
		): void {
			switch (direction) {
				case 'leftToTop':
					path.push(`q ${halfScaledCell} 0 ${halfScaledCell} -${halfScaledCell}`)
					break
				case 'leftToBottom':
					path.push(`q ${halfScaledCell} 0 ${halfScaledCell} ${halfScaledCell}`)
					break
				case 'topToRight':
					path.push(`q 0 ${halfScaledCell} ${halfScaledCell} ${halfScaledCell}`)
					break
				case 'topToLeft':
					path.push(`q 0 ${halfScaledCell} -${halfScaledCell} ${halfScaledCell}`)
					break
				case 'rightToTop':
					path.push(`q -${halfScaledCell} 0 -${halfScaledCell} -${halfScaledCell}`)
					break
				case 'rightToBottom':
					path.push(`q -${halfScaledCell} 0 -${halfScaledCell} ${halfScaledCell}`)
					break
				case 'bottomToLeft':
					path.push(`q 0 -${halfScaledCell} -${halfScaledCell} -${halfScaledCell}`)
					break
				case 'bottomToRight':
					path.push(`q 0 -${halfScaledCell} ${halfScaledCell} -${halfScaledCell}`)
					break
			}
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<svg class="edge">
	<path
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onclick={handleEdgeClick}
		d={pathData}
		fill="none"
		stroke={isHovered ? 'red' : 'pink'}
		stroke-width={isHovered ? '4' : '2'}
		stroke-linecap="round"
		stroke-linejoin="round"
		class={isHovered ? 'hovered' : ''}
	></path>
</svg>

<style>
	.edge {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: visibleStroke;
		z-index: 0;
	}

	.hovered {
		cursor: pointer;
		filter: drop-shadow(0 0 3px rgba(255, 100, 100 0.5));
	}
</style>
