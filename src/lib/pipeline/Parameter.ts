import getId from '$lib/utils/getId'
import type { ParameterType, ParameterRole, ParameterConfiguration } from '$lib/types'
import Vector2 from '$lib/utils/Vector2'

export default class Parameter {
	public name: string
	public type: ParameterType
	public role: ParameterRole
	public id: number
	public value: any
	public nodeId: number
	public portElement: HTMLElement | null

	constructor(configuration: ParameterConfiguration, nodeId: number) {
		this.name = configuration.name
		this.type = configuration.type
		this.role = configuration.role
		this.id = getId()
		this.value = configuration.value
		this.nodeId = nodeId
		this.portElement = null
	}

	//~ PUBLIC METHODS

	public getPortPosition(): Vector2 {
		this.setPortElement()

		if (!this.portElement) {
			throw new Error(`Could not find element with ID: id-${this.id}`)
		}

		const rect = this.portElement.getBoundingClientRect()

		const x = rect.left + rect.width / 2
		const y = rect.top + rect.height / 2

		return new Vector2(x, y)
	}

	public setPortElement(): void {
		if (this.portElement) return

		this.portElement = document.getElementById(`id-${this.id}`)

		if (!this.portElement) {
			throw new Error(`Could not find element with ID: id-${this.id}`)
		}
	}
}
