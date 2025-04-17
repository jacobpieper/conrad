<script lang="ts">
	import Radio from './Radio.svelte'

	export let options: Array<{
		value: string
		label: string
		disabled?: boolean
	}> = []

	export let value: string = ''
	export let name: string = `radio-group-${Math.random().toString(36).slice(2, 11)}`
	export let label: string | undefined = undefined
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let disabled: boolean = false
	export let required: boolean = false
	export let error: string | undefined = undefined
	export let helperText: string | undefined = undefined
	export let direction: 'horizontal' | 'vertical' = 'vertical'

	const groupId = `radio-group-${Math.random().toString(36).slice(2, 11)}`

	function getGroupClasses() {
		return [
			'radio-group',
			`radio-group-${direction}`,
			error ? 'radio-group-error' : '',
			disabled ? 'radio-group-disabled' : '',
		]
			.filter(Boolean)
			.join(' ')
	}

	function handleChange(optionValue: string) {
		value = optionValue
	}
</script>

<div
	class={getGroupClasses()}
	role="radiogroup"
	aria-labelledby={label ? `${groupId}-label` : undefined}
>
	{#if label}
		<div class="radio-group-label" id={`${groupId}-label`}>
			{label}
			{#if required}
				<span class="required-indicator">*</span>
			{/if}
		</div>
	{/if}

	<div class="radio-group-options">
		{#each options as option}
			<Radio
				group={value === option.value}
				label={option.label}
				value={option.value}
				{name}
				{size}
				disabled={disabled || option.disabled}
				on:change={() => handleChange(option.value)}
			/>
		{/each}
	</div>

	{#if error}
		<div class="radio-group-message error-message">
			{error}
		</div>
	{:else if helperText}
		<div class="radio-group-message helper-text">
			{helperText}
		</div>
	{/if}
</div>

<style>
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		font-family: var(--font-family-sans);
	}

	.radio-group-label {
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		user-select: none;
	}

	.required-indicator {
		color: var(--color-error-1);
		margin-left: var(--space-1);
	}

	.radio-group-options {
		display: flex;
		gap: var(--space-3);
	}

	.radio-group-vertical .radio-group-options {
		flex-direction: column;
	}

	.radio-group-horizontal .radio-group-options {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.radio-group-message {
		font-size: var(--font-size-xs);
		margin-top: var(--space-1);
	}

	.error-message {
		color: var(--color-error-1);
	}

	.helper-text {
		color: var(--color-text-tertiary);
	}
</style>
