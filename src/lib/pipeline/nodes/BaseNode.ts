import type {
	Node,
	NodeParameter,
	NodeParameterRole,
	NodeParameterType,
	NodeType,
} from '$lib/types'
import Vector2 from '$lib/utils/Vector2'

/**
 * @class BaseNode
 */
export default class BaseNode implements Node {
	#configNumber: number

	id: number
	type: NodeType
	parameters: NodeParameter[]
	position: Vector2
	hasResource: boolean = false

	constructor(id: number) {
		this.id = id
		this.type = 'BaseNode'
		this.parameters = []
		this.position = new Vector2(0, 0)

		this.#configNumber = 0
	}

	_createParameter(
		name: string,
		type: NodeParameterType,
		role: NodeParameterRole,
		value: any
	): void {
		const id: number = this.#configNumber++
		const portPosition: Vector2 = new Vector2(0, 0)
		const config = {} //TODO add this functionality

		this.parameters.push({
			name,
			value,
			type,
			role,
			id,
			config,
			portPosition,
		})
	}

	_getParameterValue(name: string): NodeParameter {
		const item = this.parameters.find((parameter: NodeParameter) => parameter.name === name)
		if (!item) {
			throw new Error(`Parameter with name "${name}" not found`)
		}
		return item
	}

	async onRun(): Promise<void> {
		// Base initialisation
		console.log('Base init:', this.type)
	}

	async onFrame(): Promise<any> {
		// Base processing
		console.log('Base process:', this.type)
		return null
	}
}
