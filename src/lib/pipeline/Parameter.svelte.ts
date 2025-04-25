import getId from '$lib/utils/getId'
import type { ParameterType, ParameterRole, ParameterConfiguration } from '$lib/types'
import Vector2 from '$lib/utils/Vector2'

export default class Parameter {
	public name: string
	public type: ParameterType
	public role: ParameterRole
	public id: number
	public value: any = $state()
	public nodeId: number
	public portElement: HTMLElement | null
	//TODO add config (for step, max, min, etc)

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

	public get portPosition(): Vector2 {
		this.portElement = null
		this.setPortElement()

		if (!this.portElement) {
			throw new Error(`Could not find element with ID: id-${this.id}`)
		}

		const rect = this.portElement.getBoundingClientRect()

		const x = rect.left + rect.width / 2
		const y = rect.top + rect.height / 2

		return new Vector2(x, y)
	}

	//~ PRIVATE METHODS
	private setPortElement(): void {
		if (this.portElement) return

		this.portElement = document.getElementById(`id-${this.id}`)
	}
}
