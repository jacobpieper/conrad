<script lang="ts">
	import type { SimpleOption, GroupOption } from '$lib/types'

	export let options: Array<SimpleOption | GroupOption | any> = []
	export let value: string = ''
	export let placeholder: string = 'Select an option'
	export let label: string | undefined = undefined
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let disabled: boolean = false
	export let required: boolean = false
	export let name: string | undefined = undefined
	export let id: string | undefined = undefined
	export let fullWidth: boolean = false
	export let error: string | undefined = undefined
	export let helperText: string | undefined = undefined
	export let clearable: boolean = false
	export let width: string | undefined = undefined

	const uniqueId = id || `dropdown=${Math.random().toString(36).slice(2, 11)}`

	$: inlineStyle = width ? `width: ${width};` : fullWidth ? 'width: 100%;' : ''

	function getDropdownClasses() {
		return [
			'dropdown-container',
			`dropdown-${size}`,
			error ? 'dropdown-error' : '',
			disabled ? 'dropdown-disabled' : '',
		]
			.filter(Boolean)
			.join(' ')
	}

	function isGroupOption(option: any): boolean {
		return (
			option &&
			typeof option === 'object' &&
			option.type &&
			option.type === 'group' &&
			Array.isArray(option.options)
		)
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement
		console.log(target.value)
		if (target.value === '') {
			value = ''
		}
	}
</script>

<div class={getDropdownClasses()}>
	{#if label}
		<label for={uniqueId} class="dropdown-label">
			{label}
			{#if required}
				<span class="required-indicator">*</span>
			{/if}
		</label>
	{/if}

	<div class="dropdown-wrapper" style={inlineStyle}>
		<div class="dropdown-control">
			<select
				{name}
				id={uniqueId}
				class="dropdown-select"
				bind:value
				{disabled}
				{required}
				aria-invalid={!!error}
				aria-describedby={error
					? `${uniqueId}-error`
					: helperText
						? `${uniqueId}-helper`
						: undefined}
				on:change={handleChange}
				on:focus
				on:blur
			>
				<!-- Optional empty/placeholder option -->
				{#if !required || clearable}
					<option value="">{placeholder}</option>
				{/if}

				<!-- Render options with support for groups -->
				{#each options as option}
					{#if isGroupOption(option)}
						<!-- Render option group -->
						<optgroup label={option.label}>
							{#each option.options as subOption}
								<option value={subOption.value}>{subOption.label}</option>
							{/each}
						</optgroup>
					{:else}
						<!-- Render simple option -->
						<option value={option.value}>{option.label}</option>
					{/if}
				{/each}
			</select>

			<div class="dropdown-icon">
				<svg
					viewBox="0 0 24 24"
					width="16"
					height="16"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</div>
	</div>

	{#if error}
		<div class="dropdown-message error-message" id={`${uniqueId}-error`}>
			{error}
		</div>
	{:else if helperText}
		<div class="dropdown-message helper-text" id={`${uniqueId}-helper`}>
			{helperText}
		</div>
	{/if}
</div>

<style>
	.dropdown-container {
		display: inline-flex;
		flex-direction: column;
		gap: var(--space-1);
		font-family: var(--font-family-sans);
	}

	.dropdown-label {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		user-select: none;
	}

	.required-indicator {
		color: var(--color-error-1);
		margin-left: var(--space-1);
	}

	.dropdown-wrapper {
		position: relative;
		display: flex;
	}

	.dropdown-control {
		position: relative;
		width: 100%;
		display: flex;
	}

	.dropdown-select {
		width: 100%;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		color: var(--color-text-primary);
		background-color: var(--color-background-input);
		border: var(--border-width-thin) solid var(--color-border-input);
		border-radius: var(--border-radius-md);
		font-family: inherit;
		font-size: inherit;
		line-height: var(--line-height-normal);
		transition: var(--transition-standard);
		cursor: pointer;
		padding-right: 2.5em; /* Space for the dropdown icon */
		background-image: none;
	}

	.dropdown-select:focus {
		outline: none;
		border-color: var(--color-accent-2);
		box-shadow: 0 0 0 1px var(--color-accent-2);
		z-index: 1;
	}

	.dropdown-select:focus-visible {
		outline: none;
		border-color: var(--color-accent-2);
		box-shadow: 0 0 0 1px var(--color-accent-2);
	}

	.dropdown-icon {
		position: absolute;
		top: var(--border-width-thin);
		right: var(--border-width-thin);
		bottom: var(--border-width-thin);
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		pointer-events: none; /* Allow clicks to pass through to the select */
		width: var(--space-7);
		color: var(--color-text-secondary);
		border-left: var(--border-width-thin) solid var(--color-border-input);
		background-color: var(--color-background-elevated);
		border-top-right-radius: calc(var(--border-radius-md) - var(--border-width-thin));
		border-bottom-right-radius: calc(var(--border-radius-md) - var(--border-width-thin));
		z-index: 2;
	}

	/* Hide default dropdown arrow in IE/Edge */
	.dropdown-select::-ms-expand {
		display: none;
	}

	.dropdown-error .dropdown-select {
		border-color: var(--color-error-1);
	}

	.dropdown-error .dropdown-select:focus {
		box-shadow: 0 0 0 1px var(--color-error-1);
	}

	.dropdown-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.dropdown-disabled .dropdown-select {
		cursor: not-allowed;
	}

	.dropdown-message {
		font-size: var(--font-size-xs);
		margin-top: var(--space-1);
	}

	.error-message {
		color: var(--color-error-1);
	}

	.helper-text {
		color: var(--color-text-tertiary);
	}

	/* Sizes */
	.dropdown-small .dropdown-select {
		height: var(--height-input-sm);
		font-size: var(--font-size-sm);
		padding: 0 var(--space-6) 0 var(--space-1);
	}

	.dropdown-medium .dropdown-select {
		height: var(--height-input-md);
		font-size: var(--font-size-md);
		padding: 0 2.5em 0 var(--space-3);
	}

	.dropdown-large .dropdown-select {
		height: var(--height-input-lg);
		font-size: var(--font-size-lg);
		padding: 0 3em 0 var(--space-4);
	}

	.dropdown-small .dropdown-icon {
		width: 2em;
	}

	.dropdown-large .dropdown-icon {
		width: 3em;
	}

	/* Option Styles */
	.dropdown-select option {
		background-color: var(--color-background-input);
		color: var(--color-text-primary);
		padding: var(--space-2) var(--space-3);
	}

	/* Optgroup Styles */
	.dropdown-select optgroup {
		font-weight: var(--font-weight-bold);
		font-style: normal; /* Remove default italic style */
		color: var(--color-text-secondary);
		background-color: var(--color-background-subtle);
	}
</style>
