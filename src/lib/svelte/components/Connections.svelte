<script lang="ts">
	import Vector2 from '$lib/utils/Vector2'
	import type { Connection } from '$lib/pipeline/Connection.svelte'
	import type Parameter from '$lib/pipeline/Parameter.svelte'

	let {
		connections,
		containerOffset,
		selectedOutput,
	}: { connections: Connection[]; containerOffset: Vector2; selectedOutput: Parameter } = $props()

	function getPreviewCoordinates() {
		//TODO get mouseCoordinates from DeviceInputManager
	}

	function getConnectionCoordinates(connection: Connection): { from: Vector2; to: Vector2 } {
		const fromPosition = connection.from.portPosition
		const toPosition = connection.to.portPosition

		const fromX = fromPosition.x - containerOffset.x
		const fromY = fromPosition.y - containerOffset.y
		const toX = toPosition.x - containerOffset.x
		const toY = toPosition.y - containerOffset.y

		return {
			from: new Vector2(fromX, fromY),
			to: new Vector2(toX, toY),
		}
	}
</script>

{#if selectedOutput}
	{@const coordinates: Vector2 = getPreviewCoordinates()}
{/if}

{#each connections as connection}
	{@const coordinates: { from: Vector2, to: Vector2 } = getConnectionCoordinates(connection)}
	<svg class="connection">
		<line
			x1={coordinates.from.x}
			y1={coordinates.from.y}
			x2={coordinates.to.x}
			y2={coordinates.to.y}
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
