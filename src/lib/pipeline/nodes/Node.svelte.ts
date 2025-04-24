import type { NodeType, ParameterConfiguration } from '$lib/types'
import Parameter from '$lib/pipeline/Parameter.svelte'
import getId from '$lib/utils/getId'
import Vector2 from '$lib/utils/Vector2'

export class Node {
	public type: NodeType = 'Node'
	public displayName: string = 'Node'
	public id: number = getId()
	public parameters: Parameter[] = []
	public element: HTMLElement | null = null

	//~ BASE METHODS
	public async onInit(): Promise<void> {}

	public async onRun(): Promise<void> {}

	public async onFrame(): Promise<any> {}

	//~ PUBLIC METHODS
	public createParameter(configuration: ParameterConfiguration): void {
		const parameter = new Parameter(configuration, this.id)
		this.parameters.push(parameter)
	}

	public getParameterByName(name: string): Parameter {
		const parameter = this.parameters.find((param: Parameter) => param.name === name)
		if (!parameter) {
			throw new Error(`Parameter with name "${name}" not found`)
		}
		return parameter
	}

	public getParameterById(id: number): Parameter {
		const parameter = this.parameters.find((param: Parameter) => param.id === id)
		if (!parameter) {
			throw new Error(`Parameter with id "${id}" not found`)
		}
		return parameter
	}

	public setParameterByName(name: string, value: any): void {
		const parameter = this.getParameterByName(name)
		parameter.value = value
	}

	public setParameterById(id: number, value: any): void {
		const parameter = this.getParameterById(id)
		parameter.value = value
	}

	public get position(): Vector2 {
		// Currently not used as position is handled by style: translation
		this.setElement()

		if (!this.element) {
			throw new Error(`Could not find element with ID: id-${this.id}`)
		}

		const rect = this.element.getBoundingClientRect()
		const x = rect.left + rect.width / 2
		const y = rect.top + rect.height / 2

		return new Vector2(x, y)
	}

	//~ PRIVATE METHODS
	private setElement(): void {
		if (this.element) return

		this.element = document.getElementById(`id-${this.id}`)
	}
}
