import { nodeFactory } from '../utils/nodeFactory'
import { Node, type NodeType } from './nodes/Node'
import { Edge } from './Edge'

interface SerialisedGraph {
	name?: string
	nodes: Node[]
	edges: Edge[]
}

export class Graph {
	public name?: string = $state('')
	public nodes: Node[] = $state([])
	public edges: Edge[] = $state([])
	public processingOrder: Node[] = []

	private fps = 4
	private initialised = false
	private running = false
	private animationFrameId: number | null = null

	constructor(name?: string) {
		this.name = name
	}

	//~ PUBLIC METHODS
	public addNode(nodeType: NodeType): void {
		const node = nodeFactory(nodeType)
		this.nodes = [...this.nodes, node]
	}

	public removeNode(id: string): void {
		this.removeNodesEdges(id)
		this.nodes = this.nodes.filter((node) => node.id !== id)
	}

	public getNode(id: string): Node {
		const node = this.nodes.find((n) => n.id === id)
		if (!node) throw new Error(`Node with ID "${id}" not found`)
		return node
	}

	public getNodeFromParameter(parameterId: string): Node {
		const node = this.nodes.find((n) => n.parameters.some((p) => p.id === parameterId))
		if (!node) throw new Error(`Node with parameter ID "${parameterId}" not found`)

		return node
	}

	public clearNodes(): void {
		this.clearEdges()
		this.nodes = []
	}

	public addEdge(edge: Edge): void {
		this.edges = [...this.edges, edge]
	}

	public removeEdge(id: string): void {
		this.edges = this.edges.filter((edge) => edge.id !== id)
	}

	public removeNodesEdges(nodeId: string): void {
		const node = this.nodes.find((node) => node.id === nodeId)

		if (!node) {
			console.warn(`Cannot remove edges: Node with ID "${nodeId}" not found`)
			return
		}

		const parameterIds = node.parameters.map((parameter) => parameter.id)

		this.edges = this.edges.filter((edge) => {
			const fromBelongsToNode = parameterIds.includes(edge.from.id)
			const toBelongsToNode = parameterIds.includes(edge.to.id)

			// Keep the edge only if neither endpoint belongs to the node
			return !fromBelongsToNode && !toBelongsToNode
		})
	}

	public getEdge(id: string): Edge {
		const edge = this.edges.find((e) => (e.id = id))
		if (!edge) throw new Error(`Edge with ID "${id}" not found`)
		return edge
	}

	public clearEdges(): void {
		this.edges = []
	}

	public async start(): Promise<void> {
		console.log('start')
		this.running = true
		await this.onRun()

		const frameInterval = 1000 / this.fps
		let lastFrameTime = 0

		const frame = async (timestamp: number) => {
			if (!this.running) return

			if (timestamp - lastFrameTime >= frameInterval) {
				await this.onFrame()
				lastFrameTime = timestamp
			}
			this.animationFrameId = requestAnimationFrame(frame)
		}

		this.animationFrameId = requestAnimationFrame(frame)
	}

