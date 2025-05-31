<script lang="ts">
	import { onMount } from 'svelte'
	import { Graph } from '$lib/core/graph/Graph.svelte'
	import NodeView from './NodeView.svelte'
	import Vector2 from '$lib/utils/Vector2'
	import type { Parameter } from '$lib/core/graph/Parameter'
	import type { Node } from '$lib/core/graph/nodes/Node'
	import CanvasGrid from '../components/CanvasGrid.svelte'
	import EdgeView from './EdgeView.svelte'
	import { Edge } from '$lib/core/graph/Edge'
	import { StorageManager } from '$lib/core/utils/StorageManager'
	import LoadGraphModal from '../components/LoadGraphModal.svelte'
	import Modal from '../components/elements/Modal.svelte'

	let { graph }: { graph: Graph } = $props()

	const storage = new StorageManager()

	const gridSize = 24
	let scale = $state(1)
	const minScale = 0.75
	const maxScale = 1.5

	let nodePositions: Record<string, Vector2> = $state({})

	let nodesVersion = $state(0)
	let currentHighestZIndex = 1

	// For Panning
	let pan = $state(new Vector2(0, 0))
	let isPanning = $state(false)
	let panStart = $state(new Vector2(0, 0))
	let mouseStart = $state(new Vector2(0, 0))

	// For Edge Creation
	let pendingEdge: Parameter | null = $state(null)

	// For container offset
	let canvasWrapper: HTMLElement
	let containerOffset = $state({ x: 0, y: 0 })

	let isLoadModalOpen = $state(true)

	onMount(() => {
		// Initialise node positions
		graph.nodes.forEach((node, index) => {
			nodePositions[node.id] = new Vector2(48 + index * 20, 48)
		})

		updateContainerOffset()

		window.addEventListener('resize', updateContainerOffset)
	})

	function openLoadModal(): void {
		isLoadModalOpen = true
	}

	function closeLoadModal(): void {
		isLoadModalOpen = false
	}

	function updateContainerOffset() {
		if (canvasWrapper) {
			const rect = canvasWrapper.getBoundingClientRect()
			containerOffset = {
				x: rect.left,
				y: rect.top,
			}
			console.log('Container offset updated:', containerOffset)
		}
	}

	function handleSocketClicked(event: { parameter: Parameter }): void {
		const { parameter } = event

		if (!pendingEdge) {
			// Start edge from output socket
			if (parameter.direction === 'output') {
				pendingEdge = parameter
				console.log('Starting edge from:', parameter.name)
			}
		} else {
			// Complete edge to input socket
			if (parameter.direction === 'input') {
				// We have an output -> input edge
				if (pendingEdge.direction === 'output') {
					// Check if edge already exists
					const edgeExists = graph.edges.some(
						(edge) => edge.from.id === pendingEdge!.id && edge.to.id === parameter.id
					)

					if (!edgeExists) {
						// Create new edge
						const newEdge = new Edge(pendingEdge, parameter)
						graph.addEdge(newEdge)
						console.log('Created edge:', pendingEdge.name, '->', parameter.name)
					} else {
						console.log('Edge already exists')
					}
				}
				// Reset pending edge
				pendingEdge = null
			} else {
				// New output clicked while another output is selected
				pendingEdge = parameter
				console.log('Changed edge starting point to:', parameter.name)
			}
		}
	}

	function handleCanvasClick(event: MouseEvent): void {
		// Cancel pending edge on canvas click
		if (event.target === event.currentTarget && pendingEdge) {
			console.log('Edge canceled')
			pendingEdge = null
		}
	}

	function handleNodeFocus(event: { node: Node }): void {
		const { node } = event

		currentHighestZIndex++
	}

	function handleNodeDelete(event: { nodeId: string }): void {
		const { nodeId } = event
		console.log('Delete node:', nodeId)
		graph.removeNode(nodeId)
		// Also remove the node's position
		delete nodePositions[nodeId]
		nodesVersion++
	}

	function handleNodePositionChange(event: { nodeId: string; position: Vector2 }): void {
		const { nodeId, position } = event
		// Update the node's position in out map
		nodePositions[nodeId] = position
		nodesVersion++
	}

	function handleWheel(event: WheelEvent) {
		const delta = -event.deltaY * 0.001
		const newScale = Math.max(minScale, Math.min(scale + delta, maxScale))

		if (!event.currentTarget) return
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
		const mouseX = event.clientX - rect.left
		const mouseY = event.clientY - rect.top

		const worldX = (mouseX - pan.x) / scale
		const worldY = (mouseY - pan.y) / scale

		pan.x = mouseX - worldX * newScale
		pan.y = mouseY - worldY * newScale

		scale = newScale
		event.preventDefault()
	}

	function handleMouseDown(event: MouseEvent) {
		if (event.button === 1 || event.shiftKey) {
			isPanning = true
			mouseStart = new Vector2(event.clientX, event.clientY)
			panStart.set(pan.x, pan.y)
			event.preventDefault()
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (isPanning) {
			pan = new Vector2(
				panStart.x + (event.clientX - mouseStart.x),
				panStart.y + (event.clientY - mouseStart.y)
			)
		}
	}

	function handleMouseUp() {
		isPanning = false
	}

	function handleEdgeDelete(event: { edgeId: string }): void {
		graph.removeEdge(event.edgeId)
	}

	function serialise(): string {
		try {
			const graphData = JSON.parse(graph.serialise())

			const nodesWithPositions = graphData.nodes.map((node) => {
				const position = nodePositions[node.id] || { x: 0, y: 0 }

				return {
					...node,
					position: {
						x: position.x,
						y: position.y,
					},
				}
			})

			const result = {
				...graphData,
				nodes: nodesWithPositions,
			}

			return JSON.stringify(result, null, 2)
		} catch (error) {
			console.error('Error serialising graph:', error)
			return '{}'
		}
	}

	function saveToStorage(): void {
		const data = serialise()
		storage.save('test', data)
	}

	function loadFromStorage(): void {
		try {
			const data = storage.load('test')
			if (!data) return
			const parsedData = JSON.parse(data)

			if (parsedData.nodes) {
				parsedData.nodes.forEach((node: any) => {
					if (node.id && node.position) {
						nodePositions[node.id] = new Vector2(node.position.x, node.position.y)
						graph.addNode(node.type)
					}
				})
			}

			console.log('Graph loaded from storage')
			nodesVersion++ // Update the view
		} catch (error) {
			console.error('Error loading graph from storage:', error)
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div
	class="canvas-wrapper"
	bind:this={canvasWrapper}
	onwheel={handleWheel}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onclick={handleCanvasClick}
>
	<!--~ CANVAS GRID -->
	<CanvasGrid {gridSize} bind:scale bind:pan />

	<button class="save-button" onclick={saveToStorage}> Save Graph </button>
	<button class="save-button" onclick={loadFromStorage}> Save Graph </button>

	<!--~ TEMP EDGE -->

	<!--~ EDGES -->
	{#each graph.edges as edge}
		<EdgeView
			{edge}
			{scale}
			{pan}
			{containerOffset}
			{nodesVersion}
			{gridSize}
			deleteEdge={handleEdgeDelete}
		/>
	{/each}

	<!--~ NODES -->

	{#each graph.nodes as node (node.id)}
		<NodeView
			{node}
			initialPosition={nodePositions[node.id] || new Vector2(24, 24)}
			{scale}
			{gridSize}
			{pan}
			socketClicked={handleSocketClicked}
			focus={handleNodeFocus}
			deleteNode={handleNodeDelete}
			positionChanged={handleNodePositionChange}
		/>
	{/each}
</div>

<LoadGraphModal isOpen={isLoadModalOpen} closeModal={closeLoadModal} />

<style>
	.canvas-wrapper {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
		background-color: var(--color-background-default);
	}
</style>
