<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let items: any[] = [] // TODO change from any
	export let label: string = 'Select'

	const dispatch = createEventDispatcher<{ select: any }>()

	let show: boolean = false

	function toggle(): void {
		show = !show
		//
	}

	function selectItem(item: any): void {
		dispatch('select', item)
		show = false
	}
</script>

<div class="dropdown">
	<button class="dropdown-toggle" type="button" on:click={toggle}>
		{label}
	</button>

	{#if show}
		<div class="dropdown-menu" role="listbox" aria-label="Dropdown options">
			{#each items as item}
				<button class="dropdown-item" type="button" on:click={() => selectItem(item)}>
					{item}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-block;
	}
	.dropdown-toggle {
		width: 100%;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		background-color: var(--colPrimary0);
		color: var(--fg0);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}
	.dropdown-toggle:hover {
		background-color: var(--colPrimary1);
	}
	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 200px;
		font-size: 0.9rem;
		width: 100%;
		background-color: var(--bg3);
		border: 1px solid var(--colGrey2);
		margin: 0;
		padding: 0;
		z-index: 10;
	}
	.dropdown-item {
		width: 100%;
		max-width: 250px;
		padding: 0.5rem 1rem;
		background-color: var(--bg3);
		color: var(--fg0);
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border: none;
		text-align: left;
		transition: background-color 0.2s ease;
	}
	.dropdown-item:hover {
		background-color: var(--bg5);
	}
</style>
