import type { NodeInstance, Connection, AdjacencyList } from '$lib/types'
import buildAdjacencyList from './buildAdjacencyList'

/**
 * Performs topological sort using DFS
 */
export function getProcessingOrder(
	nodes: NodeInstance[],
	connections: Connection[]
): NodeInstance[] {
	const adjacencyList: AdjacencyList = buildAdjacencyList(nodes, connections)
	const visited = new Set<number>()
	const processed = new Set<number>()
	const result: NodeInstance[] = []

	// dfs = Depth First Search algorithm
	function dfs(nodeId: number): void {
		// Check for recursive cycles
		if (visited.has(nodeId) && !processed.has(nodeId)) {
			throw new Error('Recursive cycle detected in pipeline - cannot determine processing order.')
		}

		// Skip if already processed
		if (processed.has(nodeId)) return

		// Mark as visited
		visited.add(nodeId)

		// Process neighbours
		const neighbours = adjacencyList.get(nodeId) || []
		for (const neighbourId of neighbours) {
			dfs(neighbourId)
		}

		// Add to result and mark as processed
		const node = nodes.find((n) => n.id === nodeId)
		if (node) {
			result.unshift(node) // Add to front since we want to reverse order postorder
		}
		processed.add(nodeId)
	}

	// Process all nodes to handle disconnected components
	for (const node of nodes) {
		if (!visited.has(node.id)) {
			dfs(node.id)
		}
	}

	return result
}
