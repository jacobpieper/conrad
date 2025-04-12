import { writable } from 'svelte/store'
import type { Connection, PortReference } from '$lib/types'
import Vector2 from '$lib/utils/Vector2'

export const connectionsStore = writable<Connection[]>([])
export const containerOffsetStore = writable<Vector2>(new Vector2(0, 0))

/**
 * Helper Functions
 */
export function addConnection(output: PortReference, input: PortReference): void {
	connectionsStore.update((connections) => [...connections, { output, input }])
}

export function removeNodeConnections(nodeId: number): void {
	connectionsStore.update((connections) =>
		connections.filter(
			(connection) => connection.output.node.id !== nodeId && connection.input.node.id !== nodeId
		)
	)
}

export function clearConnections(): void {
	connectionsStore.set([])
}
