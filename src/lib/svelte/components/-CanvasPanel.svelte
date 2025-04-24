<script lang="ts">
	import { onMount } from 'svelte'
	import { isEditMode } from '../stores/editorStore'
	import type { CanvasConfig, CanvasObject } from '$lib/types'
	import { canvasesStore } from '$lib/svelte/stores/stores'

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

<div class="canvas-panel {$isEditMode ? 'canvas-panel-edit' : ''}">
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
		transition:
			transform 350ms cubic-bezier(0.33, 1, 0.68, 1),
			max-width 350ms cubic-bezier(0.33, 1, 0.68, 1),
			max-height 350ms cubic-bezier(0.33, 1, 0.68, 1);
		will-change: transform;
	}

	.canvas-panel-edit {
		max-width: 100%;
		max-height: 100%;
		transform: scale(0.9);
	}

	.canvas-container {
		padding: 4px 4px 0;
		background-color: var(--bg4);
		border-radius: 8px;
		cursor: none;
		transition:
			transform 350ms cubic-bezier(0.33, 1, 0.68, 1),
			box-shadow 350ms cubic-bezier(0.33, 1, 0.68, 1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.canvas-panel-edit .canvas-container {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	canvas {
		background-color: var(--bg4);
		border: 1px solid var(--colGrey1);
		border-radius: 4px;
		image-rendering: crisp-edges;
		transition: border-color 350ms ease;
	}
</style>
