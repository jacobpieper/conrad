import type { Connection } from './Connection.svelte'
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

	public clearConnections() {
		this.connections = []
	}
}
