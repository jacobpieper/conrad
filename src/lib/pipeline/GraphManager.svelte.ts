import type { NodeType, ParameterRole, ParameterType } from '$lib/types'
import Vector2 from '$lib/utils/Vector2'
import { Connection } from './Connection.svelte'
import nodeFactory from './nodeFactory'
import type { Node } from './nodes/Node.svelte'

export interface SerialisedGraph {
	nodes: SerialisedNode[]
	connections: SerialisedConnection[]
}

interface SerialisedNode {
	id: number
	type: NodeType
	position: { x: number; y: number }
	parameters: SerialisedParameter[]
}

interface SerialisedParameter {
	id: number
	name: string
	type: ParameterType
	role: ParameterRole
	value: any
}

interface SerialisedConnection {
	id: number
	fromNodeId: number
	fromParameterId: number
	toNodeId: number
	toParameterId: number
}

export class GraphManager {
	public nodes: Node[] = $state([])
	public connections: Connection[] = $state([])

	//~ PUBLIC METHODS

	public serialise(): SerialisedGraph {
		const serialisedNodes = this.nodes.map((node) => ({
			id: node.id,
			type: node.type,
			position: {
				x: node.position ? node.position.x : 0,
				y: node.position ? node.position.y : 0,
			},
			parameters: node.parameters.map((parameter) => ({
				id: parameter.id,
				name: parameter.name,
				type: parameter.type,
				role: parameter.role,
				value: this.serialiseParameterValue(parameter),
			})),
		}))

		const serialisedConnections = this.connections.map((connection) => ({
			id: connection.id,
			fromNodeId: connection.from.nodeId,
			fromParameterId: connection.from.id,
			toNodeId: connection.to.nodeId,
			toParameterId: connection.to.id,
		}))

		return {
			nodes: serialisedNodes,
			connections: serialisedConnections,
		}
	}

	public deserialise(data: SerialisedGraph): void {
		// Clear existing graph
		this.clearNodes()

		// Create nodes first
		const nodeMap = new Map<number, Node>()

		for (const serialisedNode of data.nodes) {
			// Create a new node
			const node = nodeFactory(serialisedNode.type)

			// Set the ID to match the serialised data
			node.id = serialisedNode.id

			// Set position
			node.forcePosition = new Vector2(serialisedNode.position.x, serialisedNode.position.y)

			this.addNode(node)
			nodeMap.set(node.id, node)

			// Set parameter values
			for (const serialisedParameter of serialisedNode.parameters) {
				const parameter = node.getParameterById(serialisedParameter.id)
				if (parameter) {
					// Set value based on type
					switch (parameter.type) {
						case 'vector2':
							if (serialisedParameter.value) {
								parameter.value = new Vector2(
									serialisedParameter.value.x,
									serialisedParameter.value.y
								)
							}
							break

						case 'imageData':
							break

						default:
							parameter.value = serialisedParameter.value
							break
					}
				}
			}
		}

		// Create connections
		for (const serializedConn of data.connections) {
			const fromNode = nodeMap.get(serializedConn.fromNodeId)
			const toNode = nodeMap.get(serializedConn.toNodeId)

			if (fromNode && toNode) {
				const fromParam = fromNode.getParameterById(serializedConn.fromParameterId)
				const toParam = toNode.getParameterById(serializedConn.toParameterId)

				if (fromParam && toParam) {
					const connection = new Connection(fromParam, toParam)
					connection.id = serializedConn.id
					this.addConnection(connection)
				}
			}
		}
	}

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

	//~ PRIVATE METHODS
	private serialiseParameterValue(parameter: any): any {
		switch (parameter.type) {
			case 'imageData':
				return null
			case 'vector2':
				return parameter.value ? { x: parameter.value.x, y: parameter.value.y } : null
			default:
				return parameter.value
		}
	}
}
