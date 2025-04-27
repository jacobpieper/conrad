import type { GraphManager } from './GraphManager.svelte'
import type { Node } from './nodes/Node.svelte'

type AdjacencyList = Map<number, number[]>

export class GraphEngine {
	private manager: GraphManager
	private fps: number
	private processingOrder: Node[] = []
	private initialised: boolean = false
	private running: boolean = false
	private animationFrameId: number | null = null

	constructor(graphManager: GraphManager, fps: number) {
		this.manager = graphManager
		this.fps = fps
		this.processingOrder = this.getProcessingOrder()
	}

	//~ PUBLIC METHODS
	public async startSingleFrame(): Promise<void> {
		this.running = true
		await this.onRun()
		await this.onFrame()
		this.stop()
	}

	public async start(): Promise<void> {
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

	public get isRunning(): boolean {
		return this.running
	}

	//~ PRIVATE METHODS
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
			// Get result from node's onFrame method
			const result = await node.onFrame()

			// Find output connections from this node
			const outputConnections = this.manager.connections.filter(
				(connection) => connection.from.nodeId === node.id
			)

			// Pass result to connected inputs
			for (const connection of outputConnections) {
				if (connection.to) {
					connection.to.value = result
				}
			}
		}
	}

	private getProcessingOrder(): Node[] {
		const adjacencyList: AdjacencyList = this.buildAdjacencyList()
		const visited = new Set<number>()
		const processed = new Set<number>()
		const result: Node[] = []

		// Depth first search algorithm
		const dfs = (nodeId: number): void => {
			// Check for recursion
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
			const node = this.manager.nodes.find((n) => n.id === nodeId)
			if (node) {
				result.unshift(node) // Add to front since we want to reverse order postordering
			}
			processed.add(nodeId)
		}

		// Process all nodes to handle disconnected components
		for (const node of this.manager.nodes) {
			if (!visited.has(node.id)) {
				dfs(node.id)
			}
		}

		return result
	}

	private buildAdjacencyList(): AdjacencyList {
		const adjacencyList: AdjacencyList = new Map<number, number[]>()

		// Initialise empty arrays for each node
		this.manager.nodes.forEach((node) => {
			adjacencyList.set(node.id, [])
		})

		// Add edges based on connections
		this.manager.connections.forEach((connection) => {
			const fromNodeId = connection.from.nodeId
			const toNodeId = connection.to.nodeId

			const neighbours = adjacencyList.get(fromNodeId) || []
			neighbours.push(toNodeId)
			adjacencyList.set(fromNodeId, neighbours)
		})

		return adjacencyList
	}
}
