import { Canvases } from '$lib/core/display/Canvases.svelte'
import { Node } from './Node'

export enum FitMode {
	ActualSize = 'Actual Size',
	Stretch = 'Stretch',
	Contain = 'Contain',
	Tile = 'Tile',
	Cover = 'Cover',
}

export class RenderNode extends Node {
	private canvas: HTMLCanvasElement | null = null
	private ctx: CanvasRenderingContext2D | null = null

	constructor() {
		super()
		this.type = 'RenderNode'
		this.name = 'Render'

		this.createParameter({
			name: 'Canvas ID',
			dataType: 'string',
			direction: 'input',
			value: 'conradCanvas',
		})
		this.createParameter({
			name: 'Image',
			dataType: 'imageData',
			direction: 'input',
			value: null,
		})
		this.createParameter({
			name: 'Fit Mode',
			dataType: 'array',
			direction: 'input',
			value: FitMode.Stretch,
		})
	}

	async onRun(): Promise<void> {
		try {
			const canvasId = this.getParameter('Canvas ID').value as string

			const canvases = Canvases.getInstance()
			const canvasObject = canvases.getCanvasByName(canvasId)

			if (!canvasObject) {
				throw new Error(`Canvas with ID ${canvasId} not found`)
			}

			this.canvas = canvasObject.canvas
			this.ctx = this.canvas.getContext('2d')

			if (!this.canvas || !this.ctx) {
				throw new Error('No canvas context available')
			}

			this.ctx.imageSmoothingEnabled = false
		} catch (error) {
			console.error('Error in RenderNode onRun:', error)
			throw error
		}
	}

	async onFrame(): Promise<void> {
		try {
			const imageData = this.getParameter('Image').value as ImageData
			const fitMode = this.getParameter('Fit Mode').value as FitMode

			if (!imageData) {
				console.warn('No image data available to render')
				return
			}

			const osCanvas = new OffscreenCanvas(imageData.width, imageData.height)
			const osCtx = osCanvas.getContext('2d')

			if (!this.ctx || !this.canvas || !osCtx || !osCanvas) {
				throw new Error('Failed to get context')
			}

			osCtx.putImageData(imageData, 0, 0)

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

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
		} catch (error) {
			console.error('Error ion RenderNode onFrame:', error)
			throw error
		}
	}
}
