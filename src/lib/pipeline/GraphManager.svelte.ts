import { Connection } from './Connection.svelte'
import type { Node } from './nodes/Node.svelte'

export class GraphManager {
	public nodes: Node[] = $state([])
	public connections: Connection[] = $state([])

	//~ PUBLIC METHODS

	public addNode(node: Node): void {
		// Need to add error checking to check if already in array
		this.nodes = [...this.nodes, node]
	}

	public removeNode(id: number): void {
		this.nodes = this.nodes.filter((node) => node.id !== id)
	}

	public clearNodes(): void {
		this.clearConnections()
		this.nodes = []
	}

	public getNodeById(nodeId: number): Node {
		const node = this.nodes.find((n) => n.id === nodeId)

		if (!node) throw new Error(`Node with ID ${nodeId} not found`)

		return node
	}

	public addConnection(connection: Connection): void {
		// Need to add error checking to check if already in array
		this.connections = [...this.connections, connection]
	}

	public removeConnectionById(id: number): void {
		this.connections = this.connections.filter((connection) => connection.id !== id)
	}

	public removeConnectionsByNode(nodeId: number): void {
		this.connections = this.connections.filter(
			(connection) => connection.from.nodeId !== nodeId && connection.to.nodeId !== nodeId
		)
	}

	public clearConnections(): void {
		this.connections = []
	}

	/**
	 * Updates all connections by triggering a UI update
	 * Call this after port positions have been changed
	 * @param nodeId Optional nodeId to only update connections for a specific role
	 */
	public updateConnections(nodeId?: number): void {
		if (nodeId) {
			const node = this.getNodeById(nodeId)
			node.updatePortPositions()
		} else {
			this.nodes.forEach((node) => node.updatePortPositions())
		}

		const newConnections = this.connections.map((conn) => {
			const newConn = new Connection(conn.from, conn.to)
			newConn.id = conn.id

			conn.from.portElement = null
			conn.to.portElement = null

			return newConn
		})

		this.connections = newConnections
	}
}
