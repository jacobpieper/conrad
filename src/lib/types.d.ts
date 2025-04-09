import type Vector2 from '$lib/utils/Vector2'

export interface CanvasObject {
	name: string
	id: number
	canvas: HTMLCanvasElement
}

export interface CanvasConfig {
	name: string
	width: number
	height: number
}

export interface Node {
	id: number
	type: NodeType
	parameters: NodeParameter[]
	position: Vector2
	onRun(): Promise<void>
	onFrame(): Promise<any>
}

export type NodeType = 'BaseNode'

export type NodeInstance = BaseNode

export type NodeParameterType = 'text' | 'boolean' | 'imageData' | 'number' | null

export type NodeParameterDisplayType = 'default' | 'checkbox' | 'dropdown'

export type NodeParameterRole = 'input' | 'output' | null

export interface NodeParameter {
	name: string
	id: number
	value: any
	type: NodeParameterType
	displayType: NodeParameterDisplayType
	role: NodeParameterRole
	position: Vector2
}

export interface Connection {
	output: PortReference
	input: PortReference
}

export interface PortReference {
	node: NodeInstance
	portId: number
}