	public stop(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId)
		}
		this.running = false
		this.initialised = false
	}

	private async onRun(): Promise<void> {
		if (this.initialised) return

		for (const node of this.processingOrder) {
			await node.onRun()
		}

		this.initialised = true
	}

	private async onFrame(): Promise<void> {
		if (!this.initialised) {
			throw new Error('Pipeline not initialised')
		}

		for (const node of this.processingOrder) {
			const result = await node.onFrame()

			// Find all edges where this node is the source
			const nodeParameters = node.parameters.map((parameter) => parameter.id)
			const outputEdges = this.edges.filter(
				(edge) => nodeParameters.includes(edge.from.id) && edge.from.direction === 'output'
			)

			// For each output edge, pass the result to the connected input parameter
			for (const edge of outputEdges) {
				const targetNode = this.getNodeFromParameter(edge.to.id)

				if (targetNode) {
					// Find the parameter in the target node
					const targetParameter = targetNode.parameters.find(
						(parameter) => parameter.id === edge.to.id
					)

					if (targetParameter && targetParameter.direction === 'input') {
						targetParameter.value = result
					}
				}
			}
		}
	}

	public getProcessingOrder(): void {
		const adjacencyList: Map<string, string[]> = this.buildAdjacencyList()
		const visited = new Set<String>()
		const processed = new Set<String>()
		const result: Node[] = []

		// Depth first search algorithm to get topological sort
		const dfs = (nodeId: string): void => {
			// Check for recursion
			if (visited.has(nodeId) && !processed.has(nodeId)) {
				throw new Error('Recursive cycle detected in graph - cannot determine processing order.')
			}

			// Skip if already processed
			if (processed.has(nodeId)) return

			// Mark as visited
			visited.add(nodeId)

			// Process neighbors
			const neighbors = adjacencyList.get(nodeId) || []
			for (const neighborId of neighbors) {
				dfs(neighborId)
			}

			// Add to result and mark as processed
			const node = this.getNode(nodeId)
			if (node) {
				result.unshift(node) // Add to front for reverse post-ordering
			}
			processed.add(nodeId)
		}

		// Process all nodes to handle disconnected components
		for (const node of this.nodes) {
			if (!visited.has(node.id)) {
				dfs(node.id)
			}
		}

		this.processingOrder = result
	}

	private buildAdjacencyList(): Map<string, string[]> {
		const adjacencyList = new Map<string, string[]>()

		// Initialise empty array for each node
		this.nodes.forEach((node) => {
			adjacencyList.set(node.id, [])
		})

		// Add edges based on parameter connections
		this.edges.forEach((edge) => {
			const fromNode = this.getNodeFromParameter(edge.from.id)
			const toNode = this.getNodeFromParameter(edge.to.id)

			if (fromNode && toNode) {
				// Get current edges for the from node
				const edges = adjacencyList.get(fromNode.id) || []

				// Add the target node ID to the edges array
				edges.push(toNode.id)

				// Update the adjacency list
				adjacencyList.set(fromNode.id, edges)
			}
		})

		return adjacencyList
	}

	public serialise(): string {
		// Create a serialisable representation of the graph
		const serialisedGraph = {
			name: this.name,
			nodes: this.nodes.map((node) => ({
				id: node.id,
				type: node.type,
				name: node.name,
				parameters: node.parameters.map((parameter) => ({
					id: parameter.id,
					name: parameter.name,
					dataType: parameter.dataType,
					direction: parameter.direction,
					value: this.serialiseParameterValue(parameter.value),
				})),
			})),
			edges: this.edges.map((edge) => ({
				id: edge.id,
				from: edge.from.id,
				to: edge.to.id,
			})),
		}

		return JSON.stringify(serialisedGraph, null, 2)
	}

	private serialiseParameterValue(value: any): any {
		if (value === undefined || value === null) {
			return null
		}

		// Handle common data types
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			return value
		}

		// Handle arrays
		if (Array.isArray(value)) {
			return value.map((item) => this.serialiseParameterValue(item))
		}

		// Handle objects that have a toJSON method
		if (typeof value === 'object' && value.toJSON) {
			return value.toJSON()
		}

		// Handle simple objects
		if (typeof value === 'object') {
			const result: Record<string, any> = {}

			// Skip non-serializable objects
			if (
				value instanceof HTMLElement ||
				value instanceof File ||
				value instanceof Blob ||
				value instanceof MediaStream
			) {
				return null
			}

			// Handle plain objects by recursively serializing their properties
			try {
				Object.keys(value).forEach((key) => {
					if (typeof value[key] !== 'function' && key[0] !== '_') {
						result[key] = this.serialiseParameterValue(value[key])
					}
				})
				return result
			} catch (e) {
				// If there's any error in serializing, just return null
				return null
			}
		}

		// For other types (like functions), return null
		return null
	}
}
