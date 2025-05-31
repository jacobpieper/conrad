<script lang="ts">
	import { StorageManager } from '$lib/core/utils/StorageManager'
	import Button from './elements/Button.svelte'

	let {
		selectedKey = null,
		select = undefined,
	}: { selectedKey: string | null; select?: (event: { key: string | null }) => void } = $props()

	const storage = new StorageManager()
	let savedGraphs: { key: string; preview: string; timestamp: string }[] = $state([])
	let isLoading = $state(false)

	// Load graphs on component creation
	loadSavedGraphsList()

	function loadSavedGraphsList() {
		isLoading = true

		try {
			const keys = storage.getKeys()
			const graphKeys = keys.filter((key) => key.startsWith('graph-') || key === 'test') //TODO remove test

			savedGraphs = graphKeys.map((key) => {
				const data = storage.load(key)
				let preview = '(No data)'
				let timestamp = 'Unknown date'

				try {
					const parsedData = data ? JSON.parse(data) : {}

					const nodeCount = parsedData.nodes?.length || 0
					const edgeCount = parsedData.edges?.length || 0

					preview = `Nodes: ${nodeCount}, Edges: ${edgeCount}`
					timestamp = parsedData.timestamp || 'Unknown date'
				} catch (error) {
					console.error('Error parsing data for key', key, error)
				}

				return { key, preview, timestamp }
			})

			// Sort by key name
			savedGraphs.sort((a, b) => a.key.localeCompare(b.key))
		} catch (error) {
			console.error('Error loading saved graphs', error)
			savedGraphs = []
		} finally {
			isLoading = false
		}
	}

	function handleSelect(key: string): void {
		if (select) {
			select({ key })
		}
	}
</script>

<div class="local-storage-container">
	{#if isLoading}
		<div class="loading-indicator">Loading saved graphs...</div>
	{:else if savedGraphs.length === 0}
		<div class="no-graphs">
			<p>No saved graphs found in browser storage.</p>
			<Button appearance="secondary" on:click={loadSavedGraphsList}>Refresh</Button>
		</div>
	{:else}
		<div class="graphs-list">
			{#each savedGraphs as graph}
				<div
					class="graph-item"
					class:selected={selectedKey === graph.key}
					onclick={() => handleSelect(graph.key)}
					onkeydown={(event) => event.key === 'Enter' && handleSelect(graph.key)}
					tabindex="0"
					role="button"
				>
					<div class="name">{graph.key}</div>
					<div class="preview">{graph.preview}</div>
					<div class="timestamp">{graph.timestamp}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.loading-indicator,
	.no-graphs {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: var(--color-text-muted);
		gap: 10px;
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

	.graph-item .name {
		font-weight: 600;
		margin-bottom: 4px;
	}

	.graph-item .preview {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.graph-item .timestamp {
		font-size: 12px;
		color: var(--color-text-muted);
		margin-top: 4px;
	}
</style>
