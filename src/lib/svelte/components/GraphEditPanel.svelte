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
	import { onMount } from 'svelte'

	let fps: number = $state(4)
	let isSingleFrame: boolean = $state(false)
	let currentHighestZIndex: number = 1
	let containerOffset: Vector2 = new Vector2(0, 0)

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

	const graph = new GraphManager()
	const connectionManager = new ConnectionManager(graph)

	$inspect(graph.connections)

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

	function handleOutputClicked(parameter: Parameter): void {
		console.log(parameter)
		connectionManager.setOutput(parameter)
	}

	function handleInputClicked(parameter: Parameter): void {
		connectionManager.setInput(parameter)
	}

	function handleOption(event: string): void {
		console.log(event)
	}
	function handleDragEnd() {}

	onMount(() => {
		const containerElement = document.querySelector('.graph-editor')
		if (containerElement) {
			const rect = containerElement.getBoundingClientRect()
			containerOffset.set(rect.left, rect.top)
		}
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
				<Button appearance="primary">Run Sim</Button>
				<Checkbox label="Single Frame" size="small" bind:checked={isSingleFrame} />
			</div>
		</div>
	</div>
	<div class="graph-editor">
		{#if graph.nodes.length === 0}
			<p>No nodes added yet.</p>
		{:else}
			{#each graph.nodes as node}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="node-wrapper"
					data-node-id={node.id}
					use:dragAction
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
			connections={graph.connections}
			selectedOutput={connectionManager.selectedOutput}
			{containerOffset}
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
