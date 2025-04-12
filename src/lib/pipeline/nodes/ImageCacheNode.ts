import BaseNode from './BaseNode'

export default class ImageCacheNode extends BaseNode {
	#cachedImage: ImageData | null

	constructor(id: number) {
		super(id)
		this.type = 'ImageCacheNode'

		this.#cachedImage = null

		// Inputs
		this._createParameter('source', 'text', 'input', '/imgs/lena.bmp')

		// Outputs
		this._createParameter('imageOut', 'imageData', 'output', null)
	}

	async onRun(): Promise<void> {
		const source = this._getParameterValue('source').value as string

		if (!source.startsWith('/')) {
			console.warn('Image path should start with /', source)
		}

		await this.cacheImage()
		if (!this.#cachedImage) {
			console.error('Failed to load image:', source)
		}
	}

	async onFrame(): Promise<ImageData | null> {
		//if (!this.cachedImage) {
		//	throw new Error('No image data available - image may have failed to load')
		//}
		return this.#cachedImage
	}

	loadImage(): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const source = this._getParameterValue('source').value as string

			const imageElement = new Image()
			imageElement.crossOrigin = 'anonymous'

			imageElement.onload = () => {
				resolve(imageElement)
			}
			imageElement.onerror = (err) => {
				console.error('Failed to laod image:', {
					source,
					error: err,
					fullPath: window.location.origin + source,
					exists: fetch(source).then((r) => r.ok),
				})
				reject(new Error(`Failed to load image: ${source}`))
			}

			imageElement.src = source
		})
	}

	async cacheImage(): Promise<void> {
		try {
			const imageElement = await this.loadImage()

			const osCanvas = new OffscreenCanvas(imageElement.width, imageElement.height)
			const osCtx = osCanvas.getContext('2d')
			if (!osCtx) throw new Error('Unable to get 2D context')

			osCtx.drawImage(imageElement, 0, 0)
			this.#cachedImage = osCtx.getImageData(0, 0, osCanvas.width, osCanvas.height)
		} catch (err) {
			console.error('Error caching image:', err)
			this.#cachedImage = null
			throw err // re-throw to propagate error
		}
	}
}
