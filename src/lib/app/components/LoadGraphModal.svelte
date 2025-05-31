<script lang="ts">
	import { onMount } from 'svelte'
	import Modal from './elements/Modal.svelte'
	import Button from './elements/Button.svelte'
	import Tab from './elements/Tab.svelte'
	import TabGroup from './elements/TabGroup.svelte'
	import { StorageManager } from '$lib/core/utils/StorageManager'
	import LoadBuiltInGraph from './LoadBuiltInGraph.svelte'
	import LoadLocalGraph from './LoadLocalGraph.svelte'

	let {
		isOpen = false,
		closeModal = undefined,
		loadGraph = undefined,
	}: {
		isOpen: boolean
		closeModal?: (event: { modalId: string }) => void
		loadGraph?: (event: { graphKey: string; data: string }) => void
	} = $props()

	const storage = new StorageManager()
	let modalId: string = 'graph-test'

	// Tab management
	type TabType = 'built-in' | 'browser' | 'file'
	let activeTab: TabType = $state('browser')

	// Selection state for each tab
	let selectedKey: string | null = $state(null)
	let selectedBuiltInId: string | null = $state(null)

	$effect(() => {
		if (!isOpen) {
			selectedKey = null
			selectedBuiltInId = null
		}
	})

	function setActiveTab(tab: TabType): void {
		activeTab = tab
	}

	function handleStorageSelect(event: CustomEvent<{ key: string }>) {
		selectedKey = event.detail.key
	}

	function handleBuiltInSelect(event: CustomEvent<{ id: string }>) {
		selectedBuiltInId = event.detail.id
	}

	//TODO Move these to their own JSON files
	function getBuiltInGraphData(id: string): string {
		// These would be your predefined graphs
		switch (id) {
			case 'empty':
				return JSON.stringify({
					name: 'Empty Graph',
					nodes: [],
					edges: [],
					timestamp: new Date().toISOString(),
				})
			case 'simple':
				return JSON.stringify({
					name: 'Simple Example',
					nodes: [
						{ id: 'node1', type: 'ImageCacheNode', position: { x: 100, y: 100 } },
						{ id: 'node2', type: 'RenderNode', position: { x: 300, y: 100 } },
					],
					edges: [],
					timestamp: new Date().toISOString(),
				})
			case 'advanced':
				return JSON.stringify({
					name: 'Advanced Example',
					nodes: [
						{ id: 'node1', type: 'ImageCacheNode', position: { x: 100, y: 100 } },
						{ id: 'node2', type: 'RenderNode', position: { x: 300, y: 100 } },
						{ id: 'node3', type: 'ImageCacheNode', position: { x: 100, y: 250 } },
						{ id: 'node4', type: 'RenderNode', position: { x: 300, y: 250 } },
					],
					edges: [],
					timestamp: new Date().toISOString(),
				})
			default:
				return JSON.stringify({ name: 'Empty Graph', nodes: [], edges: [] })
		}
	}

	function handleLoadClick() {
		if (activeTab === 'browser' && selectedKey) {
			const data = storage.load(selectedKey)
			if (loadGraph && data) {
				loadGraph({ graphKey: selectedKey, data })
			}
		} else if (activeTab === 'built-in' && selectedBuiltInId) {
			const data = getBuiltInGraphData(selectedBuiltInId)
			if (loadGraph) {
				loadGraph({ graphKey: selectedBuiltInId, data })
			}
		}

		if (closeModal) {
			closeModal({ modalId })
		}
	}

	function isLoadButtonEnabled(): boolean {
		if (activeTab === 'browser') {
			return !!selectedKey
		} else if (activeTab === 'built-in') {
			return !!selectedBuiltInId
		}
		return false
	}
</script>

<Modal {isOpen} title="Load Graph" closeModal={() => closeModal?.({ modalId })}>
	{#snippet modalBody()}
		<div class="load-graph-container">
			<TabGroup activeTab={true} onTabChange="0">
				{#snippet tabHeaders()}
					<Tab
						id="built-in"
						label="Built In"
						active={activeTab === 'built-in'}
						onClick={() => setActiveTab('built-in')}
					/>
					<Tab
						id="browser"
						label="Browser Storage"
						active={activeTab === 'browser'}
						onClick={() => setActiveTab('browser')}
					/>
				{/snippet}
				{#snippet tabBody()}
					<div class="tab-content">
						{#if activeTab === 'built-in'}
							Hello
						{/if}
					</div>
				{/snippet}
			</TabGroup>
		</div>
	{/snippet}

	{#snippet modalFooter()}
		<Button appearance="secondary" on:click={() => closeModal?.({ modalId })}>Cancel</Button>
		<Button appearance="primary" disabled={!selectedKey} on:click={handleLoadClick}>Load</Button>
	{/snippet}
</Modal>

<style>
	.load-graph-container {
		min-height: 300px;
	}

	.loading-indicator,
	.no-graphs {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: var(--color-text-muted);
	}

	.search-container {
		margin-bottom: 16px;
	}

	.search-input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--color-border-subtle);
		border-radius: 4px;
		font-size: 14px;
	}

	.graphs-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: 400px;
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

	.graph-item-preview {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.graph-item-date {
		font-size: 12px;
		color: var(--color-text-muted);
		margin-top: 4px;
	}
</style>
