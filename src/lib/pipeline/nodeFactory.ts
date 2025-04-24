import getId from '$lib/utils/getId'
import ImageCacheNode from '$lib/pipeline/nodes/ImageCacheNode.svelte'
import RenderNode from '$lib/pipeline/nodes/RenderNode.svelte'
import type { Node } from './nodes/Node.svelte'
import type { NodeType } from '$lib/types'
import MottleNode from './nodes/MottleNode'
import BlendNode from './nodes/BlendNode'
import ResizeNode from './nodes/ResizeNode'

export default function nodeFactory(type: NodeType): Node {
	let node: Node | null = null

	switch (type) {
		case 'ImageCacheNode':
			node = new ImageCacheNode()
			break
		case 'RenderNode':
			node = new RenderNode()
			break
		//case 'MottleNode':
		//	node = new MottleNode()
		//	break
		//case 'BlendNode':
		//	node = new BlendNode()
		//	break
		//case 'ResizeNode':
		//	node = new ResizeNode()
		//	break
		default:
			throw new Error(`Node type "${type}" not recognised.`)
	}

	return node
}
