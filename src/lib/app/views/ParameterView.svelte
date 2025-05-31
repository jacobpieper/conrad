<script lang="ts">
	import TextField from '../components/elements/TextField.svelte'
	import Spinner from '../components/elements/Spinner.svelte'
	import Checkbox from '../components/elements/Checkbox.svelte'
	import Dropdown from '../components/elements/Dropdown.svelte'
	import { DefaultImage } from '$lib/core/graph/nodes/ImageCacheNode'
	import { FitMode } from '$lib/core/graph/nodes/RenderNode'

	let { parameter = $bindable(), scale, inputClick, outputClick } = $props()

	// Create reactive local copies of the parameter value
	let stringValue = $state(parameter.dataType === 'string' ? parameter.value : '')
	let numberValue = $state(parameter.dataType === 'number' ? parameter.value : 0)
	let booleanValue = $state(parameter.dataType === 'boolean' ? parameter.value : false)
	let arrayValue = $state(parameter.dataType === 'array' ? parameter.value : [])

	// Update parameter when local values change
	$effect(() => {
		if (parameter.dataType === 'string') {
			parameter.value = stringValue
		} else if (parameter.dataType === 'number') {
			parameter.value = numberValue
		} else if (parameter.dataType === 'boolean') {
			parameter.value = booleanValue
		} else if (parameter.dataType === 'array') {
			parameter.value = arrayValue
		}
	})

	function handleInputClick(event: Event): void {
		if (inputClick) {
			inputClick({ parameter, event })
		}
	}

	function handleOutputClick(event: Event): void {
		if (outputClick) {
			outputClick({ parameter, event })
		}
	}

	interface SimpleOption {
		value: string
		label: string
	}

	function getEnumValues(enumName: string): SimpleOption[] {
		let enumObject: Record<string, string> | null = null

		switch (enumName) {
			case 'Image':
				enumObject = DefaultImage as any
				break
			case 'Fit Mode':
				enumObject = FitMode as any
				break
			default:
				return []
		}

		if (!enumObject) return []

		return Object.entries(enumObject)
			.filter(([key, value]) => isNaN(Number(key)) && typeof value === 'string')
			.map(([key, value]) => ({
				value: value,
				label: key.replace(/([A-Z])/g, ' $1').trim(),
			}))
	}

	const options = getEnumValues(parameter.name)
</script>

<!-- INPUT PARAMETER -->
{#if parameter.direction === 'input'}
	<div class="parameter input-parameter {parameter.dataType}-parameter">
		<button
			id="{parameter.id}-socket"
			class="socket input-socket {parameter.dataType}-socket"
			style="width: {16 * scale}px; height: {16 * scale}px;"
			title="Click to connect input"
			aria-label="Input Port"
			onclick={(event) => handleInputClick(event)}
		></button>
		<span style="font-size: {12 * scale}px;">{parameter.name}</span>
		<div class="parameter-data">
			{#if parameter.dataType === 'string'}
				<TextField size="small" bind:value={stringValue} />
			{:else if parameter.dataType === 'number'}
				<Spinner size="small" bind:value={numberValue} />
			{:else if parameter.dataType === 'boolean'}
				<Checkbox size="small" bind:checked={booleanValue} />
			{:else if parameter.dataType === 'array'}
				<Dropdown size="small" bind:value={arrayValue} {options} />
			{:else if parameter.dataType === 'imageData'}
				<span></span>
			{/if}
		</div>
	</div>

	<!-- OUTPUT PARAMETER -->
{:else if parameter.direction === 'output'}
	<div class="parameter output-parameter {parameter.dataType}-parameter">
		<span style="font-size: {12 * scale}px">{parameter.name}</span>
		<button
			id="{parameter.id}-socket"
			class="socket output-socket {parameter.dataType}-socket"
			style="width: {16 * scale}px; height: {16 * scale}px;"
			title="Click to select output"
			aria-label="Output Port"
			onclick={(event) => handleOutputClick(event)}
		></button>
	</div>
{/if}

<style>
	.parameter {
		display: flex;
		align-items: center;
		width: 100%;
		position: relative;
	}

	.parameter span {
		margin-right: var(--space-1);
		font-size: var(--font-size-sm);
		white-space: nowrap;
		color: var(--color-text-secondary);
	}

	.input-parameter {
		justify-content: start;
	}

	.output-parameter {
		justify-content: end;
	}

	.parameter-data {
		width: 80px;
	}

	.socket {
		outline: none;
		border: none;
		border-radius: 50%;
		background-color: var(--color-background-default);
		cursor: pointer;
	}

	.socket:hover {
		background-color: yellow;
	}

	.input-socket {
		transform: translateX(-50%);
	}

	.output-socket {
		transform: translateX(50%);
	}
</style>
