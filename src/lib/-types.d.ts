import type Vector2 from '$lib/utils/Vector2'
import type BaseNode from './pipeline/nodes/BaseNode'
import type BlendNode from './pipeline/nodes/BlendNode'
import type ImageCacheNode from './pipeline/nodes/ImageCacheNode'
import type MottleNode from './pipeline/nodes/MottleNode'
import type RenderNode from './pipeline/nodes/RenderNode'
import type ResizeNode from './pipeline/nodes/ResizeNode'

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

export type NodeType = 'BaseNode' | 'ImageCacheNode' | 'RenderNode' | 'MottleNode' | 'BlendNode' | 'ResizeNode'

export type NodeInstance = BaseNode | ImageCacheNode | RenderNode | MottleNode | BlendNode | ResizeNode

export type NodeParameterType = 'text' | 'boolean' | 'imageData' | 'number' | 'enum' | null //! Delete

export type NodeParameterRole = 'input' | 'output' | null //! Delete

export type ParameterType = 'text' | 'boolean' | 'imageData' | 'number' | 'enum' | null

export type ParameterRole = 'input' | 'output' | null

export interface NodeParameter { //! Delete when done
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

export interface DragState {
	isDragging: boolean
	start: Vector2
	offset: Vector2
}

export interface ParameterConfiguration {
	name: string
	type: ParameterType
	role: ParameterRole
	value: any
}