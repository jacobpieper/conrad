import { Node, type NodeType } from '../graph/nodes/Node'
import { ImageCacheNode } from '../graph/nodes/ImageCacheNode'
import { RenderNode } from '../graph/nodes/RenderNode'

export function nodeFactory(type: NodeType): Node {
	switch (type) {
		case 'Node':
			return new Node()
		case 'ImageCacheNode':
			return new ImageCacheNode()
		case 'RenderNode':
			return new RenderNode()
		default:
			throw new Error(`Node type "${type}" not recognised`)
	}
}
