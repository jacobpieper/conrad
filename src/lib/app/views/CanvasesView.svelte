<script lang="ts">
	import { Canvases, type CanvasConfiguration } from '$lib/core/display/Canvases.svelte'
	import { HashState } from '$lib/pipeline/HashState.svelte'
	import { onMount } from 'svelte'

	let { canvasConfigurations }: { canvasConfigurations: CanvasConfiguration[] } = $props()

	let canvases: Canvases | null
	const hash = new HashState()

	onMount(() => {
		canvases = new Canvases(canvasConfigurations)
	})
</script>

<div class="canvases {hash.isEditState() ? 'edit-mode' : ''}">
	{#each canvasConfigurations as configuration}
		<div class="canvas-container">
			<canvas
				id={configuration.name}
				width={configuration.dimensions.x}
				height={configuration.dimensions.y}
			>
			</canvas>
		</div>
	{/each}
</div>

<style>
	.canvases {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--color-background-default);
		color: var(--color-text-primary);
		transition:
			transform 350ms cubic-bezier(0.33, 1, 0.68, 1),
			max-width 350ms cubic-bezier(0.33, 1, 0.68, 1),
			max-height 350ms cubic-bezier(0.33, 1, 0.68, 1);
		will-change: transform;
	}
	.canvases.edit-mode {
		max-width: 100%;
		max-height: 100%;
		transform: scale(0.9);
	}

	.canvas-container {
		padding: var(--space-1);
		background-color: var(--color-background-canvas);
		border-radius: var(--border-radius-lg);
		cursor: none;
		box-shadow: var(--shadow-lg);
		transition:
			transform 350ms cubic-bezier(0.33, 1, 0.68, 1),
			box-shadow 350ms cubic-bezier(0.33, 1, 0.68, 1);
	}

	canvas {
		background-color: var(--color-background-canvas);
		border: var(--border-width-thin) solid var(--color-border-ghost);
		border-radius: var(--border-radius-md);
		image-rendering: crisp-edges;
	}
</style>
