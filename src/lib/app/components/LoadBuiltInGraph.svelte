<script lang="ts">
	let {
		selectedId = '',
		select = undefined,
	}: { selectedId: string; select?: (event: { id: string }) => void } = $props()

	// Define built-in graphs
	const builtInGraphs = [
		{ id: 'empty', name: 'Empty Graph', description: 'Start with a blank graph' },
		{ id: 'simple', name: 'Simple Graph', description: 'A basic graph with a few nodes' },
		{
			id: 'advanced',
			name: 'Advanced Graph',
			description: 'A complex graph showing various features',
		},
	]

	function handleSelect(id: string): void {
		if (select) {
			select({ id: id === selectedId ? '' : id })
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events, a11y_consider_explicit_label -->
<div class="built-in-container">
	<div class="graphs-list">
		{#each builtInGraphs as graph}
			<div
				class="graph-item"
				class:selected={selectedId === graph.id}
				onclick={() => handleSelect(graph.id)}
				onkeydown={(event) => event.key === 'Enter' && handleSelect(graph.id)}
				tabindex="0"
				role="button"
			>
				<div class="graph-item-name">{graph.name}</div>
				<div class="graph-item-description">{graph.description}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.built-in-container {
		padding: 1rem 0;
	}

	.graphs-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: 300px;
		overflow-y: auto;
	}

	.graph-item {
		padding: 12px;
		border: 1px solid var(--color-border-subtle);
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.graph-item:hover {
		background-color: var(--color-background-hover);
	}

	.graph-item.selected {
		border-color: var(--color-border-focus);
		background-color: var(--color-background-selected);
	}

	.graph-item-name {
		font-weight: 600;
		margin-bottom: 4px;
	}

	.graph-item-description {
		font-size: 14px;
		color: var(--color-text-muted);
	}
</style>
