import BaseNode from './BaseNode'
import { BlendMode } from '$lib/enums'

export default class BlendNode extends BaseNode {
	constructor(id: number) {
		super(id)
		this.type = 'BlendNode'

		// Inputs
		this._createParameter('imageA', 'imageData', 'input', null)
		this._createParameter('imageB', 'imageData', 'input', null)
		this._createParameter('blendMode', 'enum', 'input', BlendMode.Add)
		this._createParameter('normalise', 'boolean', 'input', false)

		// Outputs
		this._createParameter('imageOut', 'imageData', 'output', null)
	}

	async onRun(): Promise<void> {}

	async onFrame(): Promise<ImageData> {
		let imageA = this._getParameterValue('imageA').value as ImageData
		let imageB = this._getParameterValue('imageB').value as ImageData
		const mode = this._getParameterValue('blendMode').value as BlendMode
		const normalise = this._getParameterValue('normalise').value as boolean

		// Create output image
		const outputImage = new ImageData(
			new Uint8ClampedArray(imageA.data),
			imageA.width,
			imageA.height
		)

		const rawArray = normalise ? new Float16Array(imageA.data.length) : null

		const blendFn = {
			[BlendMode.Add]: this.#blendAdd,
			[BlendMode.Subtract]: this.#blendSubtract,
			[BlendMode.Multiply]: this.#blendMultiply,
			[BlendMode.Screen]: this.#blendScreen,
			[BlendMode.Divide]: this.#blendDivide,
			[BlendMode.Overlay]: this.#blendOverlay,
			[BlendMode.PassA]: this.#blendPassA,
			[BlendMode.PassB]: this.#blendPassB,
		}[mode]

		blendFn(outputImage.data, imageA.data, imageB.data, rawArray)

		if (normalise && rawArray) {
			this.#normaliseArray(rawArray, outputImage.data)
		}

		return outputImage
	}

	#normaliseArray(rawArray: Float16Array, outputArray: Uint8ClampedArray): void {
		let min = Infinity
		let max = -Infinity

		// Find min/max (skip alpha channels)
		for (let i = 0; i < rawArray.length; i += 4) {
			for (let j = 0; j < 3; j++) {
				const value = rawArray[i + j]
				min = Math.min(min, value)
				max = Math.max(max, value)
			}
		}

		// Scale to 0 - 255
		const range = max - min
		const scale = range === 0 ? 0 : 255 / range

		for (let i = 0; i < rawArray.length; i += 4) {
			for (let j = 0; j < 3; j++) {
				outputArray[i + j] = Math.round((rawArray[i + j] - min) * scale)
			}
		}
	}

	#blendAdd(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			const pixelValue = a[i] + b[i]
			if (raw) {
				raw[i + 0] = pixelValue
				raw[i + 1] = pixelValue
				raw[i + 2] = pixelValue
			} else {
				out[i + 0] = pixelValue
				out[i + 1] = pixelValue
				out[i + 2] = pixelValue
			}
		}
	}

	#blendSubtract(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			const pixelValue = a[i] - b[i]
			if (raw) {
				raw[i + 0] = pixelValue
				raw[i + 1] = pixelValue
				raw[i + 2] = pixelValue
			} else {
				out[i + 0] = pixelValue
				out[i + 1] = pixelValue
				out[i + 2] = pixelValue
			}
		}
	}

	#blendMultiply(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			const pixelValue = (a[i] * b[i]) / 255
			if (raw) {
				raw[i + 0] = pixelValue
				raw[i + 1] = pixelValue
				raw[i + 2] = pixelValue
			} else {
				out[i + 0] = pixelValue
				out[i + 1] = pixelValue
				out[i + 2] = pixelValue
			}
		}
	}

	#blendScreen(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			const pixelValue = 255 - ((255 - a[i]) * (255 - b[i])) / 255
			if (raw) {
				raw[i + 0] = pixelValue
				raw[i + 1] = pixelValue
				raw[i + 2] = pixelValue
			} else {
				out[i + 0] = pixelValue
				out[i + 1] = pixelValue
				out[i + 2] = pixelValue
			}
		}
	}

	#blendDivide(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			const pixelValue = b[i] === 0 ? 255 : (a[i] / b[i]) * 255
			if (raw) {
				raw[i + 0] = pixelValue
				raw[i + 1] = pixelValue
				raw[i + 2] = pixelValue
			} else {
				out[i + 0] = pixelValue
				out[i + 1] = pixelValue
				out[i + 2] = pixelValue
			}
		}
	}

	#blendOverlay(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			const pixelValue =
				a[i] < 128 ? (2 * a[i] * b[i]) / 255 : 255 - (2 * (255 - a[i]) * (255 - b[i])) / 255
			if (raw) {
				raw[i + 0] = pixelValue
				raw[i + 1] = pixelValue
				raw[i + 2] = pixelValue
			} else {
				out[i + 0] = pixelValue
				out[i + 1] = pixelValue
				out[i + 2] = pixelValue
			}
		}
	}

	#blendPassA(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			out[i + 0] = a[i]
			out[i + 1] = a[i]
			out[i + 2] = a[i]
		}
	}

	#blendPassB(
		out: Uint8ClampedArray,
		a: Uint8ClampedArray,
		b: Uint8ClampedArray,
		raw: Float16Array | null
	): void {
		for (let i = 0; i < out.length; i += 4) {
			out[i + 0] = b[i]
			out[i + 1] = b[i]
			out[i + 2] = b[i]
		}
	}
}
