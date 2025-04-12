<script lang="ts">
	import { onDestroy } from 'svelte'
	import { connectionsStore, containerOffsetStore } from '../stores/connectionsStore'
	import type { Connection, NodeInstance } from '$lib/types'
	import Vector2 from '$lib/utils/Vector2'

	// local reactive variables
	let connections: Connection[] = []
	let containerOffset = new Vector2(0, 0)

	// Subscribe to stores
	const unsubscribeConnections = connectionsStore.subscribe((value) => {
		connections = value
	})

	const unsubscribeContainerOffset = containerOffsetStore.subscribe((value) => {
		containerOffset = value
	})

	onDestroy(() => {
		unsubscribeConnections()
		unsubscribeContainerOffset()
	})

	function getPortPosition(node: NodeInstance, portId: number): Vector2 {
		const portElement = document.getElementById(`port-${node.id}-${portId}`)
		if (!portElement) {
			throw new Error(`Port element with ID 'port-${node.id}-${portId}' not found`)
		}

		const rect = portElement.getBoundingClientRect()

		return new Vector2(
			rect.left + rect.width / 2 - containerOffset.x,
			rect.top + rect.height / 2 - containerOffset.y
		)
	}

	function getConnectionCoordinates(connection: Connection): { output: Vector2; input: Vector2 } {
		const output = getPortPosition(connection.output.node, connection.output.parameterId)
		const input = getPortPosition(connection.input.node, connection.input.parameterId)

		return { output, input }
	}
</script>

{#each connections as connection}
	{@const coordinates: { output: Vector2, input: Vector2 } = getConnectionCoordinates(connection)}
	<svg class="connection">
		<line
			x1={coordinates.output.x}
			y1={coordinates.output.y}
			x2={coordinates.input.x}
			y2={coordinates.input.y}
		/>
	</svg>
{/each}

<style>
	.connection {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}
	.connection line {
		stroke: var(--fg0);
		stroke-width: 2;
		stroke-linecap: round;
	}
</style>
