<script lang="ts">
	import { onMount } from 'svelte'
	import type { CanvasConfig, CanvasObject } from '$lib/types'
	import canvasesStore from '$lib/svelte/stores/canvasesStore'

	let canvasConfigs: CanvasConfig[] = [{ name: 'conradCanvas', width: 512, height: 512 }]

	function getCanvasesFromDOM(): HTMLCanvasElement[] {
		return Array.from(document.querySelectorAll('.canvas-panel canvas'))
	}

	function getCanvasObjects(canvases: HTMLCanvasElement[]): CanvasObject[] {
		const canvasObjects = canvases.map((canvas, index) => {
			const config = canvasConfigs[index]
			return { name: config.name, id: index, canvas } as CanvasObject
		})
		return canvasObjects
	}

	onMount(() => {
		const canvases = getCanvasesFromDOM()
		const canvasObjects = getCanvasObjects(canvases)
		canvasesStore.set(canvasObjects)
	})
</script>

<div class="canvas-panel">
	{#each canvasConfigs as canvas}
		<div class="canvas-container">
			<canvas class={canvas.name} width={canvas.width} height={canvas.height}></canvas>
		</div>
	{/each}
</div>

<style>
	.canvas-panel {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--bg2);
		color: var(--fg1);
	}
	.canvas-container {
		padding: 4px 4px 0;
		background-color: var(--bg4);
		border-radius: 8px;
		cursor: none;
	}
	canvas {
		background-color: var(--bg4);
		border: 1px solid var(--colGrey1);
		border-radius: 4px;
		image-rendering: crisp-edges;
	}
</style>
