<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { Node } from '$lib/pipeline/nodes/Node.svelte'
	import type Parameter from '$lib/pipeline/Parameter.svelte'
	import Vector2 from '$lib/utils/Vector2'
	import Checkbox from './ui/Checkbox.svelte'
	import TextField from './ui/TextField.svelte'
	import Spinner from './ui/Spinner.svelte'
	import Dropdown from './ui/Dropdown.svelte'
	import { BlendMode, DefaultImage, FitMode } from '$lib/enums'
	import type { SimpleOption } from '$lib/types'

	let { node }: { node: Node } = $props()

	interface NodeEvents {
		outputClicked: { parameter: Parameter }
		inputClicked: { parameter: Parameter }
		focus: { node: Node }
		delete: { nodeId: number }
	}

	const options = [
		{
			value: 'value22',
			label: 'label',
		},
	]

	const dispatch = createEventDispatcher<NodeEvents>()

	function getEnumValues(enumName: string): SimpleOption[] {
		let enumObject

		switch (enumName) {
			case 'fitMode':
				enumObject = FitMode
				break
			case 'blendMode':
				enumObject = BlendMode
				break
			case 'image':
				enumObject = DefaultImage
				break
			default:
				throw new Error(`Unknown enum name: ${enumName}`)
		}

		// Convert enum values to SimpleOption format
		//TODO move to own file
		return Object.entries(enumObject)
			.filter(([_, value]) => typeof value === 'string')
			.map(([key, value]) => ({
				value: value as string,
				label:
					key.charAt(0).toUpperCase() +
					key
						.slice(1)
						.replace(/([A-Z])/g, ' $1')
						.trim(),
			}))
	}

	function onOutputClicked(parameter: Parameter, event: Event): void {
		event.stopPropagation()
		dispatch('outputClicked', { parameter })
	}

	function onInputClicked(parameter: Parameter, event: Event): void {
		event.stopPropagation()
		dispatch('inputClicked', { parameter })
	}

	function onDeleteClicked(): void {
		dispatch('delete', { nodeId: node.id })
	}

	function onNodeClicked(): void {
		dispatch('focus', { node })
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions-->
<div class="node" id="id-{node.id.toString()}" onclick={onNodeClicked}>
	<!-- NODE HEADER -->
	<div class="node-header draggable">
		<span>{node.displayName}</span>
		<button type="button" class="delete-button" onclick={onDeleteClicked}>x</button>
	</div>

	<!-- NODE BODY -->
	<div class="node-body">
		<!-- PARAMETERS -->
		{#each node.parameters as parameter}
			<!-- INPUT PARAMETER -->
			{#if parameter.role === 'input'}
				<div class="parameter input-parameter">
					<span>{parameter.name}</span>
					{#if parameter.type === 'text'}
						<TextField size="small" bind:value={parameter.value} />
					{:else if parameter.type === 'boolean'}
						<Checkbox size="small" bind:checked={parameter.value} />
					{:else if parameter.type === 'number'}
						<Spinner size="small" bind:value={parameter.value} />
					{:else if parameter.type === 'enum'}
						<Dropdown
							size="small"
							options={getEnumValues(parameter.name)}
							bind:value={parameter.value}
						/>
					{:else if parameter.type === 'imageData'}
						<span></span>
					{:else}
						<span class="error">Unknown parameter type: {parameter.type}.</span>
					{/if}
					<button
						id="id-{parameter.id.toString()}"
						class="port input-port type-{parameter.type}"
						title="Click to connect input"
						aria-label="Input Port"
						onclick={(event) => onInputClicked(parameter, event)}
					></button>
				</div>

				<!-- OUTPUT PARAMETER -->
			{:else if parameter.role === 'output'}
				<div class="parameter output-parameter">
					<span>{parameter.name}</span>
					<button
						id="id-{parameter.id.toString()}"
						class="port output-port type-{parameter.type}"
						title="Click to select output"
						aria-label="Output Port"
						onclick={(event) => onOutputClicked(parameter, event)}
					></button>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.node {
		display: flex;
		flex-direction: column;
		padding: var(--space-1);
		border: var(--border-width-thin) solid var(--color-border-default);
		border-radius: var(--border-radius-sm);
		background-color: var(--color-background-card);
		width: 220px;
		user-select: none;
	}
	.node-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
		cursor: pointer;
	}
	.delete-button {
		background: transparent;
		border: none;
		color: var(--color-button-danger-text);
		cursor: pointer;
		font-size: var(--font-size-sm);
		transition: all var(--transition-xfast);
	}
	.delete-button:hover {
		color: var(--color-button-danger-hover);
	}
	.node-body {
		padding: var(--space-1);
		background-color: var(--color-background-elevated);
		border-radius: var(--border-radius-sm);
		font-size: var(--font-size-xs);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
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
	.port {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 14px;
		height: 14px;
		background: var(--color-neutral-6);
		border: none;
		cursor: pointer;
		flex-shrink: 0;
		transition: all var(--transition-fast);
		z-index: -1;
	}
	.port:hover {
		background: var(--color-neutral-4);
		border-color: var(--color-neutral-2);
	}
	.input-port {
		left: -22px;
		border-top-left-radius: 50%;
		border-bottom-left-radius: 50%;
	}
	.output-port {
		right: -22px;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
	}

	.type-boolean {
		background-color: var(--color-red-2);
	}
	.type-boolean:hover {
		background-color: var(--color-red-1);
	}

	.type-imageData {
		background-color: var(--color-orange-2);
	}
	.type-imageData:hover {
		background-color: var(--color-orange-1);
	}

	.type-number {
		background-color: var(--color-teal-2);
	}
	.type-number:hover {
		background-color: var(--color-teal-1);
	}

	.type-text {
		background-color: var(--color-purple-2);
	}
	.type-text:hover {
		background-color: var(--color-purple-1);
	}

	.type-enum {
		background-color: var(--color-green-2);
	}
	.type-enum:hover {
		background-color: var(--color-green-1);
	}
</style>
