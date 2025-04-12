import { get } from 'svelte/store'
import { canvasesStore } from '$lib/svelte/stores/stores'
import BaseNode from './BaseNode'
import { FitMode } from '$lib/enums'

export default class RenderNode extends BaseNode {
	#canvas: HTMLCanvasElement | null
	#ctx: CanvasRenderingContext2D | null

	constructor(id: number) {
		super(id)
		this.type = 'RenderNode'

		this.#canvas = null
		this.#ctx = null

		// Inputs
		this._createParameter('canvasId', 'text', 'input', 'conradCanvas')
		this._createParameter('imageInput', 'imageData', 'input', null)
		this._createParameter('fitMode', 'enum', 'input', FitMode.Stretch)
	}

	async onRun(): Promise<void> {
		const canvasId = this._getParameterValue('canvasId').value as string

		// Get canvas from store
		const canvases = get(canvasesStore)
		const canvasObject = canvases.find((canvas) => canvas.name === canvasId)

		if (!canvasObject) {
			throw new Error(`Canvas with ID ${canvasId} not found`)
		}

		this.#canvas = canvasObject.canvas
		this.#ctx = this.#canvas.getContext('2d')

		if (!this.#ctx || !this.#canvas) {
			throw new Error('No canvas context available')
		}

		this.#ctx.imageSmoothingEnabled = false
	}

	async onFrame(): Promise<void> {
		const imageData = this._getParameterValue('imageInput').value as ImageData
		const fitMode = this._getParameterValue('fitMode').value as FitMode

		if (!this.#ctx || !this.#canvas) {
			throw new Error('No canvas context available')
		}

		switch (fitMode) {
			//case FitMode.ActualSize: // Use image's actual dimensions
			//	this.#canvas.width = imageData.width
			//	this.#canvas.height = imageData.height
			//	this.#ctx.putImageData(imageData, 0, 0)
			//	break

			case FitMode.Stretch: // Stretch/squash to fit canvas
				const stretchCanvas = this.#getOsObject(imageData.width, imageData.height)

				stretchCanvas.ctx.putImageData(imageData, 0, 0)

				this.#ctx.drawImage(stretchCanvas.canvas, 0, 0, this.#canvas.width, this.#canvas.height)
				break

			//case FitMode.Contain: // Scale to fit while maintaining aspect ratio
			//	const containScale = Math.min(
			//		this.#canvas.width / imageData.width,
			//		this.#canvas.height / imageData.height
			//	)
			//	const scaledWidth = imageData.width * containScale
			//	const scaledHeight = imageData.height * containScale
			//
			//	const x = (this.#canvas.width - scaledWidth) / 2
			//	const y = (this.#canvas.height - scaledHeight) / 2
			//
			//	const containCanvas = this.#getOsObject(imageData.width, imageData.height)
			//
			//	containCanvas.ctx.putImageData(imageData, 0, 0)
			//	this.#ctx.drawImage(containCanvas.canvas, x, y, scaledWidth, scaledHeight)
			//	break

			case FitMode.Tile: // Repeat image to fill canvas
				const tileCanvas = this.#getOsObject(imageData.width, imageData.height)

				tileCanvas.ctx.putImageData(imageData, 0, 0)
				const pattern = this.#ctx.createPattern(tileCanvas.canvas, 'repeat')
				if (!pattern) {
					throw new Error('Failed to create pattern')
				}

				this.#ctx.fillStyle = pattern
				this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
				break

			//case FitMode.Cover: // Scale to cover while maintaining aspect ratio
			//	const coverScale = Math.max(
			//		this.#canvas.width / imageData.width,
			//		this.#canvas.height / imageData.height
			//	)
			//	const coverWidth = imageData.width * coverScale
			//	const coverHeight = imageData.height * coverScale
			//	const coverX = (this.#canvas.width - coverWidth) / 2
			//	const coverY = (this.#canvas.width - coverHeight) / 2
			//
			//	const coverCanvas = this.#getOsObject(imageData.width, imageData.height)
			//
			//	coverCanvas.ctx.putImageData(imageData, 0, 0)
			//	this.#ctx.drawImage(coverCanvas.canvas, coverX, coverY, coverWidth, coverHeight)
			//	break

			default:
				break
		}
	}

	#getOsObject(
		width: number,
		height: number
	): { canvas: OffscreenCanvas; ctx: OffscreenCanvasRenderingContext2D } {
		const canvas = new OffscreenCanvas(width, height)
		const ctx = canvas.getContext('2d')
		if (!ctx) {
			throw new Error('Failed to get context')
		}

		return { canvas, ctx }
	}
}
