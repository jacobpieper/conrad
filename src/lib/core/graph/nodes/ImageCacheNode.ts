import { Node } from './Node'

export enum DefaultImage {
	Lena = 'Lena',
	GradientHorizontal = 'Gradient Horizontal',
	GradientRadial = 'Gradient Radial',
}

const PATH_MAP: Record<DefaultImage, string> = {
	[DefaultImage.Lena]: '/images/lena.bmp',
	[DefaultImage.GradientHorizontal]: '/images/gradient_256.webp',
	[DefaultImage.GradientRadial]: '/images/radial_256.webp',
}

export class ImageCacheNode extends Node {
	private cachedImage: ImageData | null = null

	constructor() {
		super()
		this.type = 'ImageCacheNode'
		this.name = 'Image Cache'

		this.createParameter({
			name: 'Image',
			dataType: 'array',
			direction: 'input',
			value: DefaultImage.Lena,
		})

		this.createParameter({
			name: 'Cached Image',
			dataType: 'imageData',
			direction: 'output',
			value: null,
		})
	}

	//~ BASE METHODS
	async onRun(): Promise<void> {
		const defaultImage = this.getParameter('Image').value as DefaultImage
		const imagePath = PATH_MAP[defaultImage]

		await this.cacheImage(imagePath)
		if (!this.cachedImage) {
			console.error('Failed to load image:', imagePath)
		}
	}

	async onFrame(): Promise<ImageData | null> {
		return this.cachedImage
	}

	//~ PRIVATE METHODS
	private async cacheImage(imagePath: string): Promise<void> {
		try {
			const imageElement = await this.loadImage(imagePath)

			const osCanvas = new OffscreenCanvas(imageElement.width, imageElement.height)
			const osCtx = osCanvas.getContext('2d')
			if (!osCtx) throw new Error('Unable to get 2D context')

			osCtx.drawImage(imageElement, 0, 0)
			this.cachedImage = osCtx.getImageData(0, 0, osCanvas.width, osCanvas.height)
		} catch (error) {
			console.error('Error caching image:', error)
			this.cachedImage = null
			throw error // re-throw to propagate error
		}
	}

	private loadImage(imagePath: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const imageElement = new Image()
			imageElement.crossOrigin = 'anonymous'

			imageElement.onload = () => {
				resolve(imageElement)
			}
			imageElement.onerror = (error) => {
				console.error('Failed to load image:', {
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
}
