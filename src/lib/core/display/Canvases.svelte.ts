import type Vector2 from '$lib/utils/Vector2'

export interface CanvasObject {
	name: string
	id: string
	canvas: HTMLCanvasElement
}

export interface CanvasConfiguration {
	name: string
	dimensions: Vector2
}

export class Canvases {
	private canvasObjects: CanvasObject[] = $state([])

	private static instance: Canvases | null = null

	constructor(canvasConfigurations: CanvasConfiguration[]) {
		// Set this instance as the singleton
		Canvases.instance = this

		// Get canvas elements from the DOM
		const canvasElements = this.getCanvasElements()

		// Create canvas objects
		this.canvasObjects = this.createCanvasObjects(canvasConfigurations, canvasElements)
	}

	//~ PRIVATE METHODS
	private getCanvasElements(): HTMLCanvasElement[] {
		return Array.from(document.querySelectorAll('.canvases canvas'))
	}

	private createCanvasObjects(
		canvasConfigurations: CanvasConfiguration[],
		canvasElements: HTMLCanvasElement[]
	): CanvasObject[] {
		return canvasElements.map((canvas, index) => {
			// If there's a matching configuration use it; otherwise use default values
			const configuration =
				index < canvasConfigurations.length
					? canvasConfigurations[index]
					: { name: `Canvas=${index + 1}` }

			return {
				name: configuration.name,
				id: '0', //TODO
				canvas: canvas,
			}
		})
	}

	public static getInstance(): Canvases {
		if (!Canvases.instance) {
			throw new Error('CanvasManager not initialised')
		}
		return Canvases.instance
	}

	public getCanvasById(id: string): CanvasObject | undefined {
		return this.canvasObjects.find((object) => object.id === id)
	}

	public getCanvasByName(name: string): CanvasObject | undefined {
		return this.canvasObjects.find((object) => object.name === name)
	}

	public createCanvas(canvasConfiguration: CanvasConfiguration): HTMLCanvasElement {
		// Create a new canvas element
		const canvasElement = document.createElement('canvas')

		// Set dimensions and ID from configuration
		canvasElement.width = canvasConfiguration.dimensions.x
		canvasElement.height = canvasConfiguration.dimensions.y
		canvasElement.id = canvasConfiguration.name

		// Create a canvas object
		const canvasObject: CanvasObject = {
			name: canvasConfiguration.name,
			id: '1', //TODO
			canvas: canvasElement,
		}

		// Add the canvasObject to canvasObjects
		this.canvasObjects = [...this.canvasObjects, canvasObject]

		// Return the canvas element for the user to handle DOM insertion
		return canvasElement
	}

	public removeCanvas(canvasObject: CanvasObject): void {
		this.canvasObjects = this.canvasObjects.filter((object) => object !== canvasObject)
	}

	public get canvases(): CanvasObject[] {
		return [...this.canvasObjects]
	}
}
