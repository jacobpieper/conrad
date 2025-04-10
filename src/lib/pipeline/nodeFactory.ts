import getId from '$lib/utils/getId'
import ImageCacheNode from '$lib/pipeline/nodes/ImageCacheNode'
import type { NodeInstance, NodeType } from '$lib/types'

export default function nodeFactory(type: NodeType): NodeInstance {
	let node: NodeInstance | null = null

	switch (type) {
		case 'ImageCacheNode':
			node = new ImageCacheNode(getId())
			break
		default:
			throw new Error(`Node type "${type}" not recognised.`)
	}

	return node
}
