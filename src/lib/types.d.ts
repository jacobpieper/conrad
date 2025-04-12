import type Vector2 from '$lib/utils/Vector2'
import type BaseNode from './pipeline/nodes/BaseNode'
import type ImageCacheNode from './pipeline/nodes/ImageCacheNode'
import type RenderNode from './pipeline/nodes/RenderNode'

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
	hasResource: boolean
	onRun(): Promise<void>
	onFrame(): Promise<any>
}

export type NodeType = 'BaseNode' | 'ImageCacheNode' | 'RenderNode'

export type NodeInstance = BaseNode | ImageCacheNode | RenderNode

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
	parameterId: number
	position?: Vector2
}

export type AdjacencyList = Map<number, number[]>

export interface LayoutLoadData {
	isPreview: boolean;
}