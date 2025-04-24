import { get } from 'svelte/store'
import { canvasesStore } from '$lib/svelte/stores/stores'
import { FitMode } from '$lib/enums'
import { Node } from './Node.svelte'

export default class RenderNode extends Node {
	private canvas: HTMLCanvasElement | null = null
	private ctx: CanvasRenderingContext2D | null = null

	constructor() {
		super()
		this.type = 'RenderNode'
		this.displayName = 'Render'

		// Inputs
		this.createParameter({
			name: 'canvasId',
			role: 'input',
			type: 'text',
			value: 'conradCanvas',
		})
		this.createParameter({
			name: 'image',
			role: 'input',
			type: 'imageData',
			value: null,
		})
		this.createParameter({
			name: 'fitMode',
			role: 'input',
			type: 'enum',
			value: FitMode.Stretch,
		})
	}

	// ~ BASE METHODS

	async onRun(): Promise<void> {
		const canvasId = this.getParameterByName('canvasId').value as string

		const canvases = get(canvasesStore) //TODO use sveltes built in reactivity
		const canvasObject = canvases.find((canvas) => canvas.name === canvasId)

		if (!canvasObject) {
			throw new Error(`Canvas with ID ${canvasId} not found`)
		}

		this.canvas = canvasObject.canvas
		this.ctx = this.canvas.getContext('2d')

		if (!this.ctx || !this.canvas) {
			throw new Error('No canvas context available')
		}

		this.ctx.imageSmoothingEnabled = false
	}

	async onFrame(): Promise<void> {
		const imageData = this.getParameterByName('imageInput').value as ImageData
		const fitMode = this.getParameterByName('fitMode').value as FitMode

		const osCanvas = new OffscreenCanvas(imageData.width, imageData.height)
		const osCtx = osCanvas.getContext('2d')

		if (!this.ctx || !this.canvas || !osCtx || !osCanvas) {
			throw new Error('Failed to get context')
		}

		osCtx.putImageData(imageData, 0, 0)

		switch (fitMode) {
			case FitMode.ActualSize:
				this.ctx.putImageData(imageData, 0, 0)
				break

			case FitMode.Stretch:
				this.ctx.drawImage(osCanvas, 0, 0, this.canvas.width, this.canvas.height)
				break

			case FitMode.Contain:
				const containScale = Math.min(
					this.canvas.width / imageData.width,
					this.canvas.height / imageData.height
				)
				const scaledWidth = imageData.width * containScale
				const scaledHeight = imageData.height * containScale

				const x = (this.canvas.width - scaledWidth) / 2
				const y = (this.canvas.height - scaledHeight) / 2

				this.ctx.drawImage(osCanvas, x, y, scaledWidth, scaledHeight)
				break

			case FitMode.Tile:
				const pattern = this.ctx.createPattern(osCanvas, 'repeat')

				if (!pattern) {
					throw new Error('Failed to create pattern')
				}

				this.ctx.fillStyle = pattern
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
				break

			case FitMode.Cover:
				const coverScale = Math.max(
					this.canvas.width / imageData.width,
					this.canvas.height / imageData.height
				)
				const coverWidth = imageData.width * coverScale
				const coverHeight = imageData.height * coverScale
				const coverX = (this.canvas.width - coverWidth) / 2
				const coverY = (this.canvas.height - coverHeight) / 2

				this.ctx.drawImage(osCanvas, coverX, coverY, coverWidth, coverHeight)
				break

			default:
				break
		}
	}
}
