import { IdGenerator } from '../utils/IdGenerator'

export type ParameterDataType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'vector2'
	| 'array'
	| 'imageData'
	| null
export type ParameterDirection = 'input' | 'output'
export interface ParameterConfig {
	name: string
	dataType: ParameterDataType
	direction: ParameterDirection
	value: any
}

export class Parameter {
	public dataType: ParameterDataType
	public name: string
	public direction: ParameterDirection
	public id: string
	public value: any

	constructor(config: ParameterConfig, nodeId: string) {
		this.dataType = config.dataType
		this.name = config.name
		this.direction = config.direction
		this.value = config.value
		this.id = IdGenerator.generateParameterId(nodeId, this.direction, this.dataType)
	}
}
