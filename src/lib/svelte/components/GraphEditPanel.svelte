<script lang="ts">
	import { dragAction } from '$lib/pipeline/actions/dragAction'
	import { GraphManager } from '$lib/pipeline/GraphManager.svelte'
	import Button from './ui/Button.svelte'
	import Checkbox from './ui/Checkbox.svelte'
	import Menu from './ui/Menu.svelte'
	import Spinner from './ui/Spinner.svelte'
	import nodeFactory from '$lib/pipeline/nodeFactory'
	import type { NodeType } from '$lib/types'
	import type { Node } from '$lib/pipeline/nodes/Node.svelte'
	import NodeVisual from './NodeVisual.svelte'
	import { ConnectionManager } from '$lib/pipeline/ConnectionManager.svelte'
	import type Parameter from '$lib/pipeline/Parameter.svelte'
	import Connections from './Connections.svelte'
	import Vector2 from '$lib/utils/Vector2'
	import { onDestroy, onMount } from 'svelte'
	import { MouseInput } from '$lib/pipeline/MouseInput.svelte'
	import type { Connection } from '$lib/pipeline/Connection.svelte'
	import { GraphEngine } from '$lib/pipeline/GraphEngine.svelte'
	import { KeyboardShortcutManager } from '$lib/pipeline/KeyboardShortcutManager.svelte'

	const shortcutManager = new KeyboardShortcutManager()
	const graph = new GraphManager()
	const connectionManager = new ConnectionManager(graph)
	const mouseInput = new MouseInput()
	let fps = $state(4)
	let isSingleFrame = $state(false)
	let engineRunning = $state(false)

	const engine = $derived(new GraphEngine(graph, fps))

	let currentHighestZIndex: number = 1
	let containerElement: HTMLElement | null
	let containerOffset: Vector2 = $state(new Vector2(0, 0))
	let mousePosition: Vector2 = $derived(mouseInput.position)
	let connections: Connection[] = $derived(graph.connections)
	let updateCounter = $state(0)

	const availableNodes = [
		{ id: 'ImageCacheNode', label: 'Image Cache' },
		{ id: '0', separator: true },
		{ id: 'RenderNode', label: 'Render' },
	]

	const options = [
		{ id: 'SaveLocal', label: 'Save' },
		{ id: 'LoadLocal', label: 'Load' },
		{ id: '0', separator: true },
		{ id: 'SaveJSON', label: 'Export' },
		{ id: 'LoadJSON', label: 'Import' },
		{ id: '1', separator: true },
		{ id: 'ClearGraph', label: 'Clear' },
	]

	shortcutManager.register('Ctrl+x', () => {
		handleRunSim()
	})

	shortcutManager.register('Ctrl+s', () => {
		isSingleFrame = !isSingleFrame
	})

	shortcutManager.register('Ctrl+a', () => {
		fps = fps + 0.5
	})

	shortcutManager.register('Ctrl+z', () => {
		fps = fps - 0.5
	})

	function handleWindowResize(): void {
		calculateContainerOffset()
		graph.updateConnections()
	}

	function calculateContainerOffset(): void {
		if (containerElement) {
			const rect = containerElement.getBoundingClientRect()
			containerOffset = new Vector2(rect.left, rect.top)
		}
	}

	function handleAddNode(event: string): void {
		//TODO add in checks for correct type
		const node = nodeFactory(event)
		graph.addNode(node)
	}

	function handleRemoveNode(nodeId: number): void {
		graph.removeConnectionsByNode(nodeId)
		graph.removeNode(nodeId)
	}

	function handleNodeFocus(node: Node): void {
		// Raise the z-index to ensure it is on top.
		currentHighestZIndex++
		if (node.domElement && node.domElement.parentElement)
			node.domElement.parentElement.style.zIndex = currentHighestZIndex.toString()
	}

	function handleNodeDrag(event: Event, nodeId: number): void {
		graph.updateConnections(nodeId)
		updateCounter++
	}

	function handleOutputClicked(parameter: Parameter): void {
		console.log(parameter)
		connectionManager.setOutput(parameter)
	}

	function handleInputClicked(parameter: Parameter): void {
		connectionManager.setInput(parameter)
	}

	function handleOption(option: string): void {
		switch (option) {
			case 'SaveJSON':
				exportToFile()
				break
			default:
				break
		}
	}

	function exportToFile(): void {
		try {
			const serializedGraph = graph.serialise()
			const jsonString = JSON.stringify(serializedGraph, null, 2)

			// Create a Blob and download link
			const blob = new Blob([jsonString], { type: 'application/json' })
			const url = URL.createObjectURL(blob)

			// Create a temporary link and click it
			const a = document.createElement('a')
			a.href = url
			a.download = 'willhelm.conrad'
			document.body.appendChild(a)
			a.click()

			// Clean up
			setTimeout(() => {
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			}, 0)
		} catch (error) {
			console.error('Failed to export graph:', error)
			alert('Failed to export graph to file')
		}
	}

	function handleRunSim(): void {
		if (isSingleFrame) {
			console.log('Running single frame')
			engine
				.startSingleFrame()
				.then(() => {
					console.log('Single frame completed')
				})
				.catch((error) => {
					console.error('Error in single frame:', error)
				})
		} else {
			if (engine.isRunning) {
				console.log('Stopping engine')
				engine.stop()
			} else {
				console.log('Starting engine')
				engine
					.start()
					.then(() => {
						console.log('Engine started')
					})
					.catch((error) => {
						console.error('Error starting engine:', error)
					})
			}
		}
	}
	function handleDragEnd() {}

	function handleGraphAreaClick(event: MouseEvent): void {
		if (event.target === event.currentTarget && connectionManager.selectedOutput) {
			connectionManager.setOutput(null)
		}
	}

	onMount(() => {
		containerElement = document.getElementById('graph-editor')
		if (containerElement) {
			calculateContainerOffset()
			mouseInput.init(containerElement, containerOffset)
		}

		window.addEventListener('resize', handleWindowResize)
	})

	onDestroy(() => {
		if (engine.isRunning) {
			engine.stop()
		}
		window.removeEventListener('resize', handleWindowResize)
	})
