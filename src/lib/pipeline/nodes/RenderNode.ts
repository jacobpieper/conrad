import { get } from 'svelte/store'
import { canvasesStore } from '$lib/svelte/stores/stores'
import BaseNode from './BaseNode'
import { FitMode } from '$lib/enums'

export default class RenderNode extends BaseNode {
	#canvas: HTMLCanvasElement | null
	#ctx: CanvasRenderingContext2D | null
	#renderStrategy: (imageData: ImageData) => void

	constructor(id: number) {
		super(id)
		this.type = 'RenderNode'

		this.#canvas = null
		this.#ctx = null
		this.#renderStrategy = () => {}

		// Inputs
		this._createParameter('canvasId', 'text', 'input', 'conradCanvas')
		this._createParameter('imageInput', 'imageData', 'input', null)
		this._createParameter('fitMode', 'enum', 'input', FitMode.Stretch)
	}

	// ~ BASE METHODS

	async onRun(): Promise<void> {
		const canvasId = this._getParameterValue('canvasId').value as string

		const canvases = get(canvasesStore) //TODO use sveltes built in reactivity
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

		const osCanvas = new OffscreenCanvas(imageData.width, imageData.height)
		const osCtx = osCanvas.getContext('2d')

		if (!this.#ctx || !this.#canvas || !osCtx || !osCanvas) {
			throw new Error('Failed to get context')
		}

		osCtx.putImageData(imageData, 0, 0)

		switch (fitMode) {
			case FitMode.ActualSize:
				this.#ctx.putImageData(imageData, 0, 0)
				break

			case FitMode.Stretch:
				this.#ctx.drawImage(osCanvas, 0, 0, this.#canvas.width, this.#canvas.height)
				break

			case FitMode.Contain:
				const containScale = Math.min(
					this.#canvas.width / imageData.width,
					this.#canvas.height / imageData.height
				)
				const scaledWidth = imageData.width * containScale
				const scaledHeight = imageData.height * containScale

				const x = (this.#canvas.width - scaledWidth) / 2
				const y = (this.#canvas.height - scaledHeight) / 2

				this.#ctx.drawImage(osCanvas, x, y, scaledWidth, scaledHeight)
				break

			case FitMode.Tile:
				const pattern = this.#ctx.createPattern(osCanvas, 'repeat')

				if (!pattern) {
					throw new Error('Failed to create pattern')
				}

				this.#ctx.fillStyle = pattern
				this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
				break

			case FitMode.Cover:
				const coverScale = Math.max(
					this.#canvas.width / imageData.width,
					this.#canvas.height / imageData.height
				)
				const coverWidth = imageData.width * coverScale
				const coverHeight = imageData.height * coverScale
				const coverX = (this.#canvas.width - coverWidth) / 2
				const coverY = (this.#canvas.height - coverHeight) / 2

				this.#ctx.drawImage(osCanvas, coverX, coverY, coverWidth, coverHeight)
				break

			default:
				break
		}
	}
}
