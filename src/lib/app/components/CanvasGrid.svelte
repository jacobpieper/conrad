<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import Vector2 from '$lib/utils/Vector2'

	// Props
	let { gridSize, scale = $bindable(1), pan = $bindable(new Vector2(0, 0)) } = $props()

	let canvasEl: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D

	// Derived value for the scaled grid size
	let scaledGridSize = $derived(gridSize * scale)

	onMount(() => {
		ctx = canvasEl.getContext('2d')!
		resizeCanvas()
		drawGrid()

		// Handle window resize
		window.addEventListener('resize', resizeCanvas)

		return () => {
			window.removeEventListener('resize', resizeCanvas)
		}
	})

	// Re-draw when props change
	$effect(() => {
		// When scale, pan or grid size changes, re-draw
		if (ctx && canvasEl && (scale || pan || gridSize)) {
			drawGrid()
		}
	})

	function resizeCanvas() {
		if (canvasEl) {
			canvasEl.width = canvasEl.clientWidth
			canvasEl.height = canvasEl.clientHeight
			drawGrid()
		}
	}

	export function drawGrid() {
		if (!ctx || !canvasEl) return

		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)

		// Calculate grid offset based on pan position
		const offsetX = ((pan.x % scaledGridSize) + scaledGridSize) % scaledGridSize
		const offsetY = ((pan.y % scaledGridSize) + scaledGridSize) % scaledGridSize

		ctx.beginPath()
		ctx.strokeStyle = '#282828'
		ctx.lineWidth = 1

		// Draw vertical lines
		for (let x = offsetX; x < canvasEl.width; x += scaledGridSize) {
			ctx.moveTo(x, 0)
			ctx.lineTo(x, canvasEl.height)
		}

		// Draw horizontal lines
		for (let y = offsetY; y < canvasEl.height; y += scaledGridSize) {
			ctx.moveTo(0, y)
			ctx.lineTo(canvasEl.width, y)
		}

		ctx.stroke()
	}
</script>

<canvas bind:this={canvasEl} class="grid-canvas"></canvas>

<style>
	.grid-canvas {
		width: 100%;
		height: 100%;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		pointer-events: none;
	}
</style>
