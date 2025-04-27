import type Vector2 from './utils/Vector2'

export interface CanvasConfiguration {
	name: string
	dimensions: Vector2
}

export interface CanvasObject {
	name: string
	id: number
	canvas: HTMLCanvasElement
}

export type NodeType =
	| 'Node'
	| 'ImageCacheNode'
	| 'RenderNode'
	| 'MottleNode'
	| 'BlendNode'
	| 'ResizeNode'

export type ParameterType = 'text' | 'boolean' | 'imageData' | 'number' | 'enum' | 'vector2' | null

export type ParameterRole = 'input' | 'output' | null

export interface ParameterConfiguration {
	name: string
	type: ParameterType
	role: ParameterRole
	value: any
}

export type SimpleOption = {
	value: string
	label: string
}

export type GroupOption = {
	type: 'group'
	label: string
	options: SimpleOption[]
}
