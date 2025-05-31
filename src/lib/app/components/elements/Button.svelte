<script lang="ts">
	export let appearance: 'primary' | 'secondary' | 'subtle' | 'danger' | 'link' = 'primary'
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let disabled = false
	export let type: 'button' | 'submit' | 'reset' = 'button'
	export let icon: string | null = null
	export let trailingIcon: string | null = null
	export let fullWidth = false
	export let ariaLabel: string | undefined = undefined

	// Helper function to generate CSS classes
	function getButtonClasses() {
		const classes = [
			'button',
			`button-${appearance}`,
			`button-${size}`,
			fullWidth ? 'button-full-width' : '',
		]

		return classes.filter(Boolean).join(' ')
	}
</script>

<button
	{type}
	class={getButtonClasses()}
	{disabled}
	aria-disabled={disabled}
	aria-label={ariaLabel}
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:focus
	on:blur
	on:keydown
>
	{#if icon}
		<span class="icon icon-leading">{icon}</span>
	{/if}

	{#if $$slots.default}
		<span class="button-content">
			<slot />
		</span>
	{/if}

	{#if trailingIcon}
		<span class="icon icon-trailing">
			{trailingIcon}
		</span>
	{/if}
</button>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		border: none;
		border-radius: var(--border-radius-md);
		font-family: var(--font-family-sans);
		font-weight: var(--font-weight-medium);
		text-decoration: none;
		cursor: pointer;
		transition: var(--transition-property-common);
		transition-duration: var(--transition-normal);
		transition-timing-function: var(--transition-default-timing);
		position: relative;
		white-space: nowrap;
		box-shadow: var(--shadow-sm);
		border: var(--border-width-thin) solid rgba(0, 0, 0, 0.2);
	}
	.button:focus-visible {
		outline: var(--border-width-medium) solid var(--colPrimary3);
		outline-offset: var(--border-width-thin);
	}
	.button[disabled],
	.button[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* Sizes */
	.button-small {
		font-size: var(--font-size-sm);
		padding: var(--space-button-sm);
		height: var(--height-button-sm);
	}
	.button-medium {
		font-size: var(--font-size-md);
		padding: var(--space-button-md);
		height: var(--height-button-md);
	}
	.button-large {
		font-size: var(--font-size-lg);
		padding: var(--space-button-lg);
		height: var(--height-button-lg);
	}

	/* Appearance */
	.button-primary {
		background-color: var(--color-button-primary-bg);
		color: var(--color-button-primary-text);
	}
	.button-primary:hover:not([disabled]) {
		background-color: var(--color-button-primary-hover);
	}
	.button-primary:active:not([disabled]) {
		background-color: var(--color-button-primary-active);
	}

	.button-secondary {
		background-color: var(--color-button-secondary-bg);
		color: var(--color-button-secondary-text);
	}
	.button-secondary:hover:not([disabled]) {
		background-color: var(--color-button-secondary-hover);
	}
	.button-secondary:active:not([disabled]) {
		background-color: var(--color-button-secondary-active);
	}

	.button-subtle {
		background-color: var(--color-button-subtle-bg);
		color: var(--color-button-subtle-text);
		border: none;
		box-shadow: none;
	}
	.button-subtle:hover:not([disabled]) {
		background-color: var(--color-button-subtle-hover);
		box-shadow: var(--shadow-xs);
	}
	.button-subtle:active:not([disabled]) {
		background-color: var(--color-button-subtle-active);
		box-shadow: var(--shadow-xs);
	}

	.button-danger {
		background-color: var(--color-button-danger-bg);
		color: var(--color-button-danger-text);
	}
	.button-danger:hover:not([disabled]) {
		background-color: var(--color-button-danger-hover);
	}
	.button-danger:active:not([disabled]) {
		background-color: var(--color-button-danger-hover);
	}

	.button-link {
		background-color: var(--color-button-link-bg);
		color: var(--color-button-link-text);
		padding: 0 var(--space-1);
		height: fit-content;
		text-decoration: underline;
		border: none;
		box-shadow: none;
	}
	.button-link:hover:not([disabled]) {
		background-color: var(--color-button-link-hover);
		color: var(--color-text-inverse);
		box-shadow: var(--shadow-sm);
	}
	.button-link:active:not([disabled]) {
		background-color: var(--color-button-link-active);
		color: var(--color-text-inverse);
		box-shadow: var(--shadow-sm);
	}

	/* Full Width */
	.button-full-width {
		width: 100%;
	}

	/* Content */
	.button-content {
		display: inline-flex;
		align-items: center;
	}

	/* Icons */
	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
</style>
