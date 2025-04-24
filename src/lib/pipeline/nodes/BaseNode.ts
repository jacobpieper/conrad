import type {
	Node,
	NodeParameter,
	NodeParameterRole,
	NodeParameterType,
	NodeType,
	ParameterConfiguration,
} from '$lib/-types'
import Parameter from '../Parameter.svelte'
import Vector2 from '$lib/utils/Vector2'
import getId from '$lib/utils/getId'

export default class BaseNode {
	public id: number
	public type: NodeType
	public parameters: Parameter[]
	public element: HTMLElement | null

	constructor() {
		this.id = getId()
		this.type = 'BaseNode'
		this.parameters = []
		this.element = null
	}

	//~ PUBLIC METHODS

	public createParameter(configuration: ParameterConfiguration): void {
		const parameter = new Parameter(configuration, this.id)
		this.parameters.push(parameter)
	}

	public getParameterByName(name: string): Parameter {
		const item = this.parameters.find((parameter: Parameter) => parameter.name === name)
		if (!item) {
			throw new Error(`Parameter with name "${name}" not found`)
		}
		return item
	}

	public getParameterById(id: number): Parameter {
		const item = this.parameters.find((parameter: Parameter) => parameter.id === id)
		if (!item) {
			throw new Error(`Parameter with name "${name}" not found`)
		}
		return item
	}

	public setParameterByName(name: string, value: any): void {
		const parameter = this.getParameterByName(name)
		parameter.value = value
	}

	public setParameterById(id: number, value: any): void {
		const parameter = this.getParameterById(id)
		parameter.value = value
	}

	public getPosition(): Vector2 {
		//TODO Do we need this? position is handled by style: translate
		this.setElement()

		if (!this.element) {
			throw new Error(`Could not find element with ID: id-${this.id}`)
		}

		const rect = this.element.getBoundingClientRect()

		const x = rect.left + rect.width / 2
		const y = rect.top + rect.height / 2

		return new Vector2(x, y)
	}

	public setElement(): void {
		if (this.element) return

		this.element = document.getElementById(`id-${this.id}`)

		if (!this.element) {
			throw new Error(`Could not find element with ID: id-${this.id}`)
		}
	}

	public getPortPositionByName(parameterName: string): Vector2 {
		const parameter = this.getParameterByName(parameterName)
		return parameter.getPortPosition()
	}

	public getPortPositionById(parameterId: number): Vector2 {
		const parameter = this.getParameterById(parameterId)
		return parameter.getPortPosition()
	}

	async onRun(): Promise<void> {
		// Base initialisation
	}

	async onFrame(): Promise<any> {
		// Base processing
		return null
	}
}
