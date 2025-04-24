import type { CanvasConfiguration, CanvasObject } from '$lib/types'
import getId from '$lib/utils/getId'

export class CanvasManager {
	private canvasObjects: CanvasObject[] = $state([])

	constructor(canvasConfigurations: CanvasConfiguration[]) {
		// Get canvas elements from the DOM
		const canvasElements = this.getCanvasElements()

		// Create canvas objects and add them to the objects array
		const canvasObjects = this.createCanvasObjects(canvasConfigurations, canvasElements)

		// Set the objects array using all canvas objects
		this.canvasObjects = canvasObjects
	}

	//~ PRIVATE METHODS
	private getCanvasElements(): HTMLCanvasElement[] {
		return Array.from(document.querySelectorAll('.canvas-panel canvas'))
	}

	private createCanvasObjects(
		canvasConfigurations: CanvasConfiguration[],
		canvasElements: HTMLCanvasElement[]
	): CanvasObject[] {
		return canvasElements.map((canvas, index) => {
			// If there's a matching configuration, use it; otherwise use default values
			const configuration =
				index < canvasConfigurations.length
					? canvasConfigurations[index]
					: { name: `Canvas-${index + 1}` }

			// Create and return the canvas object
			return {
				name: configuration.name,
				id: getId(),
				canvas: canvas,
			}
		})
	}

	//~ PUBLIC METHODS
	public getCanvasById(id: number): CanvasObject | undefined {
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
			id: getId(),
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
		return this.canvasObjects
	}
}
