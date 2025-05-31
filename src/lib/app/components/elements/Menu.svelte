<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import Button from './Button.svelte'

	export let items: MenuItem[] = []
	export let icon: string | null = null
	export let position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'bottom-left'
	export let width: string = 'auto'
	export let triggerClass: string = ''
	export let disabled: boolean = false
	export let appearance: 'primary' | 'secondary' | 'subtle' | 'danger' | 'link' = 'secondary'
	export let size: 'small' | 'medium' | 'large' = 'medium'

	// Define the MenuItem interface
	interface MenuItem {
		id?: string
		label?: string
		disabled?: boolean
		separator?: boolean
		heading?: string
		children?: MenuItem[]
	}

	const dispatch = createEventDispatcher<{ select: { id: string; item: MenuItem } }>()

	let menuElement: HTMLDivElement
	let menuOpen = false
	let activeSubmenu: string | null = null

	function toggle(event: MouseEvent): void {
		if (disabled) return
		event.stopPropagation()
		menuOpen = !menuOpen
	}

	function selectItem(event: MouseEvent, item: MenuItem): void {
		event.stopPropagation()

		if (item.disabled) return

		if (item.children && item.children.length > 0) {
			activeSubmenu = activeSubmenu === item.id ? null : item.id
			return
		}

		dispatch('select', { id: item.id, item })
		menuOpen = false
		activeSubmenu = null
	}

	function handleClickOutside(event: MouseEvent): void {
		if (menuOpen && menuElement && !menuElement.contains(event.target as Node)) {
			menuOpen = false
			activeSubmenu = null
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	})
</script>

<div class="menu-container {triggerClass}" bind:this={menuElement}>
	<div class="menu-trigger-wrapper">
		<Button on:click={toggle} {disabled} {appearance} {size} {icon}>
			<slot />
		</Button>
	</div>

	{#if menuOpen}
		<div
			class="menu-dropdown {position}"
			style="width: {width}"
			transition:fade={{ duration: 150 }}
			role="menu"
		>
			{#each items as item (item.id)}
				{#if item.separator}
					<div class="menu-separator" role="separator"></div>
				{:else if item.heading}
					<h3 class="menu-heading">{item.heading}</h3>
				{:else}
					<button
						class="menu-item {item.disabled ? 'disabled' : ''} {activeSubmenu === item.id
							? 'active'
							: ''}"
						type="button"
						disabled={item.disabled}
						on:click={(e) => selectItem(e, item)}
						role="menuitem"
					>
						<span class="menu-item-label">{item.label}</span>
						{#if item.children && item.children.length > 0}
							<svg
								class="menu-item-caret"
								viewBox="0 0 24 24"
								width="14"
								height="14"
								stroke="currentColor"
								stroke-width="2"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="9 6 15 12 9 18"></polyline>
							</svg>
						{/if}
					</button>

					{#if item.children && item.children.length > 0 && activeSubmenu === item.id}
						<div class="submenu" role="menu">
							{#each item.children as childItem (childItem.id)}
								{#if childItem.separator}
									<div class="menu-separator" role="separator">{childItem.label}</div>
								{:else}
									<button
										class="menu-item {childItem.disabled ? 'disabled' : ''}"
										type="button"
										disabled={childItem.disabled}
										on:click={(e) => selectItem(e, childItem)}
										role="menuitem"
									>
										<span class="menu-item-label">{childItem.label}</span>
									</button>
								{/if}
							{/each}
						</div>
					{/if}
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.menu-container {
		position: relative;
		display: inline-block;
	}

	.menu-trigger-wrapper {
		display: inline-block;
	}

	.menu-dropdown {
		position: absolute;
		min-width: 180px;
		max-width: 300px;
		background-color: var(--color-background-elevated);
		border: var(--border-width-thin) solid var(--color-border-default);
		margin: 0;
		padding: var(--space-1);
		z-index: var(--z-index-popover);
		border-radius: var(--border-radius-md);
		box-shadow: var(--shadow-md);
	}

	.bottom-left {
		top: 100%;
		left: 0;
		margin-top: var(--space-1);
	}

	.bottom-right {
		top: 100%;
		right: 0;
		margin-top: var(--space-1);
	}

	.top-left {
		bottom: 100%;
		left: 0;
		margin-bottom: var(--space-1);
	}

	.top-right {
		bottom: 100%;
		right: 0;
		margin-bottom: var(--space-1);
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2) var(--space-3);
		text-align: left;
		background-color: transparent;
		color: var(--color-text-primary);
		border: none;
		border-radius: var(--border-radius-sm);
		cursor: pointer;
		font-size: var(--font-size-sm);
		transition: background-color var(--transition-fast) ease;
		font-family: var(--font-family-sans);
	}

	.menu-item:hover:not(.disabled) {
		background-color: var(--color-button-subtle-hover);
	}

	.menu-item.active {
		background-color: var(--color-button-subtle-active);
	}

	.menu-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		color: var(--color-text-disabled);
	}

	.menu-item-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.menu-separator {
		height: 1px;
		margin: var(--space-1) 0;
		background-color: var(--color-border-default);
	}

	.menu-heading {
		margin: var(--space-3);
		color: var(--color-text-tertiary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-normal);
		font-style: italic;
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.submenu {
		position: absolute;
		left: 100%;
		top: 0;
		min-width: 180px;
		background-color: var(--color-background-elevated);
		border: var(--border-width-thin) solid var(--color-border-default);
		padding: var(--space-1);
		border-radius: var(--border-radius-md);
		box-shadow: var(--shadow-md);
	}
</style>
