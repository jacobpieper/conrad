<script lang="ts">
	export let type: 'text' | 'number' | 'search' | 'url' = 'text'
	export let value: string = ''
	export let placeholder: string = ''
	export let label: string | undefined = undefined
	export let size: 'x-small' | 'small' | 'medium' | 'large' = 'medium'
	export let disabled: boolean = false
	export let required: boolean = false
	export let name: string | undefined = undefined
	export let id: string | undefined = undefined
	export let fullWidth: boolean = false
	export let error: string | undefined = undefined
	export let helperText: string | undefined = undefined
	export let icon: string | undefined = undefined
	export let trailingIcon: string | undefined = undefined
	export let readonly: boolean = false
	export let autocomplete: string | undefined = undefined
	export let maxlength: number | undefined = undefined
	export let minlength: number | undefined = undefined
	export let pattern: string | undefined = undefined

	function getInputClasses() {
		return [
			'input-container',
			`input-${size}`,
			fullWidth ? 'input-full-width' : '',
			error ? 'input-error' : '',
			disabled ? 'input-disabled' : '',
			icon ? 'has-icon' : '',
			trailingIcon ? 'has-trailing-icon' : '',
		]
			.filter(Boolean)
			.join(' ')
	}

	const uniqueId = id || `input-${Math.random().toString(36).slice(2, 11)}`
</script>

<div class={getInputClasses()}>
	{#if label}
		<label for={uniqueId} class="input-label">
			{label}
			{#if required}
				<span class="required-indicator">*</span>
			{/if}
		</label>
	{/if}

	<div class="input=wrapper">
		{#if icon}
			<span class="input-icon leading-icon">
				{icon}
			</span>
		{/if}

		<input
			{type}
			bind:value
			{name}
			id={uniqueId}
			class="text-input"
			{placeholder}
			{disabled}
			{required}
			{readonly}
			aria-invalid={!!error}
			aria-describedby={error
				? `${uniqueId}-error`
				: helperText
					? `${uniqueId}
      -help`
					: undefined}
			{maxlength}
			{minlength}
			{pattern}
			on:focus
			on:blur
			on:input
			on:change
			on:keydown
			on:keyup
			on:keypress
		/>

		{#if trailingIcon}
			<span class="input-icon trailing-icon">
				{trailingIcon}
			</span>
		{/if}
	</div>

	{#if error}
		<div class="input-message error-message" id={`${uniqueId}-error`}>
			{error}
		</div>
	{:else if helperText}
		<div class="input-message help-text" id={`${uniqueId}-helper`}>
			{helperText}
		</div>
	{/if}
</div>

<style>
	.input-container {
		display: inline-flex;
		flex-direction: column;
		gap: var(--space-1);
		font-family: var(--font-family-sans);
	}

	.input-full-width {
		width: 100%;
	}

	.input-label {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		user-select: none;
	}

	.required-indicator {
		color: var(--color-error-1);
		margin-left: var(--space-1);
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.text-input {
		width: 100%;
		padding: var(--space-2);
		color: var(--color-text-primary);
		background-color: var(--color-background-input);
		border: var(--border-width-thin) solid var(--color-border-input);
		border-radius: var(--border-radius-md);
		font-family: inherit;
		font-size: inherit;
		line-height: var(--line-height-normal);
		transition: var(--transition-standard);
	}

	.text-input::placeholder {
		color: var(--color-text-placeholder);
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-accent-2);
		box-shadow: 0 0 0 1px var(--color-accent-2);
	}

	.input-icon {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-icon-secondary);
		pointer-events: none;
	}

	.leading-icon {
		left: var(--space-2);
	}

	.trailing-icon {
		right: var(--space-2);
	}

	.has-icon .text-input {
		padding-left: calc(var(--space-2) * 2 + 1rem);
	}

	.has-trailing-icon .text-input {
		padding-right: calc(var(--space-2) * 2 + 1rem);
	}

	.input-error .text-input {
		border-color: var(--color-error-1);
	}

	.input-error .text-input:focus {
		box-shadow: 0 0 0 1px var(--color-error-1);
	}

	.input-disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-disabled .text-input {
		cursor: not-allowed;
	}

	.input-message {
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
	.input-x-small .text-input {
		height: var(--height-input-xs);
		font-size: var(--font-size-sm);
		padding: 0 var(--space-2);
	}

	.input-small .text-input {
		height: var(--height-input-sm);
		font-size: var(--font-size-sm);
		padding: 0 var(--space-2);
	}

	.input-medium .text-input {
		height: var(--height-input-md);
		font-size: var(--font-size-md);
		padding: 0 var(--space-2);
	}

	.input-large .text-input {
		height: var(--height-input-lg);
		font-size: var(--font-size-lg);
		padding: 0 var(--space-3);
	}

	.input-small .input-icon {
		font-size: var(--font-size-sm);
	}

	.input-medium .input-icon {
		font-size: var(--font-size-md);
	}

	.input-large .input-icon {
		font-size: var(--font-size-lg);
	}

	.input-small.has-icon .text-input {
		padding-left: calc(var(--space-2) * 2 + var(--font-size-sm));
	}

	.input-medium.has-icon .text-input {
		padding-left: calc(var(--space-3) * 2 + var(--font-size-md));
	}

	.input-large.has-icon .text-input {
		padding-left: calc(var(--space-4) * 2 + var(--font-size-lg));
	}

	.input-small.has-trailing-icon .text-input {
		padding-right: calc(var(--space-2) * 2 + var(--font-size-sm));
	}

	.input-medium.has-trailing-icon .text-input {
		padding-right: calc(var(--space-3) * 2 + var(--font-size-md));
	}

	.input-large.has-trailing-icon .text-input {
		padding-right: calc(var(--space-4) * 2 + var(--font-size-lg));
	}
</style>
