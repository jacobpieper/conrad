<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	import { dndAction } from '$lib/pipeline/actions/dndAction'
	import type {
		CanvasObject,
		Connection,
		NodeInstance,
		NodeParameter,
		NodeType,
		PortReference,
	} from '$lib/types'
	import canvasesStore from '$lib/svelte/stores/canvasStore'
	import Vector2 from '$lib/utils/Vector2'
	import Node from '$lib/svelte/components/Node.svelte'
	import nodeFactory from '$lib/pipeline/nodeFactory'
	import PipelineEngine from '$lib/pipeline/PipelineEngine'
	import Dropdown from './Dropdown.svelte'

	let canvases: CanvasObject[] = []
	let pipeline: NodeInstance[] = []
	let connections: Connection[] = []
	const availableNodes: NodeType[] = ['ImageCacheNode']
	let selectedPortReference: PortReference | null
	let mousePosition = new Vector2(0, 0)
	let containerOffset = new Vector2(0, 0)
	let fps = 7.5
	let isSingleFrame = false
	let engine: PipelineEngine | null
	let isSimRunning = false

	const unsubscribeCanvases = canvasesStore.subscribe((value) => {
		canvases = value
	})

	function handleAddNode(nodeType: NodeType): void {
		const nodeInstance = nodeFactory(nodeType)
		pipeline = [...pipeline, nodeInstance]
	}

	function handleUpdatePosition(nodeId: number, position: Vector2): void {
		pipeline = pipeline.map((node) => {
			if (node.id === nodeId) {
				node.position = position
				return node
			}
			return node
		})
	}

	function handleMouseMove(event: MouseEvent): void {
		const absoluteMousePosition = new Vector2(event.clientX, event.clientY)
		mousePosition = getRelativePosition(absoluteMousePosition)
	}

	function handleMouseClick(): void {
		if (selectedPortReference) {
			selectedPortReference = null
		}
	}

	function handleRemoveNode(nodeId: number): void {
		// Remove node from the pipeline
		pipeline = pipeline.filter((node) => node.id !== nodeId)

		// Remove connections associated with the node
		connections = connections.filter((connection) => {
			connection.output.node.id !== nodeId && connection.input.node.id !== nodeId
		})
	}

	function handlePortClicked(portReference: PortReference): void {
		const port = getParameter(portReference)

		// If output, set as selected output
		if (port.role === 'output') {
			selectedPortReference = portReference

			// If input, and output is already selected
		} else if (port.role === 'input' && selectedPortReference) {
			const outputPort = getParameter(selectedPortReference)

			// If port types are same, create connection
			if (port.type === outputPort.type) {
				connections = [
					...connections,
					{
						output: selectedPortReference,
						input: portReference,
					},
				]
			}

			selectedPortReference = null
		}
	}

	function getParameter(portReference: PortReference): NodeParameter {
		const { node, parameterId } = portReference
		const parameter = node.parameters.find((param: NodeParameter) => param.id === parameterId)
		if (!parameter) {
			throw new Error(`Parameter with id ${parameterId} not found in node ${node.id}`)
		}
		return parameter
	}

	function getPortElement(node: NodeInstance, portId: number): HTMLElement {
		const portElement = document.getElementById(`port-${node.id}-${portId}`)
		if (!portElement) {
			throw new Error(`Port element with id port-${node.id}-${portId} not found`)
		}
		return portElement
	}

	function getRelativePosition(absolutePosition: Vector2): Vector2 {
		return absolutePosition.subtract(containerOffset)
	}

	function getPortPosition(node: NodeInstance, portId: number): Vector2 {
		const portElement = getPortElement(node, portId) as HTMLElement

		const rect = portElement.getBoundingClientRect()
		return new Vector2(
			rect.left + rect.width / 2 - containerOffset.x,
			rect.top + rect.height / 2 - containerOffset.y
		)
	}

	function formatFps(value: number): string {
		return value.toFixed(1)
	}

	function handleFpsInput(event: Event): void {
		const input = event.target as HTMLInputElement
		fps = parseFloat(input.value)
		input.value = formatFps(fps)
	}

	async function toggleSimulation(): Promise<void> {
		if (isSimRunning) {
			engine?.stop()
			engine = null
			isSimRunning = false
		} else {
			try {
				engine = new PipelineEngine(pipeline, connections, fps)
				if (isSingleFrame) {
					await engine.startSingleFrame()
					isSimRunning = false
				} else {
					await engine.start()
					isSimRunning = true
				}
			} catch (error) {
				console.error('Error processing pipeline:', error)
				isSimRunning = false
			}
		}
	}

	onMount(() => {
		const container = document.querySelector('.editor-zone')
		if (container) {
			const rect = container.getBoundingClientRect()
			containerOffset = new Vector2(rect.left, rect.top)
		}
	})

	onDestroy(() => {
		unsubscribeCanvases()
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('click', handleMouseClick)
		}
	})
