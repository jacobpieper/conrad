import BaseNode from './BaseNode'
import { DefaultImage } from '$lib/enums'

export default class ImageCacheNode extends BaseNode {
	#cachedImage: ImageData | null

	constructor(id: number) {
		super(id)
		this.type = 'ImageCacheNode'

		this.#cachedImage = null

		// Inputs
		this._createParameter('image', 'enum', 'input', DefaultImage.Lena)

		// Outputs
		this._createParameter('imageOut', 'imageData', 'output', null)
	}

	// ~BASE METHODS

	async onRun(): Promise<void> {
		const defaultImage = this._getParameterValue('image').value as DefaultImage

		const imagePath = this.#getImagePath(defaultImage)

		await this.#cacheImage(imagePath)
		if (!this.#cachedImage) {
			console.error('Failed to load image:', imagePath)
		}
	}

	async onFrame(): Promise<ImageData | null> {
		return this.#cachedImage
	}

	// ~UTILITY METHODS

	/**
	 * Returns the file path for the given enum value.
	 */
	#getImagePath(source: DefaultImage): string {
		const pathMap: Record<DefaultImage, string> = {
			[DefaultImage.Lena]: '/images/lena.bmp',
			[DefaultImage.GradientHorizontal]: '/images/gradient_256.webp',
			[DefaultImage.GradientRadial]: '/images/radial_256.webp',
		}

		return pathMap[source]
	}

	#loadImage(imagePath: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const imageElement = new Image()
			imageElement.crossOrigin = 'anonymous'

			imageElement.onload = () => {
				resolve(imageElement)
			}
			imageElement.onerror = (error) => {
				console.error('Failed to laod image:', {
					source: imagePath,
					error,
					fullPath: window.location.origin + imagePath,
					exists: fetch(imagePath).then((r) => r.ok),
				})
				reject(new Error(`Failed to load image: ${imagePath}`))
			}

			imageElement.src = imagePath
		})
	}

	async #cacheImage(imagePath: string): Promise<void> {
		try {
			const imageElement = await this.#loadImage(imagePath)

			const osCanvas = new OffscreenCanvas(imageElement.width, imageElement.height)
			const osCtx = osCanvas.getContext('2d')
			if (!osCtx) throw new Error('Unable to get 2D context')

			osCtx.drawImage(imageElement, 0, 0)
			this.#cachedImage = osCtx.getImageData(0, 0, osCanvas.width, osCanvas.height)
		} catch (error) {
			console.error('Error caching image:', error)
			this.#cachedImage = null
			throw error // re-throw to propagate error
		}
	}
}
