<script lang="ts">
	export let group: any = undefined
	export let label: string | undefined = undefined
	export let value: string = ''
	export let name: string | undefined = undefined
	export let id: string | undefined = undefined
	export let disabled: boolean = false
	export let required: boolean = false
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let error: string | undefined = undefined
	export let helperText: string | undefined = undefined

	// Generate a unique ID for the radio if not provided
	const uniqueId = id || `radio-${Math.random().toString(36).slice(2, 11)}`

	// Function to generate CSS classes
	function getRadioClasses() {
		return [
			'radio-container',
			`radio-${size}`,
			group === value ? 'radio-checked' : '',
			error ? 'radio-error' : '',
			disabled ? 'radio-disabled' : '',
		]
			.filter(Boolean)
			.join(' ')
	}
</script>

<div class={getRadioClasses()}>
	<label class="radio-label" for={uniqueId}>
		<div class="radio-input-container">
			<input
				type="radio"
				{name}
				id={uniqueId}
				class="radio-input"
				{value}
				bind:group
				{disabled}
				{required}
				aria-invalid={!!error}
				aria-describedby={error
					? `${uniqueId}-error`
					: helperText
						? `${uniqueId}-helper`
						: undefined}
			/>
			<div class="radio-custom"></div>
		</div>

		{#if label}
			<span class="radio-text">{label}</span>
		{/if}
	</label>

	{#if error}
		<div class="radio-message error-message" id={`${uniqueId}-error`}>
			{error}
		</div>
	{:else if helperText}
		<div class="radio-message helper-text" id={`${uniqueId}-helper`}>
			{helperText}
		</div>
	{/if}
</div>

<style>
	.radio-container {
		display: inline-flex;
		flex-direction: column;
		gap: var(--space-1);
		font-family: var(--font-family-sans);
		position: relative;
	}

	.radio-label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		user-select: none;
	}

	.radio-input-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.radio-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		margin: 0;
	}

	.radio-custom {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		border: var(--border-width-thin) solid var(--color-border-input);
		border-radius: 50%;
		background-color: var(--color-background-input);
		transition: all 0.2s ease;
	}

	/* Inner dot when checked */
	.radio-custom::after {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-radius: 50%;
		background-color: var(--color-accent-2);
		transition: all 0.2s ease;
		opacity: 0;
	}

	/* Checked state */
	.radio-input:checked + .radio-custom {
		border-color: var(--color-accent-2);
	}

	.radio-input:checked + .radio-custom::after {
		width: 0.5em;
		height: 0.5em;
		opacity: 1;
	}

	/* Focus state */
	.radio-input:focus-visible + .radio-custom {
		outline: none;
		box-shadow:
			0 0 0 2px var(--color-background-input),
			0 0 0 4px var(--color-accent-2);
	}

	.radio-text {
		color: var(--color-text-primary);
		font-size: inherit;
	}

	/* Error state */
	.radio-error .radio-custom {
		border-color: var(--color-error-1);
	}

	.radio-error .radio-input:checked + .radio-custom::after {
		background-color: var(--color-error-1);
	}

	.radio-error .radio-input:focus-visible + .radio-custom {
		box-shadow:
			0 0 0 2px var(--color-background-input),
			0 0 0 4px var(--color-error-1);
	}

	/* Disabled state */
	.radio-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.radio-disabled .radio-label {
		cursor: not-allowed;
	}

	/* Message styles */
	.radio-message {
		font-size: var(--font-size-xs);
		margin-top: var(--space-1);
		margin-left: calc(1em + var(--space-2)); /* Align with the text */
	}

	.error-message {
		color: var(--color-error-1);
	}

	.helper-text {
		color: var(--color-text-tertiary);
	}

	/* Sizes */
	.radio-small .radio-custom {
		width: 0.875em;
		height: 0.875em;
	}

	.radio-small .radio-input:checked + .radio-custom::after {
		width: 0.4375em;
		height: 0.4375em;
	}

	.radio-small .radio-text {
		font-size: var(--font-size-sm);
	}

	.radio-medium .radio-custom {
		width: 1em;
		height: 1em;
	}

	.radio-medium .radio-input:checked + .radio-custom::after {
		width: 0.5em;
		height: 0.5em;
	}

	.radio-medium .radio-text {
		font-size: var(--font-size-md);
	}

	.radio-large .radio-custom {
		width: 1.25em;
		height: 1.25em;
	}

	.radio-large .radio-input:checked + .radio-custom::after {
		width: 0.625em;
		height: 0.625em;
	}

	.radio-large .radio-text {
		font-size: var(--font-size-lg);
	}
</style>
