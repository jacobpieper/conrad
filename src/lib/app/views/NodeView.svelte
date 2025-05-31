<script lang="ts">
	import { Node } from '$lib/core/graph/nodes/Node'
	import type { Parameter } from '$lib/core/graph/Parameter'
	import Vector2 from '$lib/utils/Vector2'
	import ParameterView from './ParameterView.svelte'

	let {
		node,
		initialPosition = new Vector2(48, 48),
		socketClicked = undefined,
		focus = undefined,
		deleteNode = undefined,
		positionChanged = undefined,
		gridSize,
		scale,
		pan,
	}: {
		node: Node
		initialPosition: Vector2
		socketClicked?: (event: { parameter: Parameter }) => void
		focus?: (event: { node: Node }) => void
		deleteNode?: (event: { nodeId: string }) => void
		positionChanged?: (event: { nodeId: string; position: Vector2 }) => void
		gridSize: number
		scale: number
		pan: Vector2
	} = $props()

	const NODEWIDTHGRID = 8

	let position = $state(initialPosition) // unscaled

	$effect(() => {
		position = initialPosition
	})

	let isDragging = $state(false)
	let dragStartMousePos = $state(new Vector2(0, 0))
	let dragStartNodePos = $state(new Vector2(0, 0))

	let baseNodeWidth = $derived(gridSize * NODEWIDTHGRID)
	let fontSize = $derived(Math.max(12 * scale, 8))

	// Calculate screen coordinates from world coordinates
	let screenX = $derived(position.x * scale + pan.x)
	let screenY = $derived(position.y * scale + pan.y)

	function handleSocketClick(event: { parameter: Parameter; event: Event }): void {
		if (socketClicked) {
			socketClicked({ parameter: event.parameter })
		}
	}

	function handleNodeClick(): void {
		if (focus) {
			focus({ node })
		}
	}

	function handleDeleteClick(): void {
		if (deleteNode) {
			deleteNode({ nodeId: node.id })
		}
	}

	//~ EVENTS
	function handleHeaderMouseDown(event: MouseEvent): void {
		if (event.button !== 0) return

		event.stopPropagation()
		event.preventDefault()

		isDragging = true
		dragStartMousePos = new Vector2(event.clientX, event.clientY)
		dragStartNodePos = new Vector2(position.x, position.y)

		window.addEventListener('mousemove', handleGlobalMouseMove)
		window.addEventListener('mouseup', handleGlobalMouseUp)
	}

	function handleGlobalMouseMove(event: MouseEvent): void {
		if (!isDragging) return

		// Calculate mouse movement in screen pixels
		const screenDeltaX = event.clientX - dragStartMousePos.x
		const screenDeltaY = event.clientY - dragStartMousePos.y

		// Convert to world coordinates by dividing by scale
		const worldDeltaX = screenDeltaX / scale
		const worldDeltaY = screenDeltaY / scale

		// Calculate new position in world coordinates
		const newX = dragStartNodePos.x + worldDeltaX
		const newY = dragStartNodePos.y + worldDeltaY

		// Apply grid snapping
		const snappedX = Math.round(newX / gridSize) * gridSize
		const snappedY = Math.round(newY / gridSize) * gridSize

		const newPos = new Vector2(snappedX, snappedY)

		position = newPos

		// Notify parent
		if (positionChanged) {
			positionChanged({ nodeId: node.id, position: newPos })
		}
	}

	function handleGlobalMouseUp() {
		isDragging = false
		window.removeEventListener('mousemove', handleGlobalMouseMove)
		window.removeEventListener('mouseup', handleGlobalMouseUp)
	}

	//~ CUSTOM EVENTS
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
<div
	class="node"
	id={node.id}
	style="transform: translate({screenX}px, {screenY}px); width: {baseNodeWidth * scale}px;"
	onclick={handleNodeClick}
>
	<!--~ NODE HEADER -->
	<div
		class="node-header draggable"
		style="height: {(gridSize - 1) * scale}px; --font-size: {fontSize}px; "
		onmousedown={handleHeaderMouseDown}
	>
		<span style="font-size: {14 * scale}px;">{node.name}</span>
		<button type="button" class="delete-button" onclick={handleDeleteClick}>x</button>
	</div>

	<!--~ NODE BODY -->
	<div class="node-body">
		{#each node.parameters as parameter}
			<div
				class="parameter-wrapper"
				style="height: {gridSize * scale}px; --font-size: {fontSize}px;"
			>
				<ParameterView
					{parameter}
					{scale}
					inputClick={handleSocketClick}
					outputClick={handleSocketClick}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.node {
		position: absolute;
		background-color: var(--color-background-card);
		border: var(--border-width-thin) solid var(--color-border-default);
		border-radius: var(--border-radius-md);
		color: var(--color-text-primary);
		overflow: hidden;
		user-select: none;
	}

	.node-header {
		cursor: grab;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 var(--space-3);
	}

	.delete-button {
		background: transparent;
		border: none;
		color: var(--color-button-danger-text);
		cursor: pointer;
	}
	.delete-button:hover {
		color: var(--color-button-danger-hover);
	}

	.parameter-wrapper {
		border-top: 1px solid var(--color-border-default);
		display: flex;
		justify-content: center;
	}
</style>
