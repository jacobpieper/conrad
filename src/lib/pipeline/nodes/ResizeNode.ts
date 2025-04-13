import BaseNode from './BaseNode'
import { FitMode } from '$lib/enums'

export default class ResizeNode extends BaseNode {
	constructor(id: number) {
		super(id)
		this.type = 'ResizeNode'

		// Inputs
		this._createParameter('inputImage', 'imageData', 'input', null)
		this._createParameter('width', 'number', 'input', 512)
		this._createParameter('height', 'number', 'input', 512)
		this._createParameter('fitMode', 'enum', 'input', FitMode.Stretch)

		// Outputs
		this._createParameter('imageOut', 'imageData', 'output', null)
	}

	// ~ Base Methods

	async onRun(): Promise<void> {}

	async onFrame(): Promise<ImageData | null> {
		const inputImage = this._getParameterValue('inputImage').value as ImageData
		if (!ImageData) return null

		const width = this._getParameterValue('width').value as number
		const height = this._getParameterValue('height').value as number
		const fitMode = this._getParameterValue('fitMode').value as FitMode

		return this.#resizeImage(inputImage, width, height, fitMode)
	}

	// ~ Utility Methods

	#resizeImage(inputImage: ImageData, width: number, height: number, fitMode: FitMode): ImageData {
		// Original image canvas
		const srcCanvas = new OffscreenCanvas(inputImage.width, inputImage.height)
		const srcCtx = srcCanvas.getContext('2d')
		if (!srcCtx) throw new Error('Failed to get 2D context for source canvas')
		srcCtx.putImageData(inputImage, 0, 0)

		// Resized image canvas
		const destCanvas = new OffscreenCanvas(width, height)
		const destCtx = destCanvas.getContext('2d')
		if (!destCtx) throw new Error('Failed to get 2D context for destination canvas')
		destCtx.clearRect(0, 0, width, height) // TODO surely this is unnecessary

		switch (fitMode) {
			case FitMode.Stretch:
				destCtx.drawImage(srcCanvas, 0, 0, width, height)
				break

			case FitMode.Contain:
				const containScale = Math.min(width / inputImage.width, height / inputImage.height)
				const containWidth = inputImage.width * containScale
				const containHeight = inputImage.height * containScale
				const containX = (width - containWidth) / 2
				const containY = (height - containHeight) / 2

				destCtx.drawImage(srcCanvas, containX, containY, containWidth, containHeight)
				break

			case FitMode.Cover:
				const coverScale = Math.max(width / inputImage.width, height / inputImage.height)
				const coverWidth = inputImage.width * coverScale
				const coverHeight = inputImage.height * coverScale
				const coverX = (width - coverWidth) / 2
				const coverY = (height - coverHeight) / 2

				destCtx.drawImage(srcCanvas, coverX, coverY, coverWidth, coverHeight)
				break

			case FitMode.Tile:
				const pattern = destCtx.createPattern(srcCanvas, 'repeat')
				if (!pattern) throw new Error('Failed to create pattern')

				destCtx.fillStyle = pattern
				destCtx.fillRect(0, 0, width, height)
				break

			case FitMode.ActualSize:
				// Just copy the original image data to the top-left corner
				// and leave the rest of the canvas blank
				destCtx.drawImage(srcCanvas, 0, 0)
				break

			default:
				throw new Error(`Unsupported fit mode: ${fitMode}`)
		}

		return destCtx.getImageData(0, 0, width, height)
	}
}
