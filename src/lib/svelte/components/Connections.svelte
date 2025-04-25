<script lang="ts">
	import Vector2 from '$lib/utils/Vector2'
	import type { Connection } from '$lib/pipeline/Connection.svelte'
	import type Parameter from '$lib/pipeline/Parameter.svelte'

	let {
		connections,
		containerOffset,
		selectedOutput,
		mousePosition,
	}: {
		connections: Connection[]
		containerOffset: Vector2
		selectedOutput: Parameter | null
		mousePosition: Vector2
	} = $props()

	const cornerRadius = 8

	function getPreviewPath(): string {
		if (!selectedOutput) {
			return ''
		}

		const fromPosition = selectedOutput.portPosition
		const fromX = fromPosition.x - containerOffset.x
		const fromY = fromPosition.y - containerOffset.y
		const toX = mousePosition.x
		const toY = mousePosition.y

		// Calculate midpoint for horizontal-vertical pattern
		const midX = fromX + (toX - fromX) / 2

		return createPathWithRoundedCorners(
			new Vector2(fromX, fromY),
			new Vector2(toX, toY),
			midX,
			cornerRadius
		)
	}

	function getConnectionPath(connection: Connection): string {
		const fromPosition = connection.from.portPosition
		const toPosition = connection.to.portPosition

		const fromX = fromPosition.x - containerOffset.x
		const fromY = fromPosition.y - containerOffset.y
		const toX = toPosition.x - containerOffset.x
		const toY = toPosition.y - containerOffset.y

		// Calculate midpoint for horizontal-vertical pattern
		const midX = fromX + (toX - fromX) / 2

		return createPathWithRoundedCorners(
			new Vector2(fromX, fromY),
			new Vector2(toX, toY),
			midX,
			cornerRadius
		)
	}

	function createPathWithRoundedCorners(
		from: Vector2,
		to: Vector2,
		midX: number,
		cornerRadius: number
	): string {
		// Start at the source point
		let path = `M ${from.x} ${from.y}`

		// Draw horizontal line to the midpoint
		if (Math.abs(from.x - midX) > cornerRadius) {
			// If there's enough space for a corner, make it rounded
			if (from.x < midX) {
				// Moving right
				path += ` L ${midX - cornerRadius} ${from.y}`
				path += ` Q ${midX} ${from.y} ${midX} ${from.y + Math.sign(to.y - from.y) * cornerRadius}`
			} else {
				// Moving left
				path += ` L ${midX + cornerRadius} ${from.y}`
				path += ` Q ${midX} ${from.y} ${midX} ${from.y + Math.sign(to.y - from.y) * cornerRadius}`
			}
		} else {
			// Not enough space, just move to the midpoint
			path += ` L ${midX} ${from.y}`
		}

		// Draw vertical line to target's y-coordinate
		if (Math.abs(from.y - to.y) > cornerRadius * 2) {
			// If there's enough space for corners at both ends
			if (from.y < to.y) {
				// Moving down
				path += ` L ${midX} ${to.y - cornerRadius}`
				path += ` Q ${midX} ${to.y} ${midX + Math.sign(to.x - midX) * cornerRadius} ${to.y}`
			} else {
				// Moving up
				path += ` L ${midX} ${to.y + cornerRadius}`
				path += ` Q ${midX} ${to.y} ${midX + Math.sign(to.x - midX) * cornerRadius} ${to.y}`
			}
		} else {
			// Not enough space, just move vertically
			path += ` L ${midX} ${to.y}`
		}

		// Draw horizontal line to the target point
		path += ` L ${to.x} ${to.y}`

		return path
	}
</script>

{#if selectedOutput}
	<svg class="preview-connection">
		<path
			d={getPreviewPath()}
			fill="none"
			stroke="red"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/if}

{#each connections as connection (connection.id)}
	<svg class="connection">
		<path
			d={getConnectionPath(connection)}
			fill="none"
			stroke="var(--fg0)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/each}

<style>
	.connection,
	.preview-connection {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.connection path {
		stroke: var(--color-text-primary);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.preview-connection path {
		stroke: var(--color-text-tertiary);
		stroke-width: 2;
		stroke-dasharray: 4, 8;
	}
</style>