</script>

<div class="editor">
	<h2>Pipeline Editor</h2>
	<div class="editor-controls">
		<Dropdown
			items={availableNodes}
			label="Add Node"
			on:select={(event) => handleAddNode(event.detail)}
		/>
		<button type="button">Clear</button>
		<button type="button">Save</button>
		<button type="button">Load</button>
		<button type="button" on:click={toggleSimulation} class={isSimRunning ? 'stop' : ''}
			>{isSimRunning ? 'Stop Sim' : 'Run Sim'}</button
		>
		<div class="sim-controls">
			<input
				type="number"
				value={formatFps(fps)}
				on:input={handleFpsInput}
				min="0.5"
				max="15"
				step="0.5"
				disabled={isSingleFrame}
				class="fps-input"
			/>
			<label class="single-frame">
				<input type="checkbox" bind:checked={isSingleFrame} />
				<span>Single Frame</span>
			</label>
		</div>
	</div>

	<div class="editor-zone">
		{#if pipeline.length === 0}
			<p>No nodes added yet.</p>
		{:else}
			{#each pipeline as node (node.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="node-wrapper"
					data-node-id={node.id}
					style="transform: translate({node.position.x}px, {node.position.y}px)"
					use:dndAction
					on:dragend={(event: Event) => {
						if (!event) {
							throw new Error('Event is null')
						}
						const target = event.target as HTMLElement
						if (!target) {
							throw new Error('Event target is null')
						}
						const newX = parseFloat(target.getAttribute('data-x') || '0')
						const newY = parseFloat(target.getAttribute('data-y') || '0')
						handleUpdatePosition(node.id, new Vector2(newX, newY))
					}}
				>
					<Node
						{node}
						on:portClick={(event) => handlePortClicked(event.detail)}
						on:delete={(event) => handleRemoveNode(event.detail.nodeId)}
					/>
				</div>
			{/each}
		{/if}

		{#if selectedPortReference}
			<svg class="connection-line">
				<line
					x1={getRelativePosition(getParameter(selectedPortReference).portPosition).x}
					y1={getRelativePosition(getParameter(selectedPortReference).portPosition).y}
					x2={mousePosition.x}
					y2={mousePosition.y}
				/>
			</svg>
		{/if}
		{#each connections as connection}
			{#if connection.input.node && connection.output.node}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<svg class="connection-line-final">
					<line
						x1={getPortPosition(connection.output.node, connection.output.parameterId).x}
						y1={getPortPosition(connection.output.node, connection.output.parameterId).y}
						x2={getPortPosition(connection.input.node, connection.input.parameterId).x}
						y2={getPortPosition(connection.input.node, connection.input.parameterId).y}
					/>
				</svg>
			{/if}
		{/each}
	</div>
</div>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		padding: 1rem;
	}
	.editor-controls {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.editor-controls button {
		padding: 0.5rem;
		background-color: var(--colPrimary0);
		font-size: 1rem;
		color: var(--fg0);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
		max-width: 200px;
	}
	.editor-controls button:hover {
		background-color: var(--colPrimary0);
	}
	.editor-controls button.stop {
		background-color: var(--colRed2);
	}
	.editor-controls button.stop:hover {
		background-color: var(--colRed3);
	}
	.fps-input {
		width: 60px;
		padding: 0.5rem;
		background-color: var(--colGrey5);
		color: var(--fg0);
		border: 1px solid var(--colGrey2);
		border-radius: 4px;
	}
	.fps-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--bg0);
		border-color: var(--colGrey3);
	}
	.sim-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.single-frame {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--fg0);
		font-size: 0.9rem;
	}
	.single-frame input[type='checkbox'] {
		width: 14px;
		height: 14px;
	}
	.editor-zone {
		flex: 1;
		position: relative;
		background-color: var(--colGrey0);
		border: 1px dashed var(--colGrey2);
		border-radius: 4px;
		padding: 0.5rem;
		overflow: hidden;
	}
	.node-wrapper {
		position: absolute;
		z-index: 2;
	}
	.connection-line,
	.connection-line-final {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}
	.connection-line line {
		stroke: var(--colGrey9);
		stroke-width: 2;
		stroke-dasharray: 8, 4;
		stroke-linecap: round;
	}

	.connection-line-final line {
		stroke: #fff;
		stroke-width: 2;
		stroke-linecap: round;
	}
</style>
