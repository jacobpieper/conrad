<script lang="ts">
	import Menu from './elements/Menu.svelte'
	import GraphView from '../views/GraphView.svelte'
	import { Graph } from '$lib/core/graph/Graph.svelte'
	import type { NodeType } from '$lib/core/graph/nodes/Node'
	import Button from './elements/Button.svelte'

	const availableNodes = [
		{ id: 'ImageCacheNode', label: 'Image Cache' },
		{ id: '0', separator: true },
		{ id: 'RenderNode', label: 'Render' },
	]

	const options = [{ id: 'Option 1', label: 'Option One' }]

	const graph = new Graph('New Graph')

	function handleAddNode(nodeType: string): void {
		if (nodeType === '0') return // skip separators

		// Add the node to the graph
		graph.addNode(nodeType as NodeType)
		console.log(`Added a new node of type: ${nodeType}`)
	}

	function handleOption(option: string): void {
		switch (option) {
			case 'Option 1':
				console.log('wow')
		}
	}

	function handleRunSim(): void {
		console.log('running')
		graph.getProcessingOrder()
		graph.start()
	}

	function handleSerialise(): void {
		const rr = graph.serialise()
		console.log(rr)
	}
</script>

<div class="graph-draw">
	<div class="top-bar">
		<h2>Graph Editor</h2>
		<div class="controls">
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
			<Button appearance="primary" on:click={handleRunSim}>Run Sim</Button>
		</div>
	</div>
	<GraphView {graph} />
</div>

<style>
</style>
