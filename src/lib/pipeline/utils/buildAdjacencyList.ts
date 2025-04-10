import type { AdjacencyList, Connection, NodeInstance } from '$lib/types'

/**
 * Builds an adjacency list representation of the graph from connections.
 */
export default function buildAdjacencyList(
	nodes: NodeInstance[],
	connections: Connection[]
): AdjacencyList {
	const adjacencyList: AdjacencyList = new Map<number, number[]>()

	// Initialise empty arrays for all nodes
	nodes.forEach((node) => {
		adjacencyList.set(node.id, [])
	})

	// Add edges based on connections
	connections.forEach((connection) => {
		const outputNodeId = connection.output.node.id
		const inputNodeId = connection.input.node.id

		const neighbours = adjacencyList.get(outputNodeId) || []
		neighbours.push(inputNodeId)
		adjacencyList.set(outputNodeId, neighbours)
	})

	return adjacencyList
}
