<script lang="ts">
	export let value: number = 0
	export let min: number | undefined = undefined
	export let max: number | undefined = undefined
	export let step: number = 1
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let disabled: boolean = false
	export let required: boolean = false
	export let label: string | undefined = undefined
	export let name: string | undefined = undefined
	export let id: string | undefined = undefined
	export let fullWidth: boolean = false
	export let error: string | undefined = undefined
	export let helperText: string | undefined = undefined
	export let placeholder: string = ''
	export let width: string | undefined = undefined
	export let fitToMaxValue: boolean = false

	let inputValue = value.toString()

	const uniqueId = id || `spinner-${Math.random().toString(36).slice(2, 11)}`

	function calculateWidth() {
		if (!fitToMaxValue) return ''

		if (max === undefined && min === undefined) return '4em'

		const maxDigits = max !== undefined ? max.toString().length : 0
		const minDigits = min !== undefined ? min.toString().length : 0
		const largestDigitCount = Math.max(maxDigits, minDigits)

		return `${Math.max(3, largestDigitCount * 0.8 + 3.75)}em`
	}

	$: inlineStyle = width
		? `width: ${width};`
		: fitToMaxValue
			? `width: ${calculateWidth()};`
			: fullWidth
				? `width: 100%;`
				: ''

	function getSpinnerClasses() {
		return [
			'spinner-container',
			`spinner-${size}`,
			error ? 'spinner-error' : '',
			disabled ? 'spinner-disabled' : '',
		]
			.filter(Boolean)
			.join(' ')
	}

	$: {
		inputValue = value.toString()
	}

	function increment() {
		if (disabled) return

		let newValue = value + step

		if (max !== undefined && newValue > max) {
			newValue = max
		}

		value = newValue
		inputValue = newValue.toString()
	}

	function decrement() {
		if (disabled) return

		let newValue = value - step

		if (min !== undefined && newValue < min) {
			newValue = min
		}

		value = newValue
		inputValue = newValue.toString()
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement
		inputValue = target.value

		const parsedValue = parseFloat(inputValue)

		if (!isNaN(parsedValue)) {
			if (min !== undefined && parsedValue < min) {
				value = min
				inputValue = min.toString()
			} else if (max !== undefined && parsedValue > max) {
				value = max
				inputValue = max.toString()
			} else {
				value = parsedValue
			}
		}
	}

	// Handle blur event - normalise the input value
	function handleBlur() {
		// If empty of invalid, reset to current value
		if (inputValue === '' || isNaN(parseFloat(inputValue))) {
			inputValue = value.toString()
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return

		if (event.key === 'ArrowUp') {
			event.preventDefault()
			increment()
		} else if (event.key === 'ArrowDown') {
			event.preventDefault()
			decrement()
		}
	}
</script>

<div class={getSpinnerClasses()}>
	{#if label}
		<label for={uniqueId} class="spinner-label">
			{label}
			{#if required}
				<span class="required-indicator">*</span>
			{/if}
		</label>
	{/if}

	<div class="spinner-wrapper" style={inlineStyle}>
		<input
			type="text"
			inputmode="numeric"
			{name}
			id={uniqueId}
			class="spinner-input"
			{placeholder}
			{disabled}
			{required}
			value={inputValue}
			aria-invalid={!!error}
			aria-describedby={error ? `${uniqueId}-error` : helperText ? `${uniqueId}-helper` : undefined}
			{min}
			{max}
			{step}
			on:input={handleInput}
			on:blur={handleBlur}
			on:keydown={handleKeydown}
			on:focus
			on:change
		/>

		<div class="spinner-controls">
			<button
				type="button"
				class="spinner-button spinner-up"
				aria-label="Increment"
				disabled={disabled || (max !== undefined && value >= max)}
				on:click={increment}
			>
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
					<polyline points="18 15 12 9 6 15"></polyline>
				</svg>
			</button>

			<button
				type="button"
				class="spinner-button spinner-down"
				aria-label="Decrement"
				disabled={disabled || (min !== undefined && value <= min)}
				on:click={decrement}
			>
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
			</button>
		</div>
	</div>

	{#if error}
		<div class="spinner-message error-message" id={`${uniqueId}-error`}>
			{error}
		</div>
	{:else if helperText}
		<div class="spinner-message helper-text" id={`${uniqueId}-helper`}>
			{helperText}
		</div>
	{/if}
</div>

<style>
	.spinner-container {
		display: inline-flex;
		flex-direction: column;
		gap: var(--space-1);
		font-family: var(--font-family-sans);
	}

	.spinner-full-width {
		width: 100%;
	}

	.spinner-custom-width {
		width: var(--spinner-custom-width);
	}

	.spinner-label {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		user-select: none;
	}

	.required-indicator {
		color: var(--color-error-1);
		margin-left: var(--space-1);
	}

	.spinner-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.spinner-input {
		width: 100%;
		padding-right: 3rem; /* Space for buttons */
		color: var(--color-text-primary);
		background-color: var(--color-background-input);
		border: var(--border-width-thin) solid var(--color-border-input);
		border-radius: var(--border-radius-md);
		font-family: inherit;
		font-size: inherit;
		line-height: var(--line-height-normal);
		transition: var(--transition-standard);
		text-align: left;
	}

	.spinner-input::placeholder {
		color: var(--color-text-placeholder);
	}

	.spinner-input:focus {
		outline: none;
		border-color: var(--color-accent-2);
		box-shadow: 0 0 0 1px var(--color-accent-2);
	}

	.spinner-controls {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		border-left: var(--border-width-thin) solid var(--color-border-input);
		height: calc(100% - 2px); /* To avoid clipping */
		margin-top: 1px; /* To avoid clipping */
		margin-right: 1px; /* To avoid clipping */
	}

	.spinner-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		width: 2rem;
		height: 50%;
		background: var(--color-background-elevated);
		border: none;
		cursor: pointer;
		transition: background-color 0.15s ease;
		color: var(--color-text-secondary);
	}

	.spinner-button:hover:not(:disabled) {
		background-color: var(--color-button-subtle-hover);
	}

	.spinner-button:active:not(:disabled) {
		background-color: var(--color-button-subtle-active);
	}

	.spinner-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spinner-button:focus {
		outline: none;
	}

	.spinner-button:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 2px var(--color-accent-2);
		z-index: 1;
	}

	.spinner-input:focus-visible {
		outline: none;
		border-color: var(--color-accent-2);
		box-shadow: 0 0 0 1px var(--color-accent-2);
	}

	.spinner-controls:focus-within {
		border-color: var(--color-accent-2);
	}

	.spinner-up {
		border-top-right-radius: calc(var(--border-radius-md) - 1px); /* To avoid clipping */
		border-bottom: var(--border-width-thin) solid var(--color-border-input);
	}

	.spinner-down {
		border-bottom-right-radius: calc(var(--border-radius-md) - 1px); /* To avoid clipping */
	}

	.spinner-error .spinner-input {
		border-color: var(--color-error-1);
	}

	.spinner-error .spinner-input:focus {
		box-shadow: 0 0 0 1px var(--color-error-1);
	}

	.spinner-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spinner-disabled .spinner-input {
		cursor: not-allowed;
	}

	.spinner-message {
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
	.spinner-small .spinner-input {
		height: var(--height-input-sm);
		font-size: var(--font-size-sm);
		padding: 0 3rem 0 var(--space-2);
	}

	.spinner-medium .spinner-input {
		height: var(--height-input-md);
		font-size: var(--font-size-md);
		padding: 0 3rem 0 var(--space-3);
	}

	.spinner-large .spinner-input {
		height: var(--height-input-lg);
		font-size: var(--font-size-lg);
		padding: 0 3.5rem 0 var(--space-4);
	}

	.spinner-small .spinner-button {
		width: 1.5rem;
	}

	.spinner-large .spinner-button {
		width: 2.5rem;
	}
</style>
