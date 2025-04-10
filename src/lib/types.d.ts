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

export type NodeParameterType = 'text' | 'boolean' | 'imageData' | 'number' | 'enum' | null

export type NodeParameterRole = 'input' | 'output' | null

export interface NodeParameter {
	name: string
	id: number
	value: any
	type: NodeParameterType
	role: NodeParameterRole
	config: {} = {}
	portPosition: Vector2
}

export interface NodeEvents {
	portClicked: PortReference
	delete: { nodeId: number }
}

export interface Connection {
	output: PortReference
	input: PortReference
}

export interface PortReference {
	node: NodeInstance
	portId: number
}

export enum FitMode {}

export enum BlendMode {}
