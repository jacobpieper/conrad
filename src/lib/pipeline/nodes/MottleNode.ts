import BaseNode from './BaseNode'

export default class MottleNode extends BaseNode {
	#noiseArray: number[]
	constructor(id: number) {
		super(id)
		this.type = 'MottleNode'

		this.#noiseArray = []

		// Inputs
		this._createParameter('imageInput', 'imageData', 'input', null)
		this._createParameter('mean', 'number', 'input', 0)
		this._createParameter('standardDeviation', 'number', 'input', 20)
		this._createParameter('arrayLength', 'number', 'input', 2000)

		// Outputs
		this._createParameter('imageOut', 'imageData', 'output', null)
	}

	async onRun(): Promise<void> {
		const mean = this._getParameterValue('mean').value as number
		const sd = this._getParameterValue('standardDeviation').value as number
		const length = this._getParameterValue('arrayLength').value as number

		this.#noiseArray = this.#generateNoiseArray(mean, sd, length)
	}

	async onFrame(): Promise<ImageData> {
		const inputImage = this._getParameterValue('imageInput').value as ImageData

		const outputImage = new ImageData(
			new Uint8ClampedArray(inputImage.data),
			inputImage.width,
			inputImage.height
		)

		// Apply noise
		for (let i = 0; i < outputImage.data.length; i += 4) {
			const randIndex = Math.floor(Math.random() * this.#noiseArray.length)
			const pixelValue = outputImage.data[i] + this.#noiseArray[randIndex]

			outputImage.data[i + 0] = pixelValue
			outputImage.data[i + 1] = pixelValue
			outputImage.data[i + 2] = pixelValue
		}

		return outputImage
	}

	#getNormalValue(mean: number, sd: number): number {
		// Box-Muller transform
		let u = Math.random()
		let v = Math.random()
		return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
	}

	#generateNoiseArray(mean: number, sd: number, length: number): number[] {
		const noiseArray: number[] = []
		for (let i = 0; i < length; i++) {
			noiseArray.push(this.#getNormalValue(mean, sd))
		}
		return noiseArray
	}
}
