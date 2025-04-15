<script lang="ts">
	export let checked = false
	export let disabled = false
	export let name: string | undefined = undefined
	export let value: string | undefined = undefined
	export let id: string | undefined = undefined
	export let required = false
	export let label: string | undefined = undefined
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let indeterminate = false
	export let accent = false

	let checkboxElement: HTMLInputElement

	$: if (checkboxElement) {
		checkboxElement.indeterminate = indeterminate
	}

	function getCheckboxClasses() {
		return [
			'checkbox-container',
			`checkbox-${size}`,
			disabled ? 'checkbox-disabled' : '',
			accent ? 'checkbox-accent' : '',
		]
			.filter(Boolean)
			.join(' ')
	}
</script>

<div class={getCheckboxClasses()}>
	<div class="checkbox-wrapper">
		<input
			type="checkbox"
			bind:this={checkboxElement}
			bind:checked
			{disabled}
			{name}
			{value}
			{id}
			{required}
			aria-checked={indeterminate ? 'mixed' : checked}
			on:change
			on:focus
			on:blur
			on:click
		/>
		<span class="checkbox-control" aria-hidden="true">
			<svg
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="checkbox-icon"
				class:visible={checked && !indeterminate}
			>
				<path
					d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<svg
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="checkbox-icon"
				class:visible={indeterminate}
			>
				<path
					d="M2.91675 7H11.0834"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</div>

	{#if label}
		<label for={id} class="checkbox-label">
			{label}
		</label>
	{:else}
		<slot />
	{/if}
</div>

<style>
	.checkbox-container {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		position: relative;
		cursor: pointer;
	}

	.checkbox-container.checkbox-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.checkbox-wrapper {
		position: relative;
		display: inline-block;
		flex-shrink: 0;
	}

	input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		cursor: inherit;
		z-index: 1;
	}

	.checkbox-control {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		border: var(--border-width-thin) solid var(--color-border-input);
		border-radius: var(--border-radius-md);
		background-color: var(--color-checkbox-false-bg);
		transition:
			background-color var(--transition-normal),
			border-color var(--transition-normal);
		color: var(--color-checkbox-false-fg);
		position: relative;
	}

	input[type='checkbox']:checked + .checkbox-control {
		background-color: var(--color-checkbox-true-bg);
	}

	.checkbox-accent input[type='checkbox']:checked + .checkbox-control {
		background-color: var(--color-accent-2);
		border-color: var(--color-accent-2);
	}

	input[type='checkbox']:focus-visible + .checkbox-control {
		outline: var(--border-width-medium) solid var(--color-accent-3);
		outline-offset: var(--border-width-thin);
	}

	input[type='checkbox']:hover:not(:disabled) + .checkbox-control {
		border-color: var(--color-checkbox-border);
	}

	.checkbox-accent input[type='checkbox']:hover:not(:disabled) + .checkbox-control {
		border-color: var(--color-accent-2);
	}

	.checkbox-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: calc(var(--checkbox-size) * 0.6);
		height: calc(var(--checkbox-size) * 0.6);
		opacity: 0;
		transition: opacity var(--transition-normal);
		pointer-events: none;
	}

	.checkbox-icon.visible {
		opacity: 1;
	}

	/* Sizes */
	.checkbox-small {
		--checkbox-size: var(--height-checkbox-sm);
		font-size: var(--font-size-sm);
	}

	.checkbox-medium {
		--checkbox-size: var(--height-checkbox-md);
		font-size: var(--font-size-md);
	}

	.checkbox-large {
		--checkbox-size: var(--height-checkbox-lg);
		font-size: var(--font-size-lg);
	}

	.checkbox-label {
		color: var(--color-text-primary);
		user-select: none;
		cursor: inherit;
		line-height: 1.2;
	}
</style>