</script>

<div class="graph-editor-container">
	<div class="editor-topbar">
		<div class="topbar-left">
			<h2>Graph Editor</h2>
			<div class="editor-controls">
				<Menu
					appearance="secondary"
					items={availableNodes}
					on:select={(event) => handleAddNode(event.detail.id)}>Add Node</Menu
				>
				<Menu
					appearance="secondary"
					items={options}
					on:select={(event) => handleOption(event.detail.id)}>Options</Menu
				>
			</div>
		</div>
		<div class="simulation-controls">
			<Spinner
				bind:value={fps}
				min={0.5}
				max={15}
				step={0.5}
				label="Frame Rate"
				fitToMaxValue
				disabled={isSingleFrame}
			/>
			<div class="run-simulation-controls">
				<Button appearance="primary" on:click={handleRunSim}>Run Sim</Button>
				<Checkbox label="Single Frame" size="small" bind:checked={isSingleFrame} />
			</div>
		</div>
	</div>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
	<div class="graph-editor" id="graph-editor" onclick={handleGraphAreaClick}>
		{#if graph.nodes.length === 0}
			<p>No nodes added yet.</p>
		{:else}
			{#each graph.nodes as node}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="node-wrapper"
					data-node-id={node.id}
					use:dragAction
					onnodedrag={(event) => handleNodeDrag(event, node.id)}
					ondragend={(event) => handleDragEnd(event.detail, node.id)}
				>
					<NodeVisual
						{node}
						on:delete={(event) => handleRemoveNode(event.detail.nodeId)}
						on:focus={(event) => handleNodeFocus(event.detail.node)}
						on:outputClicked={(event) => handleOutputClicked(event.detail.parameter)}
						on:inputClicked={(event) => handleInputClicked(event.detail.parameter)}
					/>
				</div>
			{/each}
		{/if}

		<Connections
			{connections}
			selectedOutput={connectionManager.selectedOutput}
			{containerOffset}
			{mousePosition}
		/>
	</div>
</div>

<style>
	.graph-editor-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: var(--space-2);
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}

	.editor-topbar {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) var(--space-6);
		position: relative;
		z-index: 4;
	}

	.topbar-left {
		display: flex;
		gap: var(--space-6);
		align-items: center;
	}

	.simulation-controls {
		display: flex;
		gap: var(--space-6);
		align-items: center;
	}

	.run-simulation-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.graph-editor {
		display: flex;
		flex-direction: column;
		flex: 1;
		background-color: var(--color-background-default);
		border: var(--border-width-thin) solid var(--color-border-default);
		border-radius: var(--border-radius-md);
		overflow: hidden;
		overflow-y: auto;
		padding: var(--space-4);
		min-height: 0;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}

	.editor-controls {
		display: flex;
		gap: var(--space-5);
	}

	.node-wrapper {
		position: absolute;
		z-index: 2;
		box-shadow: var(--shadow-md);
	}
</style>
