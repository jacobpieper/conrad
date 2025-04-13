import getId from '$lib/utils/getId'
import ImageCacheNode from '$lib/pipeline/nodes/ImageCacheNode'
import RenderNode from '$lib/pipeline/nodes/RenderNode'
import type { NodeInstance, NodeType } from '$lib/types'
import MottleNode from './nodes/MottleNode'

export default function nodeFactory(type: NodeType): NodeInstance {
	let node: NodeInstance | null = null

	switch (type) {
		case 'ImageCacheNode':
			node = new ImageCacheNode(getId())
			break
		case 'RenderNode':
			node = new RenderNode(getId())
			break
		case 'MottleNode':
			node = new MottleNode(getId())
			break
		default:
			throw new Error(`Node type "${type}" not recognised.`)
	}

	return node
}
