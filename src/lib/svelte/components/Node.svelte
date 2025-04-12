<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { NodeInstance, NodeParameter, NodeEvents, FitMode, BlendMode } from '$lib/types'
	import Vector2 from '$lib/utils/Vector2'

	export let node: NodeInstance
	export let selectedPortId: number | null = null

	const dispatch = createEventDispatcher<NodeEvents>()

	/**
	 * Returns an array of values for the named enum.
	 */
	function getEnumValues(enumName: string): string[] {
		let enumObject

		switch (enumName) {
			case 'fitMode':
				enumObject = FitMode
				break
			case 'blendMode':
				enumObject = BlendMode
				break
			default:
				throw new Error(`Unknown enum name: ${enumName}`)
		}

		return Object.values(enumName).filter((value) => typeof value === 'string')
	}

	/**
	 * Returns the center point of an element based on its bounding rectangle.
	 */
	function getElementPosition(element: HTMLElement): Vector2 {
		if (element instanceof HTMLElement) {
			const rect = element.getBoundingClientRect()
			return new Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2)
		} else {
			throw new Error('Invalid element: Expected an HTMLElement.')
		}
	}

	/**
	 * Dispatches 'portClick' event when a port is clocked.
	 */
	function onPortClicked(portId: number, event: MouseEvent): void {
		event.stopPropagation()

		const portElement = event.currentTarget as HTMLElement
		const portPosition = getElementPosition(portElement)

		// Find the portPosition in parameters and update its position.
		const parameter: NodeParameter = node.parameters.find(
			(item: NodeParameter) => item.id === portId
		)
		if (parameter.portPosition) {
			parameter.portPosition = portPosition

			dispatch('portClicked', {
				node,
				parameterId: portId,
			})
		}
	}

	/**
	 * Dispatches 'delete' event when the delete button is clicked.
	 */
	function onDeleteClicked(event: MouseEvent): void {
		event.stopPropagation()
		dispatch('delete', { nodeId: node.id })
	}
</script>

<div class="node">
	<!-- NODE HEADER -->
	<div class="node-header draggable">
		<span>{node.type}</span>
		<button type="button" on:click|stopPropagation={onDeleteClicked} class="delete-button">x</button
		>
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
						<input type="text" bind:value={parameter.value as string} />
					{:else if parameter.type === 'boolean'}
						<input type="checkbox" bind:value={parameter.value as boolean} />
					{:else if parameter.type === 'number'}
						<input
							type="number"
							bind:value={parameter.value as number}
							step={parameter.config.step}
							min={parameter.config.min}
							max={parameter.config.max}
						/>
					{:else if parameter.type === 'enum'}
						<select bind:value={parameter.value}>
							{#each getEnumValues(parameter.name) as enumValue}
								<option value={enumValue}>{enumValue}</option>
							{/each}
						</select>
					{:else}
						<span class="error">Unknown parameter type: {parameter.type}.</span>
					{/if}
					<button
						id="port-{node.id}-{parameter.id}"
						class="port input-port type-{parameter.type} {selectedPortId === parameter.id
							? 'selected'
							: ''}"
						title="Click to connect input"
						aria-label="Input Port"
						on:click|stopPropagation={(event) => onPortClicked(parameter.id, event)}
					></button>
				</div>

				<!-- OUTPUT PARAMETER -->
			{:else if parameter.role === 'output'}
				<div class="parameter output-parameter">
					<span>{parameter.name}</span>
					<button
						id="port-{node.id}-{parameter.id}"
						class="port output-port type-{parameter.type} {selectedPortId === parameter.id
							? 'selected'
							: ''}"
						title="Click to select output"
						aria-label="Output Port"
						on:click|stopPropagation={(event) => onPortClicked(parameter.id, event)}
					></button>
				</div>
				<!-- NO ROLE PARAMETER = ERROR -->
			{:else}
				<span class="error">Unknown parameter role: {parameter.role}.</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.node {
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
		border: 1px solid var(--colGrey2);
		border-radius: 2px;
		background-color: var(--colGrey3);
		width: 200px;
		user-select: none;
	}
	.node-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		cursor: pointer;
	}
	.delete-button {
		background: transparent;
		border: none;
		color: var(--colRed0);
		cursor: pointer;
		font-size: 0.9rem;
	}
	.delete-button:hover {
		color: var(--colRed1);
	}
	.node-body {
		padding: 0.5rem;
		background-color: var(--colGrey0);
		border-radius: 2px;
		font-size: 0.8rem;
	}
	.parameter {
		display: flex;
		align-items: center;
		margin-bottom: 0.25rem;
		width: 100%;
		position: relative;
	}
	.parameter span {
		margin-right: 0.25rem;
		font-size: 0.75rem;
		white-space: nowrap;
	}
	.parameter input[type='text'] {
		flex: 1;
		padding: 0.2rem 0.25rem;
		font-size: 0.75rem;
		border: 1px solid var(--colGrey4);
		border-radius: 2px;
		background-color: var(--colGrey5);
		color: var(--fg0);
		width: 50px;
	}
	.parameter input[type='checkbox'] {
		transform: scale(1.1);
		margin-left: 0.25rem;
	}
	.parameter input[type='number'] {
		flex: 1;
		padding: 0.1rem 0.2rem;
		font-size: 0.75rem;
		border: 1px solid var(--colGrey4);
		border-radius: 2px;
		background-color: var(--colGrey5);
		color: var(--fg0);
		width: 50px;
	}
	.parameter select {
		flex: 1;
		padding: 0.1rem 0.2rem;
		font-size: 0.75rem;
		border: 1px solid var(--colGrey4);
		border-radius: 2px;
		background-color: var(--colGrey5);
		color: var(--fg0);
		width: 100px;
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
		background: var(--colGrey6);
		border: 4px solid var(--colGrey2);
		outline: 1px solid var(--colGrey4);
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background 0.2s,
			border-color 0.2s;
		z-index: -1;
	}
	.port:hover {
		background: var(--colGrey7);
		border-color: var(--colGrey4);
		cursor: grab;
	}
	.input-port {
		left: calc(-0.5rem - 14px);
		border-top-left-radius: 50%;
		border-bottom-left-radius: 50%;
	}
	.output-port {
		right: calc(-0.5rem - 14px);
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
	}

	.type-text {
		background-color: var(--colGrey8);
	}
	.type-checkbox {
		background-color: var(--colGreen0);
	}
	.type-imageData {
		background-color: var(--colBlue0);
	}
</style>
