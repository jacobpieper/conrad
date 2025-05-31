<script lang="ts">
	let {
		id = '',
		label = '',
		icon = undefined,
		active = false,
		onClick = undefined,
	}: {
		id: string
		label: string
		icon?: string | undefined
		active: boolean
		onClick?: (event: any) => void
	} = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events, a11y_consider_explicit_label -->
<button class="tab-header" class:active onclick={onClick} aria-selected={active} role="tab">
	{#if icon}<span class="tab-icon">{icon}</span>{/if}
	<span class="tab-label">{label}</span>
</button>

<style>
	.tab-header {
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		font-weight: 500;
		color: var(--color-text-muted);
		transition: all 0.2s ease;
	}

	.tab-header:hover {
		color: var(--color-text-default);
	}

	.tab-header.active {
		color: var(--color-text-default);
		border-bottom-color: var(--color-accent);
	}

	.tab-icon {
		margin-right: 0.5rem;
	}
</style>
