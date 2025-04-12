<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { dragAction } from '$lib/pipeline/actions/dragAction'
	import type { Connection, NodeParameter, NodeType, PortReference } from '$lib/types'
	import { connectionsStore, containerOffsetStore, pipelineStore } from '$lib/svelte/stores/stores'
	import {
		removeConnections,
		addConnection,
		clearConnections,
		addToPipeline,
		removeFromPipeline,
		clearPipeline,
	} from '$lib/pipeline/utils/storeUtils'
	import Vector2 from '$lib/utils/Vector2'
	import Node from '$lib/svelte/components/Node.svelte'
	import Connections from '$lib/svelte/components/Connections.svelte'
	import nodeFactory from '$lib/pipeline/nodeFactory'
	import PipelineEngine from '$lib/pipeline/PipelineEngine'
	import Dropdown from '$lib/svelte/components/Dropdown.svelte'

	let fps = 7.5
	let isSingleFrame = false
	let engine: PipelineEngine | null
	let isSimRunning = false

	let tempSelectedPort: PortReference | null

	const availableNodes: NodeType[] = ['ImageCacheNode', 'RenderNode']

	function handleAddNode(nodeType: NodeType): void {
		const nodeInstance = nodeFactory(nodeType)
		addToPipeline(nodeInstance)
	}

	function handleDragEnd(position: Vector2, nodeId: number): void {
		updatePosition(position, nodeId)
	}

	function updatePosition(position: Vector2, nodeId: number): void {
		$pipelineStore = $pipelineStore.map((node) => {
			if (node.id === nodeId) {
				node.position = position
				return node
			}
			return node
		})
	}

	function handleRemoveNode(nodeId: number): void {
		removeFromPipeline(nodeId)
		removeConnections(nodeId)
	}

	function getPort(portReference: PortReference): NodeParameter {
		const { node, parameterId } = portReference

		const port = node.parameters.find((item) => item.id === parameterId)
		if (!port) {
			throw new Error(`Port with id ${parameterId} not found in node ${node.id}`)
		}
		return port
	}

	function handlePortClicked(portReference: PortReference): void {
		const port = getPort(portReference)

		// If output, set as selected port
		if (port.role === 'output') {
			tempSelectedPort = portReference

			// If input, and output already selected
		} else if (port.role === 'input' && tempSelectedPort) {
			const outputPort = getPort(tempSelectedPort)

			// If port types are same, create connection.
			if (port.type === outputPort.type) {
				addConnection(tempSelectedPort, portReference)
			}

			tempSelectedPort = null
		}
	}

	function formatFps(value: number): string {
		return value.toFixed(1)
	}

	function handleFpsInput(event: Event): void {
		const input = event.target as HTMLInputElement
		fps = parseFloat(input.value)
		input.value = formatFps(fps)
	}

	function handleClear(): void {
		clearPipeline()
		clearConnections()
	}

	async function toggleSimulation(): Promise<void> {
		if (isSimRunning) {
			engine?.stop()
			engine = null
			isSimRunning = false
		} else {
			try {
				// Get current connections from store
				let currentConnections: Connection[] = []
				engine = new PipelineEngine(pipeline, $connectionsStore, fps)
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
			$containerOffsetStore = new Vector2(rect.left, rect.top)
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			//window.removeEventListener('mousemove', handleMouseMove)
			//window.removeEventListener('click', handleMouseClick)
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
		<button type="button" on:click={handleClear}>Clear</button>
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
		{#if $pipelineStore.length === 0}
			<p>No nodes added yet.</p>
		{:else}
			{#each $pipelineStore as node (node.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="node-wrapper"
					data-node-id={node.id}
					style="transform: translate({node.position.x}px, {node.position.y}px)"
					use:dragAction
					on:dragend={(event) => handleDragEnd(event.detail, node.id)}
				>
					<Node
						{node}
						on:delete={(event) => handleRemoveNode(event.detail.nodeId)}
						on:portClicked={(event) => handlePortClicked(event.detail)}
					/>
				</div>
			{/each}
		{/if}

		<Connections />
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
</style>
