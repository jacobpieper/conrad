import getId from '$lib/utils/getId'
import type { ParameterType, ParameterRole } from '$lib/types'
import Vector2 from '$lib/utils/Vector2'

export default class Parameter {
	public type: ParameterType
	public role: ParameterRole
	public id: number
	public value: any
	public nodeId: number
	public portElement: HTMLElement | null

	constructor(type: ParameterType, role: ParameterRole, nodeId: number, value: any) {
		this.type = type
		this.role = role
		this.id = getId()
		this.value = value
		this.nodeId = nodeId
		this.portElement = null
	}

	//~ PUBLIC METHODS

	public getPortPosition(): Vector2 {
		if (!this.portElement) {
			throw new Error(`Element not set for ID: ${this.id}`)
		}

		const rect = this.portElement.getBoundingClientRect()

		const x = rect.left + rect.width / 2
		const y = rect.top + rect.height / 2

		return new Vector2(x, y)
	}

	public setPortElement(): void {
		this.portElement = document.getElementById(`id-${this.id}`)

		if (!this.portElement) {
			console.warn(`Could not find element with ID: id${this.id}`)
		}
	}
}
